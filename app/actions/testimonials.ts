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

export async function getTestimonials() {
    const supabase = await createServerSideClient()
    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching testimonials:", error)
        return []
    }
    return data
}

export async function createTestimonial(data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("testimonials").insert(data)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/about") // Sometimes shown here
}

export async function updateTestimonial(id: number | string, data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("testimonials").update(data).eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/about")
}

export async function deleteTestimonial(id: number | string) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("testimonials").delete().eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/")
    revalidatePath("/about")
}
