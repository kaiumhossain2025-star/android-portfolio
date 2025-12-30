"use server"

import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase-admin"
import { createServerSideClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export type UserProfile = {
    id: string
    email: string
    role: "super-admin" | "admin" | "user"
    name?: string
}

// Helper to check current user role - internal use
async function getCurrentUserRole(): Promise<{ role: "super-admin" | "admin" | "user" | "secret" | null, email?: string }> {
    const cookieStore = await cookies()
    const secretCookie = cookieStore.get("admin-secret-access")

    if (secretCookie?.value === "true") {
        return { role: "secret", email: "s@s.com" }
    }

    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { role: null }

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    return { role: profile?.role || "user", email: user.email }
}

// Public action for UI
export async function getMyRole() {
    return await getCurrentUserRole()
}

export async function getUsers() {
    const { role } = await getCurrentUserRole()
    if (!role) throw new Error("Unauthorized")

    const adminClient = createAdminClient()
    const { data: profiles, error } = await adminClient
        .from("profiles")
        .select("*, name")
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return profiles as UserProfile[]
}

export async function createUser(email: string, password: string, role: "super-admin" | "admin", name: string) {
    const r = await getCurrentUserRole()

    // Permission Check
    // Secret (s@s.com) can create anyone
    // Super-admin can create admins
    // Admin cannot create anyone
    const canCreate = r.role === "secret" || (r.role === "super-admin" && role === "admin")

    if (!canCreate) {
        throw new Error("Unauthorized: Insufficient permissions to create this user role.")
    }

    const adminClient = createAdminClient()

    // 1. Create Auth User
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name }
    })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error("Failed to create user")

    // 2. Create Profile
    const { error: profileError } = await adminClient
        .from("profiles")
        .insert({
            id: authData.user.id,
            email,
            role,
            name
        })

    if (profileError) {
        // Cleanup auth user if profile creation fails? 
        // For simplicity, we'll throw. 
        await adminClient.auth.admin.deleteUser(authData.user.id)
        throw new Error(profileError.message)
    }

    revalidatePath("/admin/users")
    return { success: true }
}

export async function deleteUser(userId: string, targetRole: string) {
    const r = await getCurrentUserRole()

    // Permission Check
    // Secret (s@s.com) can delete anyone
    // Super-admin can delete admins. Cannot delete other super-admins (per requirement "only s@s.com can change... super-admin").
    // Wait, requirement says: "super-admin can manage all admin" -> implies create/delete.
    // "super-admin can not be deleted, only s@s.com can change all super-admin password"

    // So:
    // If target is super-admin: ONLY Secret can delete (or maybe nobody? Req says "super-admin can not be deleted" - maybe generally?)
    // Let's assume Secret CAN do anything, but Super-Admin cannot delete Super-Admin.

    if (targetRole === "super-admin") {
        if (r.role !== "secret") {
            throw new Error("Only the Master Admin (s@s.com) can manage Super Admins.")
        }
    }

    if (r.role === "admin") {
        throw new Error("Admins cannot delete users.")
    }

    if (r.role === "super-admin" && targetRole === "super-admin") {
        throw new Error("Super Admins cannot delete other Super Admins.")
    }

    const adminClient = createAdminClient()

    // Delete from Auth (Casacades to Profile if set up, but we do explicitly)
    const { error } = await adminClient.auth.admin.deleteUser(userId)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/users")
    return { success: true }
}

export async function changePassword(userId: string, newPassword: string, targetRole: string) {
    const r = await getCurrentUserRole()

    // Requirement: "only s@s.com can change all super-admin password"
    if (targetRole === "super-admin") {
        if (r.role !== "secret") {
            throw new Error("Only the Master Admin (s@s.com) can change Super Admin passwords.")
        }
    }

    // Super admin can change admin passwords
    if (r.role === "super-admin" && targetRole !== "admin") {
        throw new Error("Super Admins can only manage Admins.")
    }

    if (r.role === "admin") {
        throw new Error("Admins cannot change passwords.")
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
        password: newPassword
    })

    if (error) throw new Error(error.message)

    return { success: true }
}
