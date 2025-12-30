"use client"

import { motion } from "framer-motion"
import { ChevronRight, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProductsSkeleton } from "@/components/products-skeleton"

interface ProductsSectionProps {
    products: any[]
}

export default function ProductsSection({ products }: ProductsSectionProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    if (!products) {
        return (
            <section id="products" className="py-20 bg-muted/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductsSkeleton />
                </div>
            </section>
        )
    }

    if (products.length === 0) return null

    return (
        <section id="products" className="py-20 bg-muted/30 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Our Products</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            High-quality templates and kits to accelerate your development.
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background hover:bg-muted font-medium transition-all group"
                    >
                        View All Products
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {products.map((product) => (
                        <motion.div key={product.id} variants={itemVariants}>
                            <Link href={`/products/${product.id}`} className="group block h-full">
                                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                                    {/* Image Container */}
                                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Tag size={40} />
                                            </div>
                                        )}
                                        {/* Price Tag */}
                                        {/* <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white md:px-3 md:py-1 px-2.5 py-0.5 rounded-full text-sm font-bold border border-white/10">
                                            ${product.price}
                                        </div> */}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                                            {product.short_description}
                                        </p>

                                        <div className="flex items-center text-primary text-sm font-medium mt-auto">
                                            <span className="group-hover:underline">View Details</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile View All Button */}
                <motion.div
                    className="mt-8 md:hidden flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Link
                        href="/products"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all w-full justify-center"
                    >
                        View All Products
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
