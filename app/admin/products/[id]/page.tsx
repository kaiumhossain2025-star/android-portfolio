"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import ImageUpload from "@/components/admin/image-upload"
import { createProduct, updateProduct, getProduct } from "@/app/actions/products"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [productId, setProductId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        short_description: "",
        details: "",
        price: 0,
        image_url: "",
        features: [] as string[],
        install_link: "",
        order_index: 0,
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
            setProductId(id)
            fetchProduct(id)
        }
    }

    const fetchProduct = async (id: string) => {
        try {
            const data = await getProduct(id)
            if (data) {
                setFormData({
                    id: data.id,
                    title: data.title,
                    short_description: data.short_description || "",
                    details: data.details || "",
                    price: data.price || 0,
                    image_url: data.image_url || "",
                    features: data.features || [],
                    install_link: data.install_link || "",
                    order_index: data.order_index || 0,
                })
            } else {
                toast.error("Product not found")
                router.push("/admin/products")
            }
        } catch (error) {
            toast.error("Failed to load product")
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
        if (!formData.id || !formData.title || !formData.short_description) {
            toast.error("Please fill in all required fields (ID, Title, Short Description)")
            setSaving(false)
            return
        }

        const payload = {
            id: formData.id,
            title: formData.title,
            short_description: formData.short_description,
            details: formData.details,
            price: formData.price,
            image_url: formData.image_url,
            features: formData.features,
            install_link: formData.install_link,
            order_index: formData.order_index,
        }

        try {
            if (isNew) {
                await createProduct(payload)
            } else {
                await updateProduct(productId!, payload)
            }
            toast.success("Product saved successfully")
            router.push("/admin/products")
        } catch (error: any) {
            toast.error(`Error: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="max-w-2xl">
            <Link href="/admin/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft size={16} className="mr-2" /> Back to Products
            </Link>

            <h1 className="text-3xl font-bold mb-8">
                {isNew ? "Create New Product" : "Edit Product"}
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
                                placeholder="e.g. saas-starter-kit"
                                disabled={!isNew}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border disabled:opacity-50 font-mono"
                            />
                            <p className="text-xs text-muted-foreground">Unique identifier used in URL.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Order Index</label>
                            <input
                                type="number"
                                value={formData.order_index}
                                onChange={e => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                                className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Title <span className="text-destructive">*</span></label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                        />
                    </div>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                    />


                    <div className="space-y-2">
                        <label className="text-sm font-medium">Install Link (Optional)</label>
                        <input
                            type="url"
                            value={formData.install_link}
                            onChange={e => setFormData(prev => ({ ...prev, install_link: e.target.value }))}
                            placeholder="https://play.google.com/store/apps/details?id=..."
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                        />
                        <p className="text-xs text-muted-foreground">Link to App Store, Play Store, or direct download.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Short Description <span className="text-destructive">*</span></label>
                        <textarea
                            value={formData.short_description}
                            onChange={e => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border resize-none"
                            placeholder="Brief summary for list view..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Details</label>
                        <textarea
                            value={formData.details}
                            onChange={e => setFormData(prev => ({ ...prev, details: e.target.value }))}
                            rows={6}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                            placeholder="Detailed description..."
                        />
                        <p className="text-xs text-muted-foreground">Detailed description shown on the product detail page.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Image</label>
                        <ImageUpload
                            value={formData.image_url || ""}
                            onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                        />
                        <p className="text-xs text-muted-foreground">Upload a cover image for the product.</p>
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
                    Save Product
                </button>
            </form>
        </div>
    )
}

