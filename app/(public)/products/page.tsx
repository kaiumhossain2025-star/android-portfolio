import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search, Tag } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { createServerSideClient } from "@/lib/supabase-server"
import { Input } from "@/components/ui/input"

import ProductsList from "@/components/products-list"

export default async function ProductsPage() {
    const supabase = await createServerSideClient()

    const { data: products } = await supabase
        .from("products")
        .select("*")
        .order("order_index")

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductsList initialProducts={products || []} />
                </div>
            </main>

        </div>
    )
}
