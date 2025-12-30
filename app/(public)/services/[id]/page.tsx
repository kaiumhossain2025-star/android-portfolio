import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CheckCircle2, Smartphone, Tablet, Gamepad2, Palette, Code, Layout } from "lucide-react"
import { IoLogoAndroid } from "react-icons/io"
import { FaAppStoreIos } from "react-icons/fa6"
import { createServerSideClient } from "@/lib/supabase-server"

const STATIC_SERVICES: Record<string, { description: string, features: string[] }> = {
    "android": {
        description: "We build high-performance Android applications tailored for scalability, security, and real-world usability. Our development process focuses on clean architecture, smooth performance, and seamless user experience across a wide range of Android devices. From idea validation to Play Store–ready apps, we deliver solutions that are reliable, maintainable, and optimized for long-term growth.",
        features: [
            "Native Android Development",
            "Scalable App Architecture",
            "Performance Optimization",
            "Secure Data Handling",
            "Custom UI Integration",
            "Play Store Ready Deployment"
        ]
    },
    "ios": {
        description: "We design and develop refined iOS applications that deliver performance, stability, and premium user experience. Our focus is on creating apps that feel native, intuitive, and aligned with Apple’s design and performance standards. Whether it’s a startup MVP or a full-scale product, we ensure every iOS app is built with precision, consistency, and long-term maintainability.",
        features: [
            "Native iOS Experience",
            "High-Performance Codebase",
            "Elegant Interface Design",
            "Secure App Architecture",
            "App Store Compliance",
            "End-to-End Development"
        ]
    },
    "game": {
        description: "We create engaging mobile games that combine compelling visuals, smooth gameplay, and optimized performance. Our game development process balances creativity with technical excellence to deliver immersive gaming experiences. From casual games to feature-rich mobile titles, we focus on performance, user retention, and scalable game mechanics.",
        features: [
            "Engaging Gameplay Design",
            "Optimized Performance",
            "Custom Game UI & Assets",
            "Cross-Device Compatibility",
            "Monetization Ready",
            "Scalable Game Architecture"
        ]
    },
    "ui/ux": {
        description: "We design intuitive, user-centric digital experiences that balance aesthetics with functionality. Our UI/UX process focuses on understanding user behavior, defining clear flows, and creating visually refined interfaces that feel effortless to use. From concept to final interface, we ensure every screen is purposeful, consistent, and aligned with your business goals.",
        features: [
            "User-Centered Design Approach",
            "Clean & Modern Visual Design",
            "Intuitive User Flows",
            "Wireframing & Prototyping",
            "Design System & Consistency",
            "Cross-Platform Compatibility",
            "Developer-Friendly Handoff"
        ]
    },
}

const ICON_MAP: Record<string, any> = {
    Smartphone,
    Tablet,
    Gamepad2,
    Palette,
    Code,
    Layout,
    IoLogoAndroid,
    FaAppStoreIos,
}

import { getServiceById } from "@/lib/services"

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const service = getServiceById(id)

    if (!service) {
        notFound()
    }

    // Determine Icon & Color
    const Icon = ICON_MAP[service.icon_name] || Smartphone
    const colorTheme = service.color_theme || "from-[#8b5cf6] to-[#a78bfa]"
    const iconColorClass = "text-white"

    return (
        <div className="min-h-screen bg-background pt-12 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/#services"
                    className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </Link>

                {/* Header */}
                <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-12">
                    <div
                        className={`w-20 h-20 rounded-2xl bg-linear-to-br ${colorTheme} flex items-center justify-center mb-8`}
                    >
                        <Icon className={`w-10 h-10 ${iconColorClass}`} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{service.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">{service.fullDescription}</p>
                </div>

                {/* Features */}
                {service.features.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-card/50 border border-border rounded-xl p-8">
                            <h3 className="text-2xl font-bold text-foreground mb-6">Key Features</h3>
                            <ul className="space-y-4">
                                {service.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                        <span className="text-lg text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-linear-to-br from-primary/10 to-accent/10 border border-border rounded-xl p-8 flex flex-col justify-center items-center text-center">
                            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start?</h3>
                            <p className="text-muted-foreground mb-8">Let's turn your idea into reality with our expert development team.</p>
                            <Link
                                href="/#contact"
                                className="px-8 py-3 rounded-lg font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity w-full sm:w-auto"
                            >
                                Get a Quote
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
