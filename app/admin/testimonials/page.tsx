"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, X, Star } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"

// Types
type Testimonial = {
  id: number
  name: string
  role: string
  content: string
  image_url: string | null
  rating: number
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    image_url: "",
    rating: 5
  })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    const { error } = await supabase.from("testimonials").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete")
    } else {
      setTestimonials(testimonials.filter(t => t.id !== id))
      toast.success("Testimonial deleted")
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      image_url: testimonial.image_url || "",
      rating: testimonial.rating
    })
    setEditingId(testimonial.id)
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: "", role: "", content: "", image_url: "", rating: 5 })
    setEditingId(null)
    setIsModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: formData.name,
      role: formData.role,
      content: formData.content,
      image_url: formData.image_url || null,
      rating: formData.rating
    }

    if (editingId) {
      // Update
      const { error } = await supabase.from("testimonials").update(payload).eq("id", editingId)
      if (error) {
        toast.error("Failed to update")
      } else {
        toast.success("Testimonial updated")
        fetchTestimonials()
        resetForm()
      }
    } else {
      // Insert
      const { error } = await supabase.from("testimonials").insert(payload)
      if (error) {
        toast.error("Failed to create")
      } else {
        toast.success("Testimonial created")
        fetchTestimonials()
        resetForm()
      }
    }
    setSaving(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="button-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div key={item.id} className="bg-card border border-border p-6 rounded-xl flex flex-col gap-4 relative group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded text-xs text-yellow-600 font-medium">
                <Star size={12} className="fill-yellow-600" />
                {item.rating}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-3 italic">"{item.content}"</p>

            <div className="mt-auto pt-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 rounded-lg bg-secondary hover:bg-muted text-foreground transition-colors"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? "Edit Testimonial" : "New Testimonial"}</h2>
              <button onClick={resetForm}><X size={20} className="text-muted-foreground" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role/Title</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Review Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-sm font-medium">Rating (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border"
                  >
                    {[1, 2, 3, 4, 5].map(r => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Profile Image</label>
                   <ImageUpload
                     value={formData.image_url}
                     onChange={(url) => setFormData({ ...formData, image_url: url })}
                   />
                 </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="button-primary flex items-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save className="w-4 h-4" />}
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
