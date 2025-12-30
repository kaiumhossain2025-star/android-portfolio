"use client"

import { motion } from "framer-motion"
import {
  Smartphone,
  Gamepad2,
  Palette,
  Code,
  Layout,
  ChevronRight,
  Tablet,
} from "lucide-react"
import { IoLogoAndroid } from "react-icons/io"
import { FaAppStoreIos } from "react-icons/fa6"
import Link from "next/link"

const ICON_MAP: Record<string, any> = {
  android: IoLogoAndroid,
  apple: FaAppStoreIos,
  iologoandroid: IoLogoAndroid,
  faappstoreios: FaAppStoreIos,
  smartphone: Smartphone,
  tablet: Tablet,
  gamepad2: Gamepad2,
  palette: Palette,
  code: Code,
  layout: Layout,
}


interface ServicesSectionProps {
  services: any[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  if (!services || services.length === 0) {
    return <section id="services" className="py-20 bg-background min-h-[500px]" />
  }

  return (
    <section id="services" className="relative py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions for mobile and game development
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon_name.toLowerCase()] || Smartphone
            const colorTheme = service.color_theme || "from-[#8b5cf6] to-[#a78bfa]"
            const iconColorClass = "text-white"

            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Link href={`/services/${service.id}`}>
                  <div className="group cursor-pointer h-full">
                    <div className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-all duration-300 h-full hover:bg-muted hover:shadow-lg hover:shadow-primary/20">
                      {/* Icon Container */}
                      <div
                        className={`w-16 h-16 rounded-xl bg-linear-to-r ${colorTheme} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`w-8 h-8 ${iconColorClass}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-[#c084fc] group-hover:to-[#ec4899] group-hover:bg-clip-text transition-all">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>

                      {/* Learn More Link */}
                      <div className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors">
                        <span className="text-sm font-semibold">Learn More</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
