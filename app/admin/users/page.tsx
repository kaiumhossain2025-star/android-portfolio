"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Key, Shield, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getUsers, createUser, deleteUser, changePassword, getMyRole, type UserProfile } from "@/app/actions/users"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isPasswordOpen, setIsPasswordOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

    // Form States
    const [formData, setFormData] = useState({ email: "", password: "", role: "admin" as "admin" | "super-admin", name: "" })
    const [newPassword, setNewPassword] = useState("")
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const roleData = await getMyRole()
            setCurrentUserRole(roleData.role)

            const data = await getUsers()
            setUsers(data)
        } catch (error: any) {
            console.error(error)
            toast.error("Failed to load users: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            await createUser(formData.email, formData.password, formData.role, formData.name)
            toast.success("User created successfully")
            setIsCreateOpen(false)
            setFormData({ email: "", password: "", role: "admin", name: "" })
            loadData()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteUser = async (userId: string, role: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            await deleteUser(userId, role)
            toast.success("User deleted successfully")
            loadData()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser) return
        setActionLoading(true)
        try {
            await changePassword(selectedUser.id, newPassword, selectedUser.role)
            toast.success("Password updated successfully")
            setIsPasswordOpen(false)
            setNewPassword("")
            setSelectedUser(null)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setActionLoading(false)
        }
    }

    const canCreate = currentUserRole === 'super-admin' || currentUserRole === 'secret'

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage system administrators and roles</p>
                </div>
                {canCreate && (
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                                <Plus size={18} />
                                Create User
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>Add a new administrator to the system.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full mt-1 p-2 bg-background border rounded-md"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full mt-1 p-2 bg-background border rounded-md"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full mt-1 p-2 bg-background border rounded-md"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Role</label>
                                    <select
                                        className="w-full mt-1 p-2 bg-background border rounded-md"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="super-admin">Super Admin</option>
                                    </select>
                                </div>
                                <DialogFooter>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                                    >
                                        {actionLoading ? "Creating..." : "Create User"}
                                    </button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="p-4 font-medium text-muted-foreground">User</th>
                                <th className="p-4 font-medium text-muted-foreground">Role</th>
                                <th className="p-4 font-medium text-muted-foreground">Created At</th>
                                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-muted/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{user.name || "No Name"}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                                <div className="text-[10px] text-muted-foreground line-clamp-1 opacity-50">{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'super-admin'
                                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            }`}>
                                            {user.role === 'super-admin' ? <Shield size={12} /> : <User size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {/* Parse date if available - assuming Supabase default created_at */}
                                        -
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setIsPasswordOpen(true)
                                                }}
                                                className="p-2 hover:bg-background hover:text-foreground rounded-lg transition-colors"
                                                title="Change Password"
                                            >
                                                <Key size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.role)}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Change Password Dialog */}
            <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter new password for <strong>{selectedUser?.email}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full mt-1 p-2 bg-background border rounded-md"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                            >
                                {actionLoading ? "Updating..." : "Update Password"}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
