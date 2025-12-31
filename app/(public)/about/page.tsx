import { createClient } from "@supabase/supabase-js"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  Smartphone, 
  Code2, 
  Target, 
  Lightbulb, 
  Users, 
  Globe,
  Mail,
  MapPin,
  Download,
  CheckCircle2,
  LucideIcon,
  Palette,
  Gamepad2,
  Clock,
  MessageSquare,
  ShieldCheck,
  Zap,
  Search,
  PenTool,
  Rocket
} from "lucide-react"
import { Button } from "@/components/ui/button"


// Force dynamic rendering and disable caching for this page
export const revalidate = 0
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "About Us - Aptic Studio",
  description: "Learn more about Aptic Studio, our mission, vision, and the team behind our success.",
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
  
  // Helper for belief section
  const QuoteIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-[#030014] text-gray-200 selection:bg-purple-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
             </span>
             About Us
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            We Build Digital Products That <span className="text-purple-500">People Trust</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            A development studio focused on building scalable, secure, and user-centric digital solutions.
          </p>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl text-left space-y-12">
           
           <div className="space-y-6">
             <h2 className="text-3xl md:text-4xl font-bold text-white">Who We Are</h2>
             <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                <p>
                  We are a technology-driven development studio working with startups and businesses to turn complex ideas into simple, effective digital products.
                </p>
                <p>
                  Our approach combines clean design, strong engineering, and real-world problem solving.
                </p>
             </div>
           </div>


        </div>
      </section>

      {/* 3. WHAT WE DO */}
      <section className="container mx-auto px-4 py-16 text-left">
         <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-gray-400 max-w-2xl">We specialise in delivering end-to-end digital solutions tailored to business needs.</p>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Android App Dev", icon: Smartphone },
              { title: "iOS App Dev", icon: Smartphone },
              { title: "Mobile Game Dev", icon: Gamepad2 },
              { title: "UI/UX Design", icon: Palette },
            ].map((service, i) => (
               <div key={i} className="flex flex-col gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                      <service.icon size={20} />
                  </div>
                  <h3 className="font-medium text-white text-lg">{service.title}</h3>
               </div>
            ))}
         </div>
      </section>



      {/* MISSION & VISION */}
      <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              {/* Mission */}
              <div className="space-y-4">
                  <div className="flex justify-start text-teal-400 mb-2">
                      <Target size={28} />
                  </div>
                  <h3 className="font-bold text-white text-xl">Our Mission</h3>
                  <p className="text-gray-400 leading-relaxed">
                    To create meaningful digital products that solve real problems, deliver long-term value, and maintain high standards of quality and performance.
                  </p>
              </div>
              {/* Vision */}
              <div className="space-y-4">
                  <div className="flex justify-start text-purple-400 mb-2">
                      <Globe size={28} />
                  </div>
                  <h3 className="font-bold text-white text-xl">Our Vision</h3>
                  <p className="text-gray-400 leading-relaxed">
                    To become a trusted global technology partner by consistently delivering reliable, scalable, and impactful digital solutions.
                  </p>
              </div>
          </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="container mx-auto px-4 py-24 text-left">
          <h2 className="text-3xl font-bold text-white mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {[
                "Quality over shortcuts",
                "Transparent communication",
                "On-time delivery",
                "Scalable & maintainable code",
                "Real-world problem understanding",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300">
                    <CheckCircle2 size={24} className="text-purple-500 shrink-0" />
                    <span className="text-lg text-gray-300 font-medium">{item}</span>
                </div>
              ))}
          </div>
      </section>

      {/* 5. PROCESS */}
      <section className="container mx-auto px-4 py-16 text-left">
        <h2 className="text-3xl font-bold text-white mb-8">Our Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             "Discover & Plan",
             "Design & Prototype",
             "Develop & Test",
             "Launch & Support",
           ].map((phase, i) => (
             <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <span className="block text-4xl font-bold text-purple-500/20 mb-2">0{i + 1}</span>
                <p className="text-xl font-medium text-gray-300">
                  {phase}
                </p>
             </div>
           ))}
        </div>
      </section>

      {/* 6. CTA Headline */}
      <section className="container mx-auto px-4 pt-20 pb-8 text-center">
         <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Have any idea in mind?</h2>
         <p className="text-3xl md:text-5xl font-extrabold text-purple-500 leading-tight py-2">
            Let's build something impactful together
         </p>
      </section>

      {/* 7. CTA */}
      <section className="container mx-auto px-4 pb-24 text-center">
        <Link href="/#contact">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-8 text-2xl rounded-full font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-105">
            Let's Talk
          </Button>
        </Link>
      </section>





   

    </div>
  )
}
