"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export default function TestConnection() {
    const [status, setStatus] = useState("Testing...")
    const [details, setDetails] = useState("")
    const supabase = createClient()

    useEffect(() => {
        async function check() {
            try {
                const url = process.env.NEXT_PUBLIC_SUPABASE_URL
                const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

                if (!url || !key) {
                    setStatus("FAILED: Missing Environment Variables")
                    setDetails("Please check your .env file. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.")
                    return
                }

                const { data, error } = await supabase.from("site_settings").select("count")

                if (error) {
                    setStatus("FAILED: Supabase Error")
                    setDetails(error.message)
                } else {
                    setStatus("SUCCESS: Connected to Supabase")
                    setDetails("Successfully queried 'site_settings' table.")
                }
            } catch (err: any) {
                setStatus("FAILED: Client Error")
                setDetails(err.message)
            }
        }
        check()
    }, [])

    return (
        <div className="p-10 font-mono">
            <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
            <div className={`p-4 rounded border ${status.startsWith("SUCCESS") ? "bg-green-100 border-green-500 text-green-800" : "bg-red-100 border-red-500 text-red-800"}`}>
                <div className="font-bold">{status}</div>
                <div className="mt-2 text-sm">{details}</div>
            </div>
            <div className="mt-8 text-xs text-gray-500">
                URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined" : "Missing"} <br />
                Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "Missing"}
            </div>
        </div>
    )
}
