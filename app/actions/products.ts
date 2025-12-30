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

export async function getProducts() {
    const supabase = await createServerSideClient()
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("order_index")

    if (error) {
        console.error("Error fetching products:", error)
        return []
    }
    return data
}

export async function getProduct(id: string) {
    const supabase = await createServerSideClient()
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

    if (error) return null
    return data
}


export async function createProduct(data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("products").insert(data)
    if (error) throw new Error(error.message)
    revalidatePath("/products")
    revalidatePath("/")
    revalidatePath("/admin/products")
}

export async function updateProduct(id: string, data: any) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("products").update(data).eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/products")
    revalidatePath("/")
    revalidatePath("/admin/products")
}

export async function deleteProduct(id: string) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    const supabase = createAdminClient()
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) throw new Error(error.message)
    revalidatePath("/products")
    revalidatePath("/")
    revalidatePath("/admin/products")
}

export async function revalidateProducts() {
    revalidatePath("/products")
    revalidatePath("/")
}
