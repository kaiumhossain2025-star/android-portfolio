import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import ProductsSection from "@/components/products-section"
import WhyChooseUs from "@/components/why-choose-us"
import ProjectsGrid from "@/components/projects-grid"
import TestimonialsSection from "@/components/testimonials-section"
import ContactSection from "@/components/contact-section"
import { createServerSideClient } from "@/lib/supabase-server"
import { services } from "@/lib/services"


export default async function Home() {
  const supabase = await createServerSideClient()

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("order_index")
    .limit(4)

  return (
    <>
      <HeroSection />
      <ProductsSection products={products || []} />
      <ServicesSection services={services} />
      <WhyChooseUs />
      <ProjectsGrid />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
