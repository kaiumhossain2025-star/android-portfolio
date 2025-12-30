"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        id: null as number | null,
        site_name: "",
        contact_email: "",
        logo_url: "",
        address: "",
        whatsapp_number: "",
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        const { data } = await supabase.from("site_settings").select("*").single()
        if (data) {
            setSettings(data)
        }
        setLoading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // Debug: Check User
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Current User:", user);
        if (!user) {
            toast.error("You are not authenticated!")
            setSaving(false)
            return
        }

        // If we have an ID, update that specific row. If not, insert a new one.
        const payload = {
            site_name: settings.site_name,
            contact_email: settings.contact_email,
            logo_url: settings.logo_url,
            address: settings.address,
            whatsapp_number: settings.whatsapp_number,
        }

        let error;

        if (settings.id) {
            const { error: updateError, data: updateData } = await supabase
                .from("site_settings")
                .update(payload)
                .eq("id", settings.id)
                .select()

            error = updateError;
            console.log("Update Result:", updateData);

            if (!error && (!updateData || updateData.length === 0)) {
                console.error("Update succeeded but no rows returned. RLS likely blocking update.");
                toast.error("Update failed. You might not have permission.")
            }
        } else {
            // Fallback for empty table
            const { error: insertError } = await supabase
                .from("site_settings")
                .insert([payload])
            error = insertError;
        }

        if (error) {
            console.log("Save error:", error)
            toast.error(`Failed to save: ${error.message}`)
        } else if (!error && settings.id) {
            // Success logic handled above for verification
            toast.success("Settings saved successfully")
            fetchSettings()
        } else {
            // Insert success
            toast.success("Settings saved successfully")
            fetchSettings()
        }
        setSaving(false)
    }

    // NOTE: We need to make sure we don't wipe 'whatsapp_number' if we didn't include it here.
    // The fetch gets "select *", so 'settings' state has it (if we type it properly).
    // Let's ensure state includes it even if hidden from form.

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">General Settings</h1>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Branding</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Logo</label>
                            <ImageUpload
                                value={settings.logo_url || ""}
                                onChange={(url) => setSettings(prev => ({ ...prev, logo_url: url }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site Name</label>
                            <input
                                type="text"
                                required
                                value={settings.site_name || ""}
                                onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Email</label>
                        <input
                            type="email"
                            required
                            value={settings.contact_email || ""}
                            onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                        />
                        <p className="text-xs text-muted-foreground">Used for the contact form recipient.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp Number</label>
                        <input
                            type="text"
                            value={settings.whatsapp_number || ""}
                            onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                            placeholder="+1234567890"
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                        />
                        <p className="text-xs text-muted-foreground">International format preferred.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location / Address</label>
                        <textarea
                            value={settings.address || ""}
                            onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border resize-none"
                            placeholder="e.g. New York, USA"
                        />
                        <p className="text-xs text-muted-foreground">Displayed in the "Get In Touch" section.</p>
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
