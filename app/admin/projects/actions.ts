"use server"

import { createAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function saveProject(
  formData: any,
  isEditMode: boolean,
  id?: string
) {
  try {
    const cookieStore = await cookies()
    const secretCookie = cookieStore.get("admin-secret-access")

    if (secretCookie?.value !== "true") {
      return { error: "Unauthorized: You must be logged in." }
    }

    const supabase = createAdminClient()

    let result
    if (isEditMode && id) {
      result = await supabase
        .from("projects")
        .update(formData)
        .eq("id", id)
    } else {
      result = await supabase
        .from("projects")
        .insert(formData)
    }

    if (result.error) {
      console.log("Server Action Supabase Error:", result.error)
      return { error: result.error.message || "Database error occurred" }
    }

    revalidatePath("/admin/projects")
    revalidatePath("/")

    return { success: true }

  } catch (err: any) {
    console.log("Server Action Unexpected Error:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}
