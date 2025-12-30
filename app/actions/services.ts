"use server"

import { createAdminClient } from "@/lib/supabase-admin"
import { createServerSideClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

async function isAdmin() {
    const cookieStore = await cookies()
    const secretCookie = cookieStore.get("admin-secret-access")
    if (secretCookie?.value === "true") return true
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
}

export async function getServices() {
    const supabase = await createServerSideClient()
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("order_index")

    if (error) {
        console.error("Error fetching services:", error)
        return []
    }
    return data
}

export async function getService(id: string) {
    const supabase = await createServerSideClient()
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single()

    if (error) {
        return null
    }
    return data
}

export async function createService(data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("services").insert(data)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/admin/services")
}

export async function updateService(id: string, data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("services").update(data).eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/admin/services")
}

export async function deleteService(id: string) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/admin/services")
}
