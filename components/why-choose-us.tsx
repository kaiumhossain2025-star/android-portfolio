"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

export default function WhyChooseUs() {


  const features = [
    "Professional Team",
    "Fast Delivery",
    "Real Delivery",
    "Pixel-perfect UI",
    "High-performance Code",
    "Maintenance & Support",
    "Affordable Pricing",
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="why-choose" className="relative py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Why Choose Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience excellence with our trusted development team
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl hover:border-primary transition-all duration-300 hover:bg-muted group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-linear-to-r from-[#c084fc] to-[#ec4899] group-hover:scale-110 transition-transform">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-foreground font-medium">{feature}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Team Section - Intro Block */}
        <motion.div
          className="mt-10 relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm flex flex-col md:flex-row items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {/* Left: Content */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Our Team</h3>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Our diverse team of engineers, designers, and strategists is dedicated to delivering excellence in every line of code and pixel of design.
            </p>
            <div>
              <Link href="/team" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all group shadow-md hover:shadow-lg">
                View All Members
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center p-2 md:p-2">
            {/* Flat Vector Illustration */}
            <img
              src="/team-illustration.png"
              alt="Our Team Illustration"
              className="w-[80%] md:w-[50%] h-auto object-contain mb-6 md:mb-10"
            />
          </div>

        </motion.div>


      </div>
    </section>
  )
}
