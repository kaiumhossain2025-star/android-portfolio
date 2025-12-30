import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"

// Load env
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("\n--- DIAGNOSTIC START ---")
console.log(`URL: ${SUPABASE_URL}`)
console.log(`Service Key Present: ${!!SUPABASE_KEY}`)
console.log(`Anon Key Present: ${!!ANON_KEY}`)

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("FATAL: Missing Environment Variables")
    process.exit(1)
}

async function testEndpoint(tableName: string) {
    console.log(`\nTesting table: '${tableName}'...`)
    const endpoint = `${SUPABASE_URL}/rest/v1/${tableName}`

    // 1. RAW FETCH TEST (Bypassing JS Client)
    // We use the Service Role Key to bypass RLS, ensuring pure existence check
    try {
        const response = await fetch(`${endpoint}?select=*&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY!,
                'Authorization': `Bearer ${SUPABASE_KEY!}`
            }
        })

        console.log(`[RAW HTTP] Status: ${response.status} ${response.statusText}`)

        if (response.ok) {
            console.log("-> SUCCESS: Table endpoint is reachable via RAW HTTP.")
            const json = await response.json()
            console.log(`-> Data Preview: ${JSON.stringify(json)}`)
        } else {
            console.error(`-> FAILURE: RAW HTTP request failed.`)
            console.log(`-> Reason: ${await response.text()}`)

            if (response.status === 404) {
                console.error("-> DIAGNOSIS: 404 means PostgREST does NOT know this table exists.")
                console.error("-> CAUSE: Dictionary/Schema Cache is stale OR Table is in wrong schema (not public).")
            }
        }
    } catch (e: any) {
        console.error("-> EXCEPTION during Fetch:", e.message)
    }

    // 2. JS CLIENT TEST
    const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
        auth: { persistSession: false }
    })

    const { data, error } = await supabase.from(tableName).select('*').limit(1)
    if (error) {
        console.error(`[JS CLIENT] Error:`, error.message)
    } else {
        console.log(`[JS CLIENT] Success. Rows found: ${data.length}`)
    }
}

async function main() {
    await testEndpoint('profiles')
    await testEndpoint('products')

    // Check Project ID Match
    const projectIdInUrl = SUPABASE_URL?.split('//')[1].split('.')[0]
    console.log(`\nYour URL Project ID: ${projectIdInUrl}`)
    console.log("PLEASE VERIFY: Does this ID match the project URL in your Browser Dashboard?")
}

main().catch(console.error)
