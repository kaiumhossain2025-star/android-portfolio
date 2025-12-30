import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"

// Load env from root
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
} else {
    console.warn("No .env file found at " + envPath)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
    console.error("Ensure you are running this from the project root.")
    process.exit(1)
}

console.log("Supabase URL:", url)
console.log("Service Key found (exists)")

const supabase = createClient(url, key, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function main() {
    console.log("\n--- 1. Testing Auth Connection ---")
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
        console.error("FATAL: Could not list users from Auth:", authError)
        process.exit(1)
    }

    console.log(`Success: Found ${users.length} users in Auth.`)

    console.log("\n--- 2. Testing Profiles Table Access (Schema Cache Check) ---")
    const { data: profiles, error: dbError } = await supabase.from('profiles').select('count', { count: 'exact', head: true })

    if (dbError) {
        console.error("ERROR accessing profiles table:", dbError)
        console.error("Message:", dbError.message)
        if (dbError.message.includes("Could not find the table")) {
            console.error("\n!!! DIAGNOSIS: SCHEMA CACHE IS STALE OR TABLE IS MISSING !!!")
            console.error("The PostgREST server does not know 'profiles' exists yet.")
            console.error("Action: Go to Supabase Dashboard -> Settings -> API -> Cache -> Reload.")
            console.error("Action (Alternative): Restart the Supabase Project.")
        }
    } else {
        console.log("Success: Profiles table is accessible via API.")
    }

    console.log("\n--- 3. Synchronizing Profiles ---")
    let created = 0
    let existingCount = 0
    let errors = 0

    for (const user of users) {
        // Check if profile exists
        const { data: existing, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        // Ignore error if it's just "Row not found" (PGRST116)
        // If table error, it breaks here.
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error(`Error checking profile for ${user.email}:`, fetchError.message)
            errors++
            continue
        }

        if (!existing) {
            console.log(`Creating missing profile for: ${user.email} (${user.id})`)
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User"

            const { error: insertError } = await supabase.from('profiles').insert({
                id: user.id,
                email: user.email,
                role: 'user',
                name: name,
                created_at: user.created_at
            })

            if (insertError) {
                console.error(`Failed to create profile for ${user.email}:`, insertError.message)
                errors++
            } else {
                created++
                console.log("  -> Created.")
            }
        } else {
            existingCount++
        }
    }

    console.log("\n--- Summary ---")
    console.log(`Total Users: ${users.length}`)
    console.log(`Existing Profiles: ${existingCount}`)
    console.log(`Newly Created: ${created}`)
    console.log(`Errors: ${errors}`)
}

main().catch(console.error)
