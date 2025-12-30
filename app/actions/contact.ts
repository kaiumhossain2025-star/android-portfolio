"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase"
import { createAdminClient } from "@/lib/supabase-admin"

export async function getContactMessages() {
    const cookieStore = await cookies()
    const secretCookie = cookieStore.get("admin-secret-access")

    // 1. If authorized via Secret Cookie, use Admin Client (bypassing RLS)
    if (secretCookie?.value === "true") {
        const adminClient = createAdminClient()
        const { data, error } = await adminClient
            .from("contact_messages")
            .select("*")
            .order("id", { ascending: false })

        if (error) {
            console.error("Error fetching messages (admin):", error)
            throw new Error("Failed to fetch messages")
        }
        return data
    }

    // 2. Otherwise, try standard Supabase Auth (respecting RLS)
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("id", { ascending: false })

    if (error) {
        console.error("Error fetching messages (user):", error)
        throw new Error("Failed to fetch messages")
    }

    return data
}
