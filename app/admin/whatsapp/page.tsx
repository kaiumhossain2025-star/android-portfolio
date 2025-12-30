"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Save, MessageCircle } from "lucide-react"

export default function WhatsAppSettingsPage() {
    const [whatsapp, setWhatsapp] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const { data } = await supabase.from("site_settings").select("whatsapp_number").single()
        if (data) {
            setWhatsapp(data.whatsapp_number || "")
        }
        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // We update ONLY the whatsapp_number field to avoid race conditions or overwriting other fields
        // assuming row 1 exists (created by init SQL or general settings)
        const { error } = await supabase
            .from("site_settings")
            .update({ whatsapp_number: whatsapp })
            .eq("id", 1)

        if (error) {
            toast.error("Failed to update WhatsApp number")
        } else {
            toast.success("WhatsApp number updated")
        }
        setSaving(false)
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                    <MessageCircle size={24} />
                </div>
                WhatsApp Integration
            </h1>

            <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="space-y-4">
                    <p className="text-muted-foreground">
                        Configure the number for the floating WhatsApp button on your site.
                    </p>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                            type="text"
                            placeholder="e.g. 15551234567"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                            Format: Country Code + Number (no spaces, dashes, or + symbols). Example: 15551234567
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="button-primary flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            Update Number
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
