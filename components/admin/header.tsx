"use client"

import { useState, useEffect } from "react"
import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link"
import { Bell, User, LogOut, Settings, ExternalLink, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { isSecretAdmin } from "@/lib/admin-auth"
import { toast } from "sonner"

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function getUser() {
            // Check Supabase Auth
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) {
                setUserEmail(user.email)
            } else {
                // Check for secret cookie
                const isSecret = document.cookie.includes("admin-secret-access=true") || localStorage.getItem("admin-secret-access") === "true"
                if (isSecret) setUserEmail("s@s.com")
            }
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        if (isSecretAdmin(userEmail)) {
            document.cookie = "admin-secret-access=; path=/; max-age=0"
            localStorage.removeItem("admin-secret-access")
        }
        await supabase.auth.signOut()
        toast.success("Logged out")
        router.push("/admin-secret-login")
    }

    return (
        <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-muted rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
                {/* Breadcrumb or Title could go here */}
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    target="_blank"
                    className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ExternalLink size={16} />
                    Visit Site
                </Link>

                <ThemeToggle />

                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 hover:bg-muted p-1.5 rounded-lg transition-colors border border-transparent hover:border-border"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {userEmail?.charAt(0).toUpperCase() || "A"}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-3 py-2 border-b border-border mb-2">
                                    <p className="font-semibold text-sm truncate">{userEmail}</p>
                                    <p className="text-xs text-muted-foreground">Administrator</p>
                                </div>

                                <Link
                                    href="/admin/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                                >
                                    <User size={16} />
                                    Profile & Security
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
