import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Monitor,
  Smartphone,
  Tablet,
  Palette,
  Folder,
  Star,
  Home,
  Users,
  Mail,
  ChevronDown,
  Code,
  Gamepad2,
  Info,
  X,
} from "lucide-react"
import { IoLogoAndroid } from "react-icons/io"
import { FaAppStoreIos } from "react-icons/fa6"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { services } from "@/lib/services"

const ICON_MAP: Record<string, any> = {
  Smartphone,
  Tablet,
  Gamepad2,
  Palette,
  Code,
  Monitor,
  IoLogoAndroid,
  FaAppStoreIos,
  Android: IoLogoAndroid,
  Apple: FaAppStoreIos
}

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getLink = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`
    }
    return href
  }

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isMounted) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-90 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[85vw] max-w-[320px] bg-background z-100 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl border-l border-border",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors text-foreground focus:outline-none focus:ring-2 focus:ring-primary z-50"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {/* Drawer Header */}
        <div className="h-40 min-h-[160px] p-6 flex items-end bg-linear-to-br from-[#c084fc]/20 via-background to-[#ec4899]/20 border-b border-border/50">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold bg-linear-to-r from-[#c084fc] to-[#ec4899] bg-clip-text text-transparent tracking-tight">ApticStudio</h1>
            <p className="text-sm text-foreground/60 font-medium">Digital Solutions</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="flex flex-col">
            {/* Home */}
            <Link
              href={getLink("#home")}
              className="flex items-center gap-4 px-6 py-4 text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <Home size={24} strokeWidth={1.5} />
              <span className="font-medium text-base">Home</span>
            </Link>

            {/* Services Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="services" className="border-none">
                <AccordionTrigger className="w-full flex items-center gap-4 px-6 py-4 text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors hover:no-underline data-[state=open]:text-primary group">
                  <div className="flex items-center gap-4">
                    <Smartphone size={24} strokeWidth={1.5} className="group-data-[state=open]:text-primary" />
                    <span className="font-medium text-base">Services</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-0">
                  <div className="flex flex-col">
                    {services.map((service) => {
                      const Icon = ICON_MAP[service.icon_name] || Smartphone
                      return (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          onClick={onClose}
                          className="flex items-center gap-4 pl-18 pr-6 py-3 text-sm text-muted-foreground hover:bg-muted/30 transition-colors group/item"
                        >
                          <Icon size={16} className="text-purple-500 group-hover/item:scale-110 transition-transform" />
                          <span className="font-medium group-hover/item:text-foreground transition-colors">{service.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Projects Accordion */}
              <AccordionItem value="projects" className="border-none">
                <AccordionTrigger className="w-full flex items-center gap-4 px-6 py-4 text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors hover:no-underline data-[state=open]:text-primary group">
                  <div className="flex items-center gap-4">
                    <Folder size={24} strokeWidth={1.5} className="group-data-[state=open]:text-primary" />
                    <span className="font-medium text-base">Projects</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-0">
                  <div className="flex flex-col">
                    <Link
                      href={getLink("#projects")}
                      onClick={onClose}
                      className="flex items-center gap-4 pl-18 pr-6 py-3 text-sm text-muted-foreground hover:bg-muted/30 transition-colors group/item"
                    >
                      <Folder size={16} className="text-orange-500 group-hover/item:scale-110 transition-transform" />
                      <span className="font-medium group-hover/item:text-foreground transition-colors">All Projects</span>
                    </Link>
                    <Link
                      href={getLink("#projects")}
                      onClick={onClose}
                      className="flex items-center gap-4 pl-18 pr-6 py-3 text-sm text-muted-foreground hover:bg-muted/30 transition-colors group/item"
                    >
                      <Star size={16} className="text-green-500 group-hover/item:scale-110 transition-transform" />
                      <span className="font-medium group-hover/item:text-foreground transition-colors">Featured</span>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            {/* Team */}
            <Link
              href="/team"
              className="flex items-center gap-4 px-6 py-4 text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <Users size={24} strokeWidth={1.5} />
              <span className="font-medium text-base">Team</span>
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className="flex items-center gap-4 px-6 py-4 text-foreground/80 hover:bg-muted/50 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <Info size={24} strokeWidth={1.5} />
              <span className="font-medium text-base">About Us</span>
            </Link>

            {/* Contact Us */}
            <Link
              href={getLink("#contact")}
              className="
    flex items-center gap-4
    px-6 py-4
    text-foreground/80
    hover:bg-muted/50
    hover:text-primary
    transition-colors
  "
              onClick={onClose}
            >
              <Mail size={24} strokeWidth={1.5} />
              <span className="font-medium text-base">Contact Us</span>
            </Link>


          </nav>
        </div>

        {/* Footer Area (Optional version/copyright) */}
        <div className="p-6 border-t border-border/50 text-xs text-muted-foreground text-center">
          © 2025 ApticStudio
        </div>
      </div>
    </>
  )
}
