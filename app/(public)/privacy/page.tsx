import { getPrivacy } from "@/app/actions/privacy"
import { Metadata } from "next"

// Force dynamic rendering and disable caching for this page
export const revalidate = 0
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Privacy Policy - Aptic Studio",
  description: "Privacy Policy for Aptic Studio.",
}

export default async function PrivacyPage() {
  const privacyData = await getPrivacy()
  
  // Fallbacks if DB is empty
  const pageTitle = privacyData?.title || "Privacy Policy"
  const updatedDate = privacyData?.updated_at 
    ? new Date(privacyData.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    
  // If description is present, we might want to show it as an intro. 
  // But for a pure document style, usually the content is enough. 
  // We'll trust the Admin to put the intro IN the content if they want it, 
  // OR we can display it right after the title. I'll put it after the title as a lead.
  const pageDescription = privacyData?.description || ""
  
  const pageContent = privacyData?.content || `
      <section class="space-y-4">
          <h2 class="text-3xl font-bold text-foreground">1. Information We Collect (Default)</h2>
          <p class="text-muted-foreground leading-relaxed">
            We are currently updating our privacy policy. Please check back later.
          </p>
      </section>
  `

  return (
    <div className="min-h-screen bg-background pt-12 pb-12 md:pt-24 md:pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                {pageTitle}
            </h1>

        </div>

        {/* Intro / Description if exists */}
        {pageDescription && (
            <div className="mb-8 md:mb-12 text-base md:text-xl text-foreground leading-relaxed text-center max-w-2xl mx-auto">
                {pageDescription}
            </div>
        )}

        {/* Main Content */}
        {/* Main Content */}
        <article className="prose md:prose-lg dark:prose-invert max-w-none 
            prose-headings:!text-foreground 
            prose-p:!text-foreground 
            prose-li:!text-foreground
            prose-strong:!text-foreground
            prose-a:!text-primary
            [&_*]:!text-foreground
            [&_.ql-editor]:!bg-transparent [&_.ql-editor]:!p-0"
            style={{ color: 'var(--foreground)' }}>
           <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        </article>
      </div>
    </div>
  )
}
