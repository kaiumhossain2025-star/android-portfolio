"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Save, Smartphone } from "lucide-react"

export default function PlayStoreSettingsPage() {
    const [settings, setSettings] = useState({
        id: null as number | null,
        play_store_url: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const { data } = await supabase.from("site_settings").select("id, play_store_url").single()
        if (data) {
            setSettings(data)
        }
        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const payload = {
            play_store_url: settings.play_store_url,
        }

        let error

        if (settings.id) {
            const { error: updateError } = await supabase
                .from("site_settings")
                .update(payload)
                .eq("id", settings.id)
            error = updateError
        } else {
            // Should not happen if settings exist, but safe fallback
             const { error: insertError } = await supabase
                .from("site_settings")
                .insert([payload])
            error = insertError
        }

        if (error) {
            console.log("Save error:", error)
            toast.error(`Failed to save: ${error.message}`)
        } else {
            toast.success("Play Store link updated successfully")
            fetchSettings()
        }
        setSaving(false)
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-primary" />
                Play Store Settings
            </h1>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Google Play Store URL</label>
                            <input
                                type="url"
                                placeholder="https://play.google.com/store/apps/details?id=..."
                                value={settings.play_store_url || ""}
                                onChange={(e) => setSettings(prev => ({ ...prev, play_store_url: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                            />
                            <p className="text-xs text-muted-foreground">
                                The link to your publisher profile or main app on the Google Play Store.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="button-primary flex items-center gap-2"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </form>
        </div>
    )
}
