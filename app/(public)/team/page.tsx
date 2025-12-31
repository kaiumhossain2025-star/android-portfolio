import { getTeamMembers } from "@/app/actions/team"
import Image from "next/image"
import { Linkedin, Twitter, Globe, Github, Dribbble } from "lucide-react"
import Link from "next/link"

export const revalidate = 0 // Dynamic

export default async function TeamPage() {
  const members = await getTeamMembers()

  const socialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin": return <Linkedin size={18} />
      case "twitter": return <Twitter size={18} />
      case "github": return <Github size={18} />
      case "dribbble": return <Dribbble size={18} />
      default: return <Globe size={18} />
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-16 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals driving our success and innovation.
          </p>
        </div>

        {/* Grid */}
        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {members.map((member) => (
              <div key={member.id} className="group flex items-center gap-6 p-6 rounded-2xl transition-all duration-300 bg-white dark:bg-[#100C24] border border-gray-200 dark:border-white/5 hover:border-purple-500/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 h-[200px]">
                {/* Image Container - Left Side, Circle */}
                <div className="relative w-20 h-20 shrink-0">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full border-2 border-gray-100 dark:border-white/10 group-hover:border-purple-500/50 transition-colors duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-muted-foreground rounded-full">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-2xl text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3 uppercase tracking-wide text-xs">{member.role}</p>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">{member.bio}</p>

                  {/* Socials */}
                  {member.social_links && member.social_links.length > 0 && (
                    <div className="flex gap-4">
                      {member.social_links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform"
                        >
                          {socialIcon(link.platform)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl">
            <p className="text-muted-foreground text-lg">Our team is growing! Check back soon.</p>
          </div>
        )}

        <div className="mt-20 text-center">
          <div className="inline-block p-1 rounded-full bg-secondary/50">
            <Link href="/#contact" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all inline-block">
              Join Our Team
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">We are always looking for new talent.</p>
        </div>

      </div>
    </div>
  )
}
