"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Edit, Layers, Plus, Trash, Globe, Smartphone, Gamepad2, Layout, Code, Monitor, Box, Palette } from "lucide-react"
import { getServices, deleteService } from "@/app/actions/services"

const ICON_MAP: Record<string, any> = {
  Smartphone,
  Gamepad2,
  Layout,
  Code,
  Monitor,
  Box,
  Layers,
  Palette
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const data = await getServices()
      setServices(data || [])
    } catch (error) {
      toast.error("Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      await deleteService(id)
      toast.success("Service deleted")
      fetchServices()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Layers className="w-8 h-8 text-primary" />
          Services
        </h1>
        <Link
          href="/admin/services/new"
          className="button-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Service
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-medium">Icon</th>
              <th className="px-6 py-4 text-left font-medium">Title</th>
              <th className="px-6 py-4 text-left font-medium">ID (Slug)</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {services.map((service) => {
              const Icon = ICON_MAP[service.icon_name] || Layers
              return (
                <tr key={service.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${service.color_theme} flex items-center justify-center text-white`}>
                      <Icon size={20} />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{service.title}</td>
                  <td className="px-6 py-4 text-muted-foreground text-sm font-mono">{service.id}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No services found. Click "Add Service" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

