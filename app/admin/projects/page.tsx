"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
        if (data) setProjects(data)
        setLoading(false)
    }

    const deleteProject = async (id: number) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return
        const { error } = await supabase.from("projects").delete().eq("id", id)
        if (error) {
            toast.error("Failed to delete project")
        } else {
            toast.success("Project deleted")
            fetchProjects()
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                <Link
                    href="/admin/projects/new"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Project
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center gap-4">
                        <div className="p-4 bg-muted rounded-full">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No projects found. Create your first one!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted text-muted-foreground uppercase font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Tags</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{project.title}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {project.tags?.slice(0, 3).join(", ")}
                                            {(project.tags?.length || 0) > 3 && ` +${project.tags.length - 3}`}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/projects/edit/${project.id}`}
                                                    className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
