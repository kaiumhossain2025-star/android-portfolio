"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { getSocials, createSocial, deleteSocial } from "@/app/actions/socials"

type SocialLink = {
    id: string // UUID
    platform: string
    url: string
    // is_active removed as per new schema
}

export default function SocialsPage() {
    const [links, setLinks] = useState<SocialLink[]>([])
    const [newLink, setNewLink] = useState({ platform: "", url: "" })

    useEffect(() => {
        fetchLinks()
    }, [])

    const fetchLinks = async () => {
        try {
            const data = await getSocials()
            setLinks(data || [])
        } catch (error) {
            console.error(error)
        }
    }

    const addLink = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createSocial(newLink)
            toast.success("Link added")
            setNewLink({ platform: "", url: "" })
            fetchLinks()
        } catch (error: any) {
            toast.error("Failed to add link")
        }
    }

    const deleteLink = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await deleteSocial(id)
            toast.success("Link deleted")
            fetchLinks()
        } catch (error: any) {
            toast.error("Failed to delete link")
        }
    }

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-8">Social Links</h1>

            {/* Add New */}
            <form onSubmit={addLink} className="flex gap-4 mb-8 bg-card border border-border p-4 rounded-xl items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-foreground">Platform Name</label>
                    <input
                        required
                        placeholder="e.g. GitHub"
                        value={newLink.platform}
                        onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground outline-none"
                    />
                </div>
                <div className="flex-[2] space-y-2">
                    <label className="text-sm font-medium text-foreground">URL</label>
                    <input
                        required
                        placeholder="https://..."
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground outline-none"
                    />
                </div>
                <button type="submit" className="bg-primary text-primary-foreground p-2.5 rounded-lg hover:opacity-90">
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            {/* List */}
            <div className="grid gap-4">
                {links.map((link) => (
                    <div key={link.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-foreground">{link.platform}</h3>
                            <a href={link.url} target="_blank" className="text-sm text-primary hover:underline">{link.url}</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => deleteLink(link.id)}
                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {links.length === 0 && <p className="text-muted-foreground text-center py-8">No social links yet.</p>}
            </div>
        </div>
    )
}

