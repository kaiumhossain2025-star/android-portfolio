import ProjectsGrid from "@/components/projects-grid"

export default function ProjectsPage() {
  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            All Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through my complete collection of projects
          </p>
        </div>
        <ProjectsGrid showTitle={false} limit={100} />
      </div>
    </div>
  )
}
