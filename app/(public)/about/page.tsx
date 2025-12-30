import { createClient } from "@supabase/supabase-js"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  Smartphone, 
  ScanLine, 
  Code2, 
  Car, 
  Target, 
  Lightbulb, 
  Users, 
  Globe,
  Mail,
  MapPin,
  Download,
  CheckCircle2,
  LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"


// Force dynamic rendering and disable caching for this page
export const revalidate = 0
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "About Us - Aptic Studio",
  description: "Learn more about Aptic Studio, our mission, vision, and the team behind our success.",
}

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  ScanLine, Code2, Car, Target, Lightbulb, Users, Globe, Smartphone, MapPin, Download, CheckCircle2
}

// Color themes mapping
const THEME_MAP: Record<string, { text: string, bg: string, btn: string, btnHover: string }> = {
  green: { text: "text-green-400", bg: "bg-green-500/10", btn: "bg-green-600", btnHover: "hover:bg-green-700" },
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", btn: "bg-blue-600", btnHover: "hover:bg-blue-700" },
  orange: { text: "text-orange-400", bg: "bg-orange-500/10", btn: "bg-orange-600", btnHover: "hover:bg-orange-700" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", btn: "bg-purple-600", btnHover: "hover:bg-purple-700" },
  teal: { text: "text-teal-400", bg: "bg-teal-500/10", btn: "bg-teal-600", btnHover: "hover:bg-teal-700" },
  primary: { text: "text-purple-400", bg: "bg-purple-500/10", btn: "bg-purple-600", btnHover: "hover:bg-purple-700" },
}

async function getAboutData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const aboutPageRes = await supabase
    .from("about_page")
    .select("*")
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  const statsRes = await supabase
    .from("about_stats")
    .select("*")
    .order("order_index")

  const productsRes = await supabase
    .from("about_products")
    .select("*")
    .order("order_index")

  const settingsRes = await supabase
    .from("site_settings")
    .select("*")
    .single()

  if (aboutPageRes.error && aboutPageRes.code !== 'PGRST116') console.error("❌ Error fetching about page content:", aboutPageRes.error)

  return {
    aboutContent: aboutPageRes.data,
    stats: statsRes.data || [],
    products: productsRes.data || [],
    siteSettings: settingsRes.data,
  }
}

export default async function AboutPage() {
  const { aboutContent, stats, products, siteSettings } = await getAboutData()
  
  // Dynamic Content variables
  const heroBadge = "ApticStudio"
  const heroTitle = aboutContent?.title || "About Aptic Studio"
  const heroDescription = aboutContent?.content || "Aptic Studio is a forward-thinking mobile development company dedicated to solving local challenges through innovative technology. We believe in creating apps that make everyday tasks easier and more efficient for our community."
  // Note: Using 'content' for the description based on the screenshot layout.
  // The Admin panel has 'description' (subtitle) and 'content' (main). 
  // We'll use them smartly.

  const values = [
    { title: "Mission Driven", desc: "Creating technology solutions that address real challenges faced by our communities.", icon: Target, color: "teal" },
    { title: "Innovation First", desc: "Leveraging cutting-edge AI and mobile technologies to build smart, intuitive applications.", icon: Lightbulb, color: "purple" },
    { title: "User Focused", desc: "Designing experiences that are accessible, easy to use, and truly helpful for everyday users.", icon: Users, color: "blue" },
    { title: "Global Impact", desc: "Proud to build solutions that serve and empower our local and global communities.", icon: Globe, color: "primary" },
  ]
  
  const displayProducts = products.length > 0 ? products : [
    { 
       title: "Aptic AI Scanner", 
       category: "QR, OCR & PDF", 
       description: "Transform your phone into a powerful document scanner with AI-powered OCR, QR code scanning, and instant PDF creation.",
       icon_name: "ScanLine",
       color_theme: "green",
       primary_button_text: "Get on Play Store",
       primary_button_link: siteSettings?.play_store_url || "#",
       is_featured: true,
       is_coming_soon: false,
       features: ["Smart OCR Recognition", "PDF Export & Sharing"]
    },
    { 
       title: "Aptic Code Studio", 
       category: "AI-Powered IDE",
       description: "Your intelligent coding companion. Write, debug, and deploy code directly from your mobile device with AI assistance.",
       icon_name: "Code2",
       color_theme: "blue",
       primary_button_text: "Visit App Site",
       is_featured: false,
       is_coming_soon: false,
       features: ["Multi-Language Support", "Built-in Terminal"]
    },
    { 
       title: "Tripzy", 
       category: "Ride Sharing",
       description: "A revolutionary ride-hailing app designed specifically for local transportation ecosystems. Fair pricing for everyone.",
       icon_name: "Car",
       color_theme: "orange",
       primary_button_text: "Notify Me",
       is_featured: false,
       is_coming_soon: true,
       features: ["Easy Booking", "Real-time Tracking"]
    }
  ]

  return (
    <div className="min-h-screen bg-[#030014] text-gray-200 selection:bg-purple-500/30">
      
      {/* 1. HERO / ABOUT SECTION (Matches Screenshot 2) */}
      <section className="container mx-auto px-4 py-16 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Text Content */}
          <div className="space-y-8">
             {/* Badge */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
               </span>
               {heroBadge}
             </div>

             {/* Title */}
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
               {heroTitle}
             </h1>

             {/* Description */}
             <div className="text-lg text-gray-400 leading-relaxed max-w-xl">
               {heroDescription}
             </div>


          </div>

          {/* Right Side: Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             {values.map((v, i) => {
               const theme = THEME_MAP[v.color] || THEME_MAP.primary
               // Custom styling for these specific cards to match the dark screenshot
               return (
                 <div key={i} className="bg-[#100C24] p-6 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors group">
                    <div className={`w-10 h-10 rounded-lg ${theme.bg} ${theme.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                       <v.icon size={20} />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                 </div>
               )
             })}
          </div>

        </div>
      </section>





      {/* 3. CONTACT CTA SECTION (Matches Screenshot 3) */}
      <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Mail size={14} /> Get In Touch
             </div>
             <h2 className="text-3xl md:text-5xl font-bold text-white">Let's Build Something <span className="text-purple-500">Together</span></h2>
             <p className="text-gray-400 max-w-lg mx-auto">Have a project idea or want to collaborate? We'd love to hear from you.</p>
          </div>

          <div className="bg-[#0B081F] rounded-[2.5rem] p-8 md:p-12 border border-white/5 max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
             {/* Left: Info */}
             <div className="flex-1 space-y-10 w-full">
                <h3 className="text-2xl font-bold text-white">Contact Information</h3>
                
                     <div className="space-y-8">
                     <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                           <Mail size={22} />
                        </div>
                        <div>
                           <div className="font-bold text-white mb-1">Email</div>
                           <a href={`mailto:${siteSettings?.contact_email || 'hello@apticstudio.com'}`} className="text-gray-400 hover:text-purple-400 transition-colors">
                              {siteSettings?.contact_email || 'hello@apticstudio.com'}
                           </a>
                        </div>
                     </div>
                     
                     <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                           <MapPin size={22} />
                        </div>
                        <div>
                           <div className="font-bold text-white mb-1">Location</div>
                           <div className="text-gray-400">{siteSettings?.address || 'New York, USA'}</div>
                        </div>
                     </div>

                     <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                           <Download size={22} />
                        </div>
                        <div>
                           <div className="font-bold text-white mb-1">Play Store</div>
                           <a href={siteSettings?.play_store_url || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">View Our Apps</a>
                        </div>
                     </div>
                 </div>
              </div>

             {/* Right: Card */}
             <div className="flex-1 w-full bg-[#110D26] rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="w-28 h-28 bg-[#7C3AED] text-white rounded-[2rem] flex items-center justify-center text-3xl font-bold shadow-2xl shadow-purple-600/20 mb-2">
                   AS
                </div>
                
                <div>
                   <h3 className="text-xl font-bold text-white tracking-wide uppercase">APTIC STUDIO</h3>
                   <p className="text-sm text-gray-500 mt-1">Innovative Software Solutions</p>
                </div>
                
                <a href={siteSettings?.play_store_url || "#"} target="_blank" rel="noopener noreferrer" className="w-full max-w-xs block">
                    <Button className="w-full rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold h-12 shadow-lg shadow-purple-600/20" size="lg">
                       Visit Play Store
                    </Button>
                </a>
             </div>
          </div>
      </section>

    </div>
  )
}
