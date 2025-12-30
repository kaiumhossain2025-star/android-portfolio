"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function WhatsappFloat() {
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        async function fetchSettings() {
            const { data } = await supabase.from("site_settings").select("whatsapp_number").single()
            if (data?.whatsapp_number) {
                setPhoneNumber(data.whatsapp_number)
            }
        }
        fetchSettings()
    }, [])

    if (!phoneNumber) return null

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 fill-current" />
        </a>
    )
}
