"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

const LottiePlayer = dynamic(() => import("@/components/lottie-player"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-card rounded-xl animate-pulse" />,
})

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section id="home" className="relative min-h-screen bg-background overflow-hidden pt-0 pb-0">
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full glowing-purple -z-10" />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-30 -z-10"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
          boxShadow: "0 0 80px rgba(236, 72, 153, 0.2)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="flex flex-col gap-8" variants={itemVariants}>
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground text-pretty"
            >
              We Build Powerful{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#3b82f6] to-[#60a5fa]">
                Android
              </span>
              , <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ec4899] to-[#f472b6]">iOS</span>{" "}
              & <span className="text-transparent bg-clip-text bg-linear-to-r from-[#8b5cf6] to-[#a78bfa]">Game</span>{" "}
              Applications For Your Business.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              High quality development with modern UI, Fast Performance, and global standard security
            </motion.p>

       <motion.div
  variants={itemVariants}
  className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4"
>
  {/* Primary CTA */}
  <Link
    href="#contact"
    className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold
               bg-linear-to-r from-[#3b82f6] to-[#7c3aed]
               text-white text-center
               hover:shadow-lg hover:shadow-blue-500/40
               active:scale-[0.98]
               transition-all
               inline-flex items-center justify-center gap-2"
  >
    Get a Free Quote
    <ChevronRight className="w-4 h-4" />
  </Link>

  {/* Secondary CTA */}
  <Link
    href="#projects"
    className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold
               border border-border
               bg-card text-foreground
               hover:bg-muted
               active:scale-[0.98]
               transition-all
               inline-flex items-center justify-center"
  >
    View Our Work
  </Link>
</motion.div>
          </motion.div>

          {/* Right Content - Lottie Animation */}
          <motion.div variants={itemVariants} className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-b from-[#c084fc] via-transparent to-[#ec4899] opacity-20 blur-3xl -z-10" />
            <LottiePlayer />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
