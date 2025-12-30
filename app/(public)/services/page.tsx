import { Metadata } from "next"
import ServicesSection from "@/components/services-section"

import { createServerSideClient } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Services - Aptic Studio",
  description: "Comprehensive solutions for mobile and game development, UI/UX design, and more.",
}

import { services } from "@/lib/services"

export default async function ServicesPage() {
  return (
    <div className="pt-20">
      <ServicesSection services={services} />
    </div>
  )
}
