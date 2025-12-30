"use client"

import { toast } from "sonner"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import ProjectCard from "./project-card"
import { createClient } from "@/lib/supabase"
import ProjectsSkeleton from "./skeletons/projects-skeleton"
import { cn } from "@/lib/utils"

interface ProjectsGridProps {
  className?: string
  gridClassName?: string
  limit?: number
  viewAllHref?: string
  showTitle?: boolean
}

export default function ProjectsGrid({
  className,
  gridClassName,
  limit = 6,
  viewAllHref,
  showTitle = true
}: ProjectsGridProps) {
  const supabase = createClient()

  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchProjects = async (offset: number) => {
    try {
      const from = offset
      const to = offset + limit - 1

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to)

      if (error) throw error

      console.log(`Fetched ${data.length} projects. From: ${from}, To: ${to}`)

      setProjects((prev) => {
        // If we are just viewing a fixed set (viewAllHref is present), we might not want to append if we're reloading? 
        // But typically fetchProjects(0) is called once. 
        // If offset is 0, replace. Else append.
        if (offset === 0) return data
        return [...prev, ...data]
      })

      if (data.length < limit) {
        setHasMore(false)
      }
    } catch (error) {
      console.log(error)
      // If we fail on initial load, stop loading so we don't show infinite skeleton
      if (offset === 0) setLoading(false)
      toast.error("Failed to load projects")
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchProjects(0).finally(() => setLoading(false))
  }, [])

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || viewAllHref) return
    setLoadingMore(true)
    await fetchProjects(projects.length)
    setLoadingMore(false)
  }

  return (
    <section id="projects" className={`py-20 bg-background ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore a selection of my recent work
            </p>
          </motion.div>
        )}

        {/* Projects */}
        {loading ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No projects found.</p>
          </div>
        ) : (
          <>
            <motion.div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                gridClassName
              )}
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Link href={`/projects/${project.id}`}>
                    <ProjectCard project={project} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {(hasMore || viewAllHref) && (
              <div className="mt-12 flex justify-center">
                {viewAllHref ? (
                  <Link
                    href={viewAllHref}
                    className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90"
                  >
                    Load More
                  </Link>
                ) : (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50"
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
