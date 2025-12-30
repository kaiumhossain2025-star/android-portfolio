
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" }) // Try local first, then .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedUsers() {
    console.log("Seeding users...")

    const users = [
        { email: "super-admin@admin.com", password: "password123", role: "super-admin", name: "Super Admin" },
        { email: "admin@admin.com", password: "password123", role: "admin", name: "Admin User" },
        { email: "a@a.com", password: "11112222", role: "super-admin", name: "Main Admin" },
    ]

    for (const u of users) {
        // 1. Create User
        const { data, error } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
        })

        if (error) {
            console.log(`User ${u.email} might already exist:`, error.message)
            // Try to get ID if exists
            // Actually if they exist, we just ensure profile exists
            // We can't get ID easily by email without admin list users, which we can do
        }

        let userId = data.user?.id

        if (!userId) {
            // Fetch user ID if creation failed (likely exists)
            const { data: listData } = await supabase.auth.admin.listUsers()
            const existing = listData.users.find(x => x.email === u.email)
            if (existing) userId = existing.id
        }

        if (userId) {
            // 2. Create/Update Profile
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert({
                    id: userId,
                    email: u.email,
                    role: u.role,
                    name: u.name
                }, { onConflict: "id" })

            if (profileError) {
                console.error(`Failed to create profile for ${u.email}:`, profileError)
            } else {
                console.log(`✅ Success: ${u.email} as ${u.role}`)
            }
        } else {
            console.error(`Could not find or create user ID for ${u.email}`)
        }
    }
}

seedUsers()
