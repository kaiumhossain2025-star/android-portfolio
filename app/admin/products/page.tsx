"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Edit, Plus, Trash, Tag, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { getProducts, deleteProduct } from "@/app/actions/products"

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const data = await getProducts()
            setProducts(data || [])
        } catch (error) {
            toast.error("Failed to fetch products")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            await deleteProduct(id)
            toast.success("Product deleted")
            fetchProducts()
        } catch (error: any) {
            toast.error(error.message || "Failed to delete product")
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                    Products
                </h1>
                <Link
                    href="/admin/products/new"
                    className="button-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium">Image</th>
                            <th className="px-6 py-4 text-left font-medium">Title</th>
                            <th className="px-6 py-4 text-left font-medium">Price</th>
                            <th className="px-6 py-4 text-left font-medium">ID (Slug)</th>
                            <th className="px-6 py-4 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-16 h-10 relative rounded-md overflow-hidden bg-muted">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Tag size={16} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium">{product.title}</td>
                                <td className="px-6 py-4 text-sm font-bold">${product.price}</td>
                                <td className="px-6 py-4 text-muted-foreground text-sm font-mono">{product.id}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                                            title="Delete"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    No products found. Click "Add Product" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

