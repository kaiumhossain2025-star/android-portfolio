"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import { ADMIN_SECRETS } from "@/lib/admin-auth"

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // 1. Check Hardcoded Secret Credentials (first priority as requested)
        // Check case-insensitive for email, strict for password
        if (email.trim().toLowerCase() === ADMIN_SECRETS.email.toLowerCase() && password === ADMIN_SECRETS.password) {
            // Set a magic cookie for hardcoded auth
            document.cookie = "admin-secret-access=true; path=/; max-age=86400" // 1 day
            localStorage.setItem("admin-secret-access", "true")
            toast.success("Login successful")
            // Force refresh to let middleware/layout pick up the new state
            router.refresh()
            router.push("/admin")
            return
        }

        // 2. Check Supabase Auth
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            toast.error(authError.message)
            setError(authError.message)
            setLoading(false)
        } else {
            toast.success("Login successful")
            router.refresh()
            router.push("/admin")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
                    <p className="text-muted-foreground text-sm mt-2">Enter credentials to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-10 pr-10 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Login to Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    )
}
