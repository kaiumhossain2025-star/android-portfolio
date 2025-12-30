import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Check, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase"
import ProjectsGrid from "@/components/projects-grid"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createClient()

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (!project) {
    notFound()
  }

  const imageUrl = project.image_url || null

  return (
    <div className="min-h-screen bg-background pt-12 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/#projects"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Helper function to check valid URL logic is handled by variable above */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{project.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

            {project.features && project.features.length > 0 && (
              <div className="pt-4">
                <h3 className="text-xl font-bold text-foreground mb-4">Key Features</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-8 flex gap-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  className="px-6 py-3 rounded-lg font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Live Demo
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <Link href="/#contact" className="px-6 py-3 rounded-lg font-bold border border-border bg-card hover:bg-muted transition-colors">
                Contact Me
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Project Image
                </div>
              )}
            </div>

            {project.full_description && (
              <div className="prose prose-neutral dark:prose-invert max-w-none bg-card p-6 rounded-xl border border-border" dangerouslySetInnerHTML={{ __html: project.full_description }} />
            )}
          </div>
        </div>

        {/* More Projects Section */}
        <div className="border-t border-border pt-16">
          <ProjectsGrid 
            limit={3} 
            gridClassName="grid-cols-1 md:grid-cols-3" 
            showTitle={true} 
            className="py-0"
          />
        </div>
      </div>
    </div>
  )
}
