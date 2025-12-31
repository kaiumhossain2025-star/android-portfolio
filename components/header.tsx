"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown, Smartphone, Palette, Code, Folder, Layers, Star, Gamepad2, Layout, Monitor, Box, Tablet } from "lucide-react"
import { IoLogoAndroid } from "react-icons/io"
import { FaAppStoreIos } from "react-icons/fa6"
import MobileDrawer from "./mobile-drawer"
import Image from "next/image"
import ThemeToggle from "./theme-toggle"
import { createClient } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ICON_MAP: Record<string, any> = {
  Smartphone,
  Gamepad2,
  Layout,
  Code,
  Monitor,
  Box,
  Layers,
  Palette,
  Tablet,
  IoLogoAndroid,
  FaAppStoreIos,
  Android: IoLogoAndroid,
  Apple: FaAppStoreIos
}

import { services } from "@/lib/services"

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [siteName, setSiteName] = useState("ApticStudio")
  const [logoUrl, setLogoUrl] = useState("")
  const [servicesList, setServicesList] = useState<any[]>(services)
  const [productsList, setProductsList] = useState<any[]>([])
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("site_name, logo_url").single()
      if (data) {
        if (data.site_name) setSiteName(data.site_name)
        // If logo_url is present, set it. If null, it remains null/empty string depending on init, but current init is "/my-logo.png" which needs to be cleared if we strictly follow DB.
        // Actually, if DB has logo_url, use it. If not, we should probably set to empty string to ensure blank if that's the desired strictness.
        // But the user said "if we upload a logo... only then show logo".
        // Let's initialize logoUrl to "" (empty) instead of default.
        setLogoUrl(data.logo_url || "")
      }

      const { data: products } = await supabase
        .from("products")
        .select("*")
        .order("order_index")
        .limit(5) // Limit for dropdown

      if (products) {
        setProductsList(products)
      }
    }
    fetchSettings()
  }, [])

  const getLink = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`
    }
    return href
  }

  // Helper to determine if a generic link is active is tricky with hash, so we'll just stick to simple hover styles
  const navContent = (
    <div className="hidden md:flex items-center justify-center gap-1 w-[560px]">
      <Link href={getLink("#home")} className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium">
        Home
      </Link>

      {/* Products Dropdown */}
      <div className="flex items-center gap-0.5">
        <Link href="/products" className="px-3 py-2 rounded-l-lg text-foreground hover:bg-muted transition-colors font-medium">
          Products
        </Link>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="px-1.5 py-2 rounded-r-lg text-foreground hover:bg-muted transition-colors font-medium focus:outline-none flex items-center">
            <ChevronDown size={14} className="opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="
                w-[300px] p-2
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                shadow-xl
                rounded-xl
              "
          >
            {productsList?.length > 0 ? (
              (productsList || []).map((product) => (
                <DropdownMenuItem key={product.id} asChild className="focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-foreground">
                  <Link href={`/products/${product.id}`} className="flex items-start gap-3 p-3 cursor-pointer">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          <Box size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground line-clamp-1">{product.title}</div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.short_description}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )
              )
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">Loading products...</div>
            )}

            <div className="p-2 border-t border-border mt-1">
              <Link href="/products" className="block text-center text-xs font-medium text-primary hover:underline">
                View All Products
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Services Dropdown */}
      <div className="flex items-center gap-0.5">
          <Link href="/services" className="px-3 py-2 rounded-l-lg text-foreground hover:bg-muted transition-colors font-medium">
             Services
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="px-1.5 py-2 rounded-r-lg text-foreground hover:bg-muted transition-colors font-medium focus:outline-none flex items-center">
              <ChevronDown size={14} className="opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="
                w-[300px] p-2
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                shadow-xl
                rounded-xl
              "
            >
              {servicesList?.length > 0 ? (
                (servicesList || []).map((service) => {
                  const Icon = ICON_MAP[service.icon_name] || Smartphone
                  return (
                    <DropdownMenuItem key={service.id} asChild className="focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-foreground">
                      <Link href={`/services/${service.id}`} className="flex items-start gap-3 p-3 cursor-pointer">
                        <div className={`p-2 rounded-md ${service.color_theme.includes('blue') ? 'bg-blue-500/10 text-blue-500' : service.color_theme.includes('purple') ? 'bg-purple-500/10 text-purple-500' : 'bg-primary/10 text-primary'}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{service.title}</div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">Loading services...</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      {/* Projects Dropdown */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium focus:outline-none">
          Projects <ChevronDown size={14} className="opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="
    w-[300px] p-2
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-700
    shadow-xl
    rounded-xl
  "
        >
          <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-foreground">
            <Link href="/projects" className="flex items-start gap-3 p-3 cursor-pointer">
              <div className="p-2 bg-orange-500/10 rounded-md text-orange-500">
                <Folder size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">All Projects</div>
                <p className="text-xs text-muted-foreground mt-0.5">View our complete portfolio</p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-foreground">
            <Link href={getLink("#projects")} className="flex items-start gap-3 p-3 cursor-pointer">
              <div className="p-2 bg-green-500/10 rounded-md text-green-500">
                <Star size={20} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Featured</div>
                <p className="text-xs text-muted-foreground mt-0.5">Our highlight styling</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href="/team" className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium">
        Team
      </Link>
    </div>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border backdrop-blur-lg bg-background/80">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg group-hover:scale-110 transition-transform object-cover"
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          {navContent}

          {/* Contact Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href={getLink("#contact")}
              className="hidden md:inline-flex px-6 py-2 rounded-lg bg-linear-to-r from-[#c084fc] to-[#ec4899] text-white hover:shadow-lg hover:shadow-[#ec4899]/50 transition-all font-medium"
            >
              Contact Us
            </Link>
            <button
              aria-label="Toggle mobile menu"
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} className="text-foreground" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
