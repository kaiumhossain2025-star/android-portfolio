import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"

// Load env
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
    console.error("Missing SUPABASE URL or KEY")
    process.exit(1)
}

const supabase = createClient(url, key, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const usersToSeed = [
    {
        email: "a@a.com",
        password: "password123",
        user_metadata: { full_name: "Test User A" }
    },
    {
        email: "c@c.com",
        password: "password123",
        user_metadata: { full_name: "hello" }
    }
]

async function main() {
    console.log("Seeding Users...")

    for (const u of usersToSeed) {
        // Check if exists
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const existing = users.find(x => x.email === u.email)

        if (existing) {
            console.log(`User ${u.email} already exists. ID: ${existing.id}`)
        } else {
            console.log(`Creating ${u.email}...`)
            const { data, error } = await supabase.auth.admin.createUser({
                email: u.email,
                password: u.password,
                email_confirm: true,
                user_metadata: u.user_metadata
            })

            if (error) {
                console.error(`Failed to create ${u.email}:`, error.message)
            } else {
                console.log(`Success! Created ${u.email}. ID: ${data.user.id}`)
            }
        }
    }

    // Explicitly run the profile fix logic from the other script's logic here to be safe, 
    // although the Trigger should handle it. 
    // We will rely on the trigger/previous fix script.

    console.log("Seeding Complete.")
}

main().catch(console.error)
