"use client"

import { motion } from "framer-motion"

interface ProductDetailAnimationsProps {
    children: React.ReactNode
    type: "image" | "content"
}

export default function ProductDetailAnimations({ children, type }: ProductDetailAnimationsProps) {
    if (type === "image") {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                {children}
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
        >
            {children}
        </motion.div>
    )
}
