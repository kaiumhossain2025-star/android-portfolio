"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Search, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

interface ProductsListProps {
    initialProducts: any[]
}

export default function ProductsList({ initialProducts }: ProductsListProps) {
    const [products, setProducts] = useState(initialProducts)
    const [filteredProducts, setFilteredProducts] = useState(initialProducts)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredProducts(products)
        } else {
            const filtered = products.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.short_description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredProducts(filtered)
        }
    }, [searchTerm, products])

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

    return (
        <>
            {/* Header and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-foreground mb-4">All Products</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Browse our collection of premium templates, UI kits, and starter packs.
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        className="pl-9 bg-card"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No products found matching &quot;{searchTerm}&quot;</p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredProducts.map((product) => (
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
                                        {/* <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/10">
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
            )}
        </>
    )
}
