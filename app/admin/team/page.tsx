"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Edit, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, reorderTeamMembers, type TeamMember, type SocialLink } from "@/app/actions/team"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { createClient } from "@/lib/supabase"

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Supabase client for storage
    const supabase = createClient()

    // Form Stats
    const initialFormState = {
        name: "",
        role: "",
        image_url: "",
        bio: "",
        social_links: [] as SocialLink[]
    }
    const [formData, setFormData] = useState(initialFormState)

    // Social Link Temp State
    const [tempLink, setTempLink] = useState({ platform: "linkedin", url: "" })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await getTeamMembers()
            setMembers(data)
        } catch (error: any) {
            toast.error("Failed to load team: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData(initialFormState)
        setTempLink({ platform: "linkedin", url: "" })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        try {
            setUploading(true)
            const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from("images").getPublicUrl(filePath)
            setFormData({ ...formData, image_url: data.publicUrl })
            toast.success("Image uploaded")
        } catch (error) {
            toast.error("Error uploading image")
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            await createTeamMember(formData)
            toast.success("Team member added")
            setIsCreateOpen(false)
            resetForm()
            loadData()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMember) return
        setActionLoading(true)
        try {
            await updateTeamMember(selectedMember.id, formData)
            toast.success("Team member updated")
            setIsEditOpen(false)
            setSelectedMember(null)
            resetForm()
            loadData()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return
        try {
            await deleteTeamMember(id)
            toast.success("Team member deleted")
            loadData()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const openEdit = (member: TeamMember) => {
        setSelectedMember(member)
        setFormData({
            name: member.name,
            role: member.role,
            image_url: member.image_url || "",
            bio: member.bio || "",
            social_links: member.social_links || []
        })
        setIsEditOpen(true)
    }

    const addSocialLink = () => {
        if (!tempLink.url) return
        setFormData({
            ...formData,
            social_links: [...formData.social_links, { ...tempLink }]
        })
        setTempLink({ platform: "linkedin", url: "" })
    }

    const removeSocialLink = (index: number) => {
        const newLinks = [...formData.social_links]
        newLinks.splice(index, 1)
        setFormData({ ...formData, social_links: newLinks })
    }

    const moveItem = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === members.length - 1) return

        const newMembers = [...members]
        const targetIndex = direction === 'up' ? index - 1 : index + 1

        // Swap
        const temp = newMembers[index]
        newMembers[index] = newMembers[targetIndex]
        newMembers[targetIndex] = temp

        // Optimistic update
        setMembers(newMembers)

        // Sync with server (update order_index for all affected - simplified)
        const updates = newMembers.map((m, i) => ({ id: m.id, order_index: i }))

        try {
            await reorderTeamMembers(updates)
        } catch (error) {
            toast.error("Failed to reorder")
            loadData() // Revert
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your team members and their display order</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsCreateOpen(true) }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    Add Member
                </button>
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
                                <th className="p-4 w-12 text-center text-muted-foreground">#</th>
                                <th className="p-4 font-medium text-muted-foreground">Member</th>
                                <th className="p-4 font-medium text-muted-foreground">Role</th>
                                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {members.map((member, index) => (
                                <tr key={member.id} className="group hover:bg-muted/50 transition-colors">
                                    <td className="p-4 text-center text-muted-foreground">
                                        <div className="flex flex-col gap-1 items-center">
                                            <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="hover:text-primary disabled:opacity-30">▲</button>
                                            <span className="text-xs font-mono">{index + 1}</span>
                                            <button onClick={() => moveItem(index, 'down')} disabled={index === members.length - 1} className="hover:text-primary disabled:opacity-30">▼</button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative border border-border">
                                                {member.image_url ? (
                                                    <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">?</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{member.name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{member.bio || "No bio"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-foreground">{member.role}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(member)}
                                                className="p-2 hover:bg-background hover:text-foreground rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">No team members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                    </DialogHeader>
                    <MemberForm
                        formData={formData}
                        setFormData={setFormData}
                        tempLink={tempLink}
                        setTempLink={setTempLink}
                        addSocialLink={addSocialLink}
                        removeSocialLink={removeSocialLink}
                        onSubmit={handleCreate}
                        loading={actionLoading}
                        uploading={uploading}
                        onImageUpload={handleImageUpload}
                        submitLabel="Add Member"
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Team Member</DialogTitle>
                    </DialogHeader>
                    <MemberForm
                        formData={formData}
                        setFormData={setFormData}
                        tempLink={tempLink}
                        setTempLink={setTempLink}
                        addSocialLink={addSocialLink}
                        removeSocialLink={removeSocialLink}
                        onSubmit={handleUpdate}
                        loading={actionLoading}
                        uploading={uploading}
                        onImageUpload={handleImageUpload}
                        submitLabel="Update Member"
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function MemberForm({
    formData,
    setFormData,
    tempLink,
    setTempLink,
    addSocialLink,
    removeSocialLink,
    onSubmit,
    loading,
    uploading,
    onImageUpload,
    submitLabel
}: any) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Name</label>
                    <input
                        type="text"
                        required
                        className="w-full mt-1 p-2 bg-background border border-border rounded-md"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Role</label>
                    <input
                        type="text"
                        required
                        className="w-full mt-1 p-2 bg-background border border-border rounded-md"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Profile Image</label>
                <div className="flex items-start gap-4 mt-1">
                    {formData.image_url ? (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                            <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border">
                            <span className="text-xs">No Image</span>
                        </div>
                    )}

                    <div className="flex-1 space-y-2">
                        <label className="cursor-pointer bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/70 transition-colors flex items-center gap-2 w-fit text-sm">
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {uploading ? "Uploading..." : "Upload Image"}
                            <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} disabled={uploading} />
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 bg-background border border-border rounded-md text-xs"
                            placeholder="Or paste URL..."
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Bio</label>
                <textarea
                    className="w-full mt-1 p-2 bg-background border border-border rounded-md"
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
            </div>

            <div className="border-t border-border pt-4">
                <label className="text-sm font-medium mb-2 block">Social Links</label>
                <div className="flex gap-2 mb-2">
                    <select
                        className="p-2 bg-background border border-border rounded-md w-1/3"
                        value={tempLink.platform}
                        onChange={(e) => setTempLink({ ...tempLink, platform: e.target.value })}
                    >
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                        <option value="github">GitHub</option>
                        <option value="website">Website</option>
                        <option value="dribbble">Dribbble</option>
                    </select>
                    <input
                        className="p-2 bg-background border border-border rounded-md flex-1"
                        placeholder="URL"
                        value={tempLink.url}
                        onChange={(e) => setTempLink({ ...tempLink, url: e.target.value })}
                    />
                    <button type="button" onClick={addSocialLink} className="p-2 bg-secondary text-secondary-foreground rounded-md px-4 hover:opacity-80">Add</button>
                </div>
                <div className="space-y-2">
                    {formData.social_links.map((link: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm">
                            <span className="capitalize font-medium opacity-80 w-20">{link.platform}</span>
                            <span className="truncate flex-1 px-2 opacity-60">{link.url}</span>
                            <button type="button" onClick={() => removeSocialLink(i)} className="text-red-500 hover:text-red-600 px-2">×</button>
                        </div>
                    ))}
                </div>
            </div>

            <DialogFooter className="mt-6">
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 w-full sm:w-auto"
                >
                    {loading ? "Saving..." : submitLabel}
                </button>
            </DialogFooter>
        </form>
    )
}
