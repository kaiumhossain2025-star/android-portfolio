"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { isSecretAdmin } from "@/lib/admin-auth"
import { toast } from "sonner"
import { Lock, User, ShieldAlert } from "lucide-react"

export default function AdminProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isSecret, setIsSecret] = useState(false)

    // Edit State
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const supabase = createClient()

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()

            const secretCheck = document.cookie.includes("admin-secret-access=true") ||
                localStorage.getItem("admin-secret-access") === "true"

            if (secretCheck) {
                setIsSecret(true)
                setUser({ email: "s@s.com", id: "secret-admin" })
            } else if (user) {
                setUser(user)
            }
            setLoading(false)
        }
        getUser()
    }, [])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSecret) return

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        const { error } = await supabase.auth.updateUser({ password: password })
        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Password updated successfully")
            setPassword("")
            setConfirmPassword("")
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Profile & Security</h1>
                <p className="text-muted-foreground">Manage your account settings and credentials.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user?.email}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium text-xs">Active</span>
                            <span className="text-xs">•</span>
                            <span className="text-xs">Administrator</span>
                        </div>
                    </div>
                </div>

                {isSecret && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-yellow-500 text-sm">Managed Account</h3>
                            <p className="text-sm text-yellow-600/80 mt-1">
                                This is a restricted administrative account managed via secure configuration.
                                Password and email changes are disabled for security.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Settings */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Security
                </h3>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSecret}
                                className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isSecret}
                                className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSecret || !password}
                            className="button-primary"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
