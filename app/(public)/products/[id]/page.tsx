import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Share2, ShoppingCart, Star, Tag } from "lucide-react"
import Header from "@/components/header"

import { Button } from "@/components/ui/button"
import { createServerSideClient } from "@/lib/supabase-server"
import ProductDetailAnimations from "@/components/product-detail-animations"


interface Props {
    params: Promise<{ id: string }>
}

export default async function ProductDetailPage(props: Props) {
    const params = await props.params;
    const {
        id
    } = params;

    const supabase = await createServerSideClient()

    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

    if (!product) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow pt-0 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to All Products
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Left Column - Image */}
                        <ProductDetailAnimations type="image">
                            <div className="relative aspect-video lg:aspect-square w-full rounded-3xl overflow-hidden border border-border bg-muted shadow-2xl h-[70%]">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <Tag size={64} />
                                    </div>
                                )}
                                {/* <div className="absolute top-4 right-4">
                                    <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-white/10">
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div> */}
                            </div>
                        </ProductDetailAnimations>

                        {/* Right Column - Details */}
                        <ProductDetailAnimations type="content">
                            <div className="flex flex-col">
                                <div className="mb-6">
                                    {/* <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                            Digital Product
                                        </span>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-muted-foreground ml-1 text-sm">(5.0)</span>
                                        </div>
                                    </div> */}

                                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                                        {product.title}
                                    </h1>
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        {product.short_description}
                                    </p>
                                </div>


                                {/* <div className="border-t border-border my-8 pt-8">
                                    <div className="flex items-baseline mb-8">
                                        <span className="text-5xl font-bold text-foreground">${product.price}</span>
                                        <span className="text-lg text-muted-foreground ml-2">USD</span>
                                    </div>

                                    <div className="grid gap-4 mb-8">
                                        <Button size="lg" className="w-full text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl">
                                            <ShoppingCart className="mr-2 w-5 h-5" />
                                            Purchase Now
                                        </Button>
                                        <p className="text-center text-sm text-muted-foreground">
                                            Instant download + Lifetime updates
                                        </p>
                                    </div>
                                </div> */}



                                {/* Detailed Description */}
                                {product.details && (
                                    <div className="mt-0">
                                        <h3 className="text-2xl font-bold mb-4">Description</h3>
                                        <div className="prose dark:prose-invert text-muted-foreground max-w-none">
                                            <p>{product.details}</p>
                                        </div>
                                    </div>
                                )}

                                
                                <div className="flex justify-end mt-8 mb-8">
                                    {product.install_link && (
                                        <a
                                            href={product.install_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="relative inline-flex group overflow-hidden rounded-xl w-full sm:w-auto"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 animate-gradient-x opacity-100 transition-opacity" />
                                            <div className="relative px-8 py-4 flex items-center justify-center gap-3 bg-transparent text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform duration-200">
                                                <ShoppingCart className="w-6 h-6 animate-bounce" />
                                                Install Now
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </ProductDetailAnimations>
                    </div>
                </div>
            </main>

           
        </div>
    )
}
