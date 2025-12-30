"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { LayoutDashboard, FolderKanban, Settings, Share2, LogOut, Menu, X, MessageSquare, MessageCircle, Users, FileText, Info, Shield, Smartphone, Layers, ShoppingCart } from "lucide-react"
import AdminHeader from "@/components/admin/header"

import { getMyRole } from "@/app/actions/users"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Check hardcoded auth
            const isHardcodedAuth = localStorage.getItem("admin-secret-access") === "true"

            // 2. Check Supabase auth
            const { data: { session } } = await supabase.auth.getSession()

            if (!isHardcodedAuth && !session) {
                router.push("/admin-secret-login")
            } else {
                setAuthorized(true)
                try {
                    const { role } = await getMyRole()
                    setUserRole(role)
                } catch (e) {
                    console.error("Failed to fetch role", e)
                }
            }
        }
        checkAuth()
    }, [router, supabase])

    const handleLogout = async () => {
        localStorage.removeItem("admin-secret-access")
        document.cookie = "admin-secret-access=; path=/; max-age=0"
        await supabase.auth.signOut()
        router.push("/admin-secret-login")
    }

    if (!authorized) return null

    const allMenuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin", roles: ["all"] },
        { icon: MessageSquare, label: "Messages", href: "/admin/messages", roles: ["all"] },
        { icon: FolderKanban, label: "Projects", href: "/admin/projects", roles: ["all"] },
        { icon: Layers, label: "Services", href: "/admin/services", roles: ["all"] },
        { icon: ShoppingCart, label: "Products", href: "/admin/products", roles: ["all"] },
        { icon: Users, label: "Users", href: "/admin/users", roles: ["super-admin", "secret"] },
        { icon: Users, label: "Team", href: "/admin/team", roles: ["all"] },
        { icon: Info, label: "About", href: "/admin/about", roles: ["all"] },
        { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials", roles: ["all"] },
        { icon: FileText, label: "Terms", href: "/admin/terms", roles: ["all"] },
        { icon: Shield, label: "Privacy Policy", href: "/admin/privacy", roles: ["all"] },
        { icon: Share2, label: "Social Media", href: "/admin/socials", roles: ["all"] },
        { icon: Smartphone, label: "Play Store Link", href: "/admin/playstore", roles: ["all"] },
        { icon: MessageCircle, label: "WhatsApp", href: "/admin/whatsapp", roles: ["all"] },
        { icon: Settings, label: "General Settings", href: "/admin/settings", roles: ["all"] },
    ]

    const menuItems = allMenuItems.filter(item => {
        if (item.roles.includes("all")) return true
        if (userRole && item.roles.includes(userRole)) return true
        return false
    })

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative shrink-0 w-64 h-full bg-card border-r border-border z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center px-6 border-b border-border">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <h1 className="text-lg font-bold">Admin Panel</h1>
                        </div>
                        <button className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href || pathname.startsWith(item.href) && item.href !== "/admin"
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
                        v1.0.0
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
