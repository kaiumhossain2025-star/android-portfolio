"use server"

import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase-admin"
import { createServerSideClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export type SocialLink = {
    platform: string
    url: string
}

export type TeamMember = {
    id: string
    name: string
    role: string
    image_url: string | null
    bio: string | null
    social_links: SocialLink[]
    order_index: number
    created_at: string
}

// Helper to check if user is secret admin
async function isSecretAdmin(): Promise<boolean> {
    const cookieStore = await cookies()
    const secretCookie = cookieStore.get("admin-secret-access")
    return secretCookie?.value === "true"
}

// Helper to get authorized client
async function getAuthorizedClient() {
    const isSecret = await isSecretAdmin()
    if (isSecret) {
        return createAdminClient()
    }
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")
    return supabase // This client acts as the authenticated user (Role: authenticated)
}

export async function getTeamMembers() {
    // Public read access is allowed by RLS, but for admin panel we might want to be sure
    // Use admin client for consistent fetching in admin panel, or standard for public
    const adminClient = createAdminClient() // Use admin client to ensure we get data regardless of potential RLS quirks for public

    // Actually, RLS says "Public can view", so createClient from @/lib/supabase should work key.
    // stick to createAdminClient for server-side fetching to be safe and fast.
    const { data, error } = await adminClient
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true })

    if (error) throw new Error(error.message)
    return data as TeamMember[]
}

export async function createTeamMember(data: Omit<TeamMember, "id" | "created_at" | "order_index">) {
    const supabase = await getAuthorizedClient()

    // Get max order index
    const { data: maxOrder } = await supabase
        .from("team_members")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1)
        .single()

    const nextOrder = (maxOrder?.order_index ?? 0) + 1

    const { error } = await supabase
        .from("team_members")
        .insert({
            ...data,
            order_index: nextOrder
        })

    if (error) throw new Error(error.message)
    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")
    return { success: true }
}

export async function updateTeamMember(id: string, data: Partial<Omit<TeamMember, "id" | "created_at">>) {
    const supabase = await getAuthorizedClient()

    const { error } = await supabase
        .from("team_members")
        .update(data)
        .eq("id", id)

    if (error) throw new Error(error.message)
    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")
    return { success: true }
}

export async function deleteTeamMember(id: string) {
    const supabase = await getAuthorizedClient()

    const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message)
    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")
    return { success: true }
}

export async function reorderTeamMembers(items: { id: string, order_index: number }[]) {
    const supabase = await getAuthorizedClient()

    // Supabase doesn't support bulk update easily in one query without RPC
    // We'll loop for now as team size is small. For larger datasets, use RPC.
    for (const item of items) {
        await supabase
            .from("team_members")
            .update({ order_index: item.order_index })
            .eq("id", item.id)
    }

    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")
    return { success: true }
}
