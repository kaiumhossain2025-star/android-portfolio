
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function testProfiles() {
    console.log('Testing connection to:', supabaseUrl)

    // 1. Check Auth Users
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
        console.error('Auth Error:', authError.message)
    } else {
        console.log(`Found ${users.length} auth users`)
    }

    // 2. Check Profiles Table
    const { data: profiles, error: dbError } = await supabase
        .from('profiles')
        .select('*')

    if (dbError) {
        console.error('DB Error (Profiles):', dbError.message)
        console.error('Details:', dbError)
    } else {
        console.log(`Found ${profiles.length} profiles`)
    }

    // 3. Try inserting a missing profile if users exist but profiles don't
    if (users.length > 0 && profiles && profiles.length === 0) {
        console.log("Attempting to sync 1st user to profiles...")
        const u = users[0]
        const { error: insertError } = await supabase.from('profiles').insert({
            id: u.id,
            email: u.email,
            role: 'admin',
            name: 'Synced Admin'
        })
        if (insertError) console.error("Insert Error:", insertError.message)
        else console.log("Successfully synced one profile.")
    }
}

testProfiles()
