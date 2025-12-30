"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ChevronLeft, Save, Upload, Plus, X } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

export default function ProjectEditor({ params }: { params: Promise<{ id?: string }> }) {
    const resolvedParams = use(params)
    const isEditMode = !!resolvedParams?.id
    const router = useRouter()
    // supabase client is only for read & storage (writes via Server Action)
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        full_description: "", // HTML content
        image_url: "",
        tags: [] as string[],
        features: [] as string[],
    })

    const [tagInput, setTagInput] = useState("")
    const [featureInput, setFeatureInput] = useState("")

    useEffect(() => {
        if (isEditMode) {
            fetchProject(resolvedParams.id!)
        }
    }, [isEditMode])

    const fetchProject = async (id: string) => {
        const { data } = await supabase.from("projects").select("*").eq("id", id).single()
        if (data) {
            setFormData({
                title: data.title || "",
                description: data.description || "",
                full_description: data.full_description || "",
                image_url: data.image_url || "",
                tags: data.tags || [],
                features: data.features || [],
            })
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        try {
            setLoading(true)
            const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from("images").getPublicUrl(filePath)
            setFormData({ ...formData, image_url: data.publicUrl })
            toast.success("Image uploaded")
        } catch (error) {
            toast.error("Error uploading image")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddItem = (
        value: string,
        setter: (val: string) => void,
        list: string[],
        listUpdater: (list: string[]) => void
    ) => {
        if (!value.trim()) return
        listUpdater([...list, value.trim()])
        setter("")
    }

    const handleRemoveItem = (index: number, list: string[], listUpdater: (list: string[]) => void) => {
        const newList = [...list]
        newList.splice(index, 1)
        listUpdater(newList)
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { saveProject } = await import("../actions")

            const response = await saveProject(formData, isEditMode, resolvedParams.id)
            if (response?.error) {
                toast.error(response.error)
                setLoading(false)
                return
            }

            toast.success(isEditMode ? "Project updated" : "Project created")
            router.refresh()
            router.push("/admin/projects")
        } catch (err) {
            console.log("Unexpected error:", err)
            toast.error("Unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/admin/projects"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Projects
                </Link>
                <h1 className="text-2xl font-bold text-foreground">{isEditMode ? "Edit Project" : "New Project"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-6 md:p-8 rounded-xl">

                {/* Basic Info */}
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Project Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2"
                            placeholder="e.g. E-Commerce App"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Short Description</label>
                        <textarea
                            required
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2"
                            placeholder="Brief summary for the card view..."
                        />
                    </div>
                </div>

                {/* Media */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cover Image</label>
                    <div className="flex items-start gap-4">
                        {formData.image_url && (
                            <img src={formData.image_url} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-border" />
                        )}
                        <label className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="Or paste URL..."
                            className="bg-transparent border-b border-border flex-1 py-2 outline-none"
                        />
                    </div>
                </div>

                {/* Rich Text */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Description (Detail Page)</label>
                    <div className="prose-editor">
                        <ReactQuill
                            theme="snow"
                            value={formData.full_description}
                            onChange={(val) => setFormData({ ...formData, full_description: val })}
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
                </div>

                {/* Tags & Features */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Tech Stack Tags</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(tagInput, setTagInput, formData.tags, (tags) => setFormData({ ...formData, tags })))}
                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2"
                                placeholder="Add tag..."
                            />
                            <button
                                type="button"
                                onClick={() => handleAddItem(tagInput, setTagInput, formData.tags, (tags) => setFormData({ ...formData, tags }))}
                                className="bg-secondary p-2 rounded-lg"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, i) => (
                                <span key={i} className="bg-muted px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveItem(i, formData.tags, (tags) => setFormData({ ...formData, tags }))}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Key Features</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem(featureInput, setFeatureInput, formData.features, (features) => setFormData({ ...formData, features })))}
                                className="flex-1 bg-background border border-border rounded-lg px-3 py-2"
                                placeholder="Add feature..."
                            />
                            <button
                                type="button"
                                onClick={() => handleAddItem(featureInput, setFeatureInput, formData.features, (features) => setFormData({ ...formData, features }))}
                                className="bg-secondary p-2 rounded-lg"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {formData.features.map((feature, i) => (
                                <div key={i} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                                    {feature}
                                    <button type="button" onClick={() => handleRemoveItem(i, formData.features, (features) => setFormData({ ...formData, features }))} className="text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Save Project"}
                    </button>
                </div>
            </form>
        </div>
    )
}
