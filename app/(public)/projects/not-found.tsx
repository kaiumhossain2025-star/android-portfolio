import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The project you are looking for doesn't exist.
      </p>
      <Link
        href="/#projects"
        className="px-6 py-3 rounded-lg bg-primary text-primary-foreground"
      >
        Back to Projects
      </Link>
    </div>
  )
}
