"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import ImageUpload from "@/components/admin/image-upload"
import { createService, updateService, getService } from "@/app/actions/services"

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [projectId, setProjectId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        full_description: "",
        icon_name: "Smartphone",
        color_theme: "from-[#3b82f6] to-[#06b6d4]", // default blue
        order_index: 0,
        features: [] as string[],
        icon_url: ""
    })

    const [featureInput, setFeatureInput] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isNew, setIsNew] = useState(false)

    useEffect(() => {
        unwrapParams()
    }, [params])

    const unwrapParams = async () => {
        const resolvedParams = await params
        const id = resolvedParams.id
        if (id === 'new') {
            setIsNew(true)
            setLoading(false)
        } else {
            setProjectId(id)
            fetchService(id)
        }
    }

    const fetchService = async (id: string) => {
        try {
            const data = await getService(id)
            if (data) {
                setFormData({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    full_description: data.full_description || "",
                    icon_name: data.icon_name || "Smartphone",
                    color_theme: data.color_theme || "from-[#3b82f6] to-[#06b6d4]",
                    order_index: data.order_index || 0,
                    features: data.features || [],
                    icon_url: data.icon_url || ""
                })
            } else {
                toast.error("Service not found")
                router.push("/admin/services")
            }
        } catch (error) {
            toast.error("Failed to load service")
            router.push("/admin/services")
        } finally {
            setLoading(false)
        }
    }

    const handleAddFeature = () => {
        if (!featureInput.trim()) return
        setFormData(prev => ({ ...prev, features: [...prev.features, featureInput] }))
        setFeatureInput("")
    }

    const removeFeature = (index: number) => {
        setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // Validation
        if (!formData.id || !formData.title || !formData.description) {
            toast.error("Please fill in all required fields (ID, Title, Description)")
            setSaving(false)
            return
        }

        const payload = {
            id: formData.id,
            title: formData.title,
            description: formData.description,
            full_description: formData.full_description,
            icon_name: formData.icon_name,
            color_theme: formData.color_theme,
            order_index: formData.order_index,
            features: formData.features,
            icon_url: formData.icon_url
        }

        try {
            if (isNew) {
                await createService(payload)
            } else {
                await updateService(projectId!, payload)
            }
            toast.success("Service saved successfully")
            router.push("/admin/services")
        } catch (error: any) {
            toast.error(`Error: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl">
            <Link href="/admin/services" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft size={16} className="mr-2" /> Back to Services
            </Link>

            <h1 className="text-3xl font-bold mb-8">
                {isNew ? "Create New Service" : "Edit Service"}
            </h1>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-card border border-border rounded-xl p-6 space-y-6">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ID (Slug) <span className="text-destructive">*</span></label>
                            <input
                                type="text"
                                value={formData.id}
                                onChange={e => setFormData(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                placeholder="e.g. android, ios, ui-ux"
                                disabled={!isNew}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border disabled:opacity-50 font-mono"
                            />
                            <p className="text-xs text-muted-foreground">Unique identifier used in URL. Cannot be changed later.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Order Index</label>
                            <input
                                type="number"
                                value={formData.order_index}
                                onChange={e => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                            />
                            <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Service Title <span className="text-destructive">*</span></label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Short Description <span className="text-destructive">*</span></label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Description</label>
                        <textarea
                            value={formData.full_description}
                            onChange={e => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                            rows={6}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                        />
                        <p className="text-xs text-muted-foreground">Detailed description shown on the service detail page.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Custom Icon (SVG/Image)</label>
                                <ImageUpload
                                    value={formData.icon_url || ""}
                                    onChange={(url) => setFormData(prev => ({ ...prev, icon_url: url }))}
                                />
                                <p className="text-xs text-muted-foreground">Upload an SVG or Image to override the default icon.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default Icon Name</label>
                                <select
                                    value={formData.icon_name}
                                    onChange={e => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg bg-background border border-border appearance-none"
                                >
                                    <option value="Smartphone">Smartphone</option>
                                    <option value="Gamepad2">Gamepad</option>
                                    <option value="Layout">Layout</option>
                                    <option value="Code">Code</option>
                                    <option value="Monitor">Monitor</option>
                                    <option value="Box">Box</option>
                                    <option value="Layers">Layers</option>
                                    <option value="Palette">Palette</option>
                                </select>
                                <p className="text-xs text-muted-foreground">Used if no custom icon is uploaded.</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Color Theme</label>
                            <select
                                value={formData.color_theme}
                                onChange={e => setFormData(prev => ({ ...prev, color_theme: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border appearance-none text-xs"
                            >
                                <option value="from-[#3b82f6] to-[#06b6d4]">Blue - Cyan</option>
                                <option value="from-[#c084fc] to-[#7c3aed]">Purple - Violet</option>
                                <option value="from-[#ec4899] to-[#f43f5e]">Pink - Rose</option>
                                <option value="from-[#f97316] to-[#ea580c]">Orange - Red</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Features List</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={featureInput}
                                onChange={e => setFeatureInput(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg bg-background border border-border"
                                placeholder="Add a key feature..."
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-80"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {formData.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                                        {feature}
                                        <button type="button" onClick={() => removeFeature(idx)} className="hover:text-destructive">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="button-primary flex items-center gap-2 w-full justify-center"
                >
                    {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    Save Service
                </button>
            </form>
        </div>
    )
}

