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

export async function getSocials() {
    let supabase
    if (await isAdmin()) {
        supabase = createAdminClient()
    } else {
        supabase = await createServerSideClient()
    }

    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("order_index")

    if (error) {
        console.error("Error fetching socials:", error)
        return []
    }
    return data
}

export async function createSocial(data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("social_links").insert(data)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/admin/socials") // Assuming admin page
}

export async function updateSocial(id: string, data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("social_links").update(data).eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/admin/socials")
}

export async function deleteSocial(id: string) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("social_links").delete().eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/admin/socials")
}
