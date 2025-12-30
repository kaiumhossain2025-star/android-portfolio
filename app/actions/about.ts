"use server"

import { createAdminClient } from "@/lib/supabase-admin"
import { createServerSideClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

async function isAdmin() {
    const cookieStore = await cookies()
    const secretCookie = cookieStore.get("admin-secret-access")

    // 1. Check Secret Cookie
    if (secretCookie?.value === "true") {
        return true
    }

    // 2. Check Supabase Auth
    const supabase = await createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) return true

    return false
}

export async function updateAbout(data: { id?: string | null, title: string, description: string, content: string }) {
    if (!await isAdmin()) {
        throw new Error("Unauthorized")
    }

    const supabase = createAdminClient()
    
    // If ID is provided, include it in the upsert payload
    const payload: any = {
        title: data.title,
        description: data.description,
        content: data.content,
        updated_at: new Date().toISOString()
    }
    
    if (data.id) {
        payload.id = data.id
    }
    
    // Upsert and return the new data
    const { data: updatedData, error } = await supabase
        .from('about_page')
        .upsert(payload)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/about')
    revalidatePath('/admin/about')
    return { success: true, data: updatedData }
}
