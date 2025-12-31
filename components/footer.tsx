"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Facebook, Instagram, Youtube, Globe, Smartphone, Gamepad2, Palette, Code, Layout, Tablet, Monitor } from "lucide-react"
import { IoLogoAndroid } from "react-icons/io"
import { FaAppStoreIos } from "react-icons/fa6"
import { createClient } from "@/lib/supabase"
import Image from "next/image"

// Icon mapping helper
const getIcon = (platform: string) => {
  const p = platform.toLowerCase()
  if (p.includes("github")) return Github
  if (p.includes("linkedin")) return Linkedin
  if (p.includes("twitter")) return Twitter
  if (p.includes("x")) return Twitter
  if (p.includes("facebook")) return Facebook
  if (p.includes("instagram")) return Instagram
  if (p.includes("youtube")) return Youtube
  if (p.includes("email")) return Mail
  return Globe
}

const ICON_MAP: Record<string, any> = {
  Smartphone,
  Tablet,
  Gamepad2,
  Palette,
  Code,
  Layout,
  Monitor,
  IoLogoAndroid,
  FaAppStoreIos,
  Android: IoLogoAndroid,
  Apple: FaAppStoreIos
}

import { services as localServices } from "@/lib/services"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [socials, setSocials] = useState<any[]>([])
  const [servicesList, setServicesList] = useState<any[]>([])
  const [siteName, setSiteName] = useState("Aptic Studio")
  const [logoUrl, setLogoUrl] = useState("")
  const [services, setServices] = useState<any[]>(localServices)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: socialData } = await supabase.from("social_links").select("*").eq("is_active", true)
      if (socialData) setSocials(socialData)

      const { data: settings } = await supabase.from("site_settings").select("site_name, logo_url").single()
      if (settings) {
        if (settings.site_name) setSiteName(settings.site_name)
        setLogoUrl(settings.logo_url || "")
      }

      const { data: services } = await supabase
        .from("services")
        .select("id, title")
        .order("order_index")
        .limit(5)

      if (services) {
        setServicesList(services)
      }
    }
    fetchData()
  }, [])

  return (
    <footer className="bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-300 border-t border-border pt-16 pb-8 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {/* Strict logo visibility: Show only if logoUrl is present */}
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
              )}
            </div>
            <p className="text-inherit/70 text-sm max-w-xs">
              Building beautiful and functional digital experiences.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-inherit mb-4">Services</h3>
            <nav className="flex flex-col gap-2">
              {services.map((service) => {
                const Icon = ICON_MAP[service.icon_name] || Smartphone
                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="text-inherit/70 hover:text-primary transition-colors text-sm flex items-center gap-2"
                  >
                    <Icon size={16} />
                    {service.title}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-inherit mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-inherit/70 hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link href="/products" className="text-inherit/70 hover:text-primary transition-colors text-sm">
                Products
              </Link>
              <Link href="/services" className="text-inherit/70 hover:text-primary transition-colors text-sm">
                Services
              </Link>
              <Link href="/projects" className="text-inherit/70 hover:text-primary transition-colors text-sm">
                Projects
              </Link>
              <Link href="/team" className="text-inherit/70 hover:text-primary transition-colors text-sm">
                Team
              </Link>
              <Link href="/about" className="text-inherit/70 hover:text-primary transition-colors text-sm">
                About
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-inherit mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socials.length > 0 ? (
                socials.map((social, i) => {
                  const Icon = getIcon(social.platform)
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  )
                })
              ) : (
                [
                  { icon: Twitter, href: "https://twitter.com" },
                  { icon: Linkedin, href: "https://linkedin.com" },
                  { icon: Github, href: "https://github.com" },
                  { icon: Instagram, href: "https://instagram.com" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <item.icon size={20} />
                  </a>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border/20">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
