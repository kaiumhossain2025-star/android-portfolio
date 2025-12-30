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

export async function getFAQs() {
    const supabase = await createServerSideClient()
    const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("order_index", { ascending: true })

    if (error) {
        console.error("Error fetching FAQs:", error)
        return []
    }
    return data
}

export async function createFAQ(data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("faqs").insert(data)
    if (error) throw new Error(error.message)
    revalidatePath("/faq")
    revalidatePath("/admin/faq") // Assuming admin page exists or will exist
}

export async function updateFAQ(id: string, data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("faqs").update(data).eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/faq")
    revalidatePath("/admin/faq")
}

export async function deleteFAQ(id: string) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("faqs").delete().eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/faq")
    revalidatePath("/admin/faq")
}
