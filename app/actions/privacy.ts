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

export async function updatePrivacy(data: { id?: string | null, title: string, description: string, content: string }) {
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
    
    const { data: updatedData, error } = await supabase
        .from('privacy_policy_page')
        .upsert(payload)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/privacy')
    revalidatePath('/admin/privacy')
    return { success: true, data: updatedData }
}

export async function getPrivacy() {
    const supabase = await createServerSideClient()
    const { data } = await supabase
        .from('privacy_policy_page')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
    return data
}
