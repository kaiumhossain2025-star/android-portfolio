"use client"

import { useEffect, useState } from "react"
import { Loader2, Save, ChevronLeft } from "lucide-react"
import { updatePrivacy, getPrivacy } from "@/app/actions/privacy"
import { toast } from "sonner"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

export default function AdminPrivacyPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [id, setId] = useState<string | null>(null)
    const [updatedAt, setUpdatedAt] = useState<string | null>(null)

    useEffect(() => {
        fetchPrivacy()
    }, [])

    const fetchPrivacy = async () => {
        try {
            const data = await getPrivacy()

            if (data) {
                setId(data.id)
                setTitle(data.title)
                setDescription(data.description)
                setContent(data.content)
                setUpdatedAt(data.updated_at)
            }
        } catch (error) {
            console.error('Error fetching privacy policy:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const result = await updatePrivacy({
                id,
                title,
                description,
                content
            })

            if (result.success && result.data) {
                // Update local state with the confirmed data from server
                setId(result.data.id)
                setTitle(result.data.title)
                setDescription(result.data.description)
                setContent(result.data.content)
                setUpdatedAt(result.data.updated_at)
                
                toast.success("Privacy policy updated successfully")
            }
        } catch (error: any) {
            console.error('Error saving privacy policy:', error)
            toast.error(error.message || "Failed to update privacy policy")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                 <Link
                    href="/admin"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
                    {updatedAt && (
                        <p className="text-sm text-muted-foreground">
                            Last updated: {new Date(updatedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8 bg-card border border-border p-6 md:p-8 rounded-xl">
                 {/* Basic Info */}
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Page Title</label>
                        <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2"
                            placeholder="Privacy Policy"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Intro / Description</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2"
                            placeholder="Short description or intro text..."
                        />
                    </div>
                </div>

                {/* Rich Text */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Content (HTML)</label>
                    <div className="prose-editor">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            className="bg-background text-foreground rounded-lg"
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, false] }],
                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["link", "code-block"],
                                ],
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Formatted content will be rendered as HTML on the public page.
                    </p>
                </div>

                {/* Submit */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    )
}
