import { createServerSideClient } from "@/lib/supabase-server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions - Aptic Studio",
  description: "Terms and conditions for using Aptic Studio's services and website.",
}

export default async function TermsPage() {
  const supabase = await createServerSideClient()
  const { data } = await supabase
    .from('terms_page')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const title = data?.title || "Terms & Conditions"
  const description = data?.description || "Please read these Terms & Conditions carefully before using our website or services."
  const content = data?.content
  const lastUpdated = data?.updated_at ? new Date(data.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "December 19, 2025"

  return (
    <div className="min-h-screen bg-[#070314] text-gray-300 pb-20">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-[800px]">
           {/* Header */}
           <div className="mb-16 border-b border-white/10 pb-8">
              <span className="text-purple-500 font-bold text-xs tracking-[0.2em] uppercase mb-4 block">ApticStudio</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                {title}
              </h1>
              <p className="text-base text-gray-400 mb-6">
                {description}
              </p>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-500" />
                Last Updated: {lastUpdated}
              </div>
           </div>
           
           {/* Content */}
           <article className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white max-w-none">
                {content ? (
                    <div className="whitespace-pre-wrap font-sans leading-7 text-sm md:text-base space-y-6">
                        {content}
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-500 italic">
                        No terms content has been published yet.
                    </div>
                )}
           </article>
        </div>
    </div>
  )
}
