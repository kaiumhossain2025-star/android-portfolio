"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { MessageSquare, FolderKanban, Share2 } from "lucide-react"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        messages: 0,
        socials: 0,
    })
    const supabase = createClient()

    useEffect(() => {
        async function fetchStats() {
            const [projects, messages, socials] = await Promise.all([
                supabase.from("projects").select("*", { count: "exact", head: true }),
                supabase.from("contact_messages").select("*", { count: "exact", head: true }),
                supabase.from("social_links").select("*", { count: "exact", head: true }),
            ])

            setStats({
                projects: projects.count || 0,
                messages: messages.count || 0,
                socials: socials.count || 0,
            })
        }
        fetchStats()
    }, [])

    const cards = [
        { label: "Total Projects", value: stats.projects, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Messages", value: stats.messages, icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Social Links", value: stats.socials, icon: Share2, color: "text-purple-500", bg: "bg-purple-500/10" },
    ]

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.label} className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{card.label}</p>
                                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
                <p className="text-muted-foreground text-sm">Real-time activity feed coming soon.</p>
            </div>
        </div>
    )
}
