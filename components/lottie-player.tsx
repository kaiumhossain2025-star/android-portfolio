"use client"

import { useEffect, useRef } from "react"

export default function LottiePlayer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animation: any = null
    let isMounted = true

    const loadLottie = async () => {
      try {
        const lottie = await import("lottie-web")
        const animationData = await import("@/public/mobile_app_lottie.json")

        if (containerRef.current && isMounted) {
          // Clear any existing content just in case
          containerRef.current.innerHTML = ""

          animation = lottie.default.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animationData.default || animationData,
          })
        }
      } catch (error) {
        console.log("[v0] Error loading Lottie animation:", error)
      }
    }

    loadLottie()

    return () => {
      isMounted = false
      if (animation) {
        animation.destroy()
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full min-h-96 flex items-center justify-center" />
}
