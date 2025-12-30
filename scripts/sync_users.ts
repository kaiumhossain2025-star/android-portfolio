
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function syncUsers() {
    console.log('Syncing Auth Users to Profiles...')

    // 1. Get all Auth Users
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
        console.error("Error fetching auth users:", authError.message)
        return
    }

    console.log(`Found ${users.length} users in Auth.`)

    for (const user of users) {
        // 2. Check if profile exists
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single()

        if (!profile) {
            console.log(`Creating profile for ${user.email}...`)
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    role: 'admin', // Defaulting to admin for now, user can change later
                    name: user.user_metadata?.full_name || 'Admin User'
                })

            if (insertError) {
                console.error(`Failed to create profile for ${user.email}:`, insertError.message)
            } else {
                console.log(`✓ Profile created for ${user.email}`)
            }
        } else {
            console.log(`- Profile exists for ${user.email}`)
        }
    }
    console.log('Sync complete.')
}

syncUsers()
