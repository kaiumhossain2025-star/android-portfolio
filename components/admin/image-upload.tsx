"use client"

import { useState } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setUploading(true)

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath)

            onChange(data.publicUrl)
            toast.success("Image uploaded")
        } catch (error) {
            toast.error("Error uploading image")
            console.log(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-border group">
                        <Image fill src={value} alt="Upload" className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-40 h-40 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50 text-muted-foreground">
                        <ImageIcon size={24} />
                    </div>
                )}

                <div className="flex-1">
                    <label className={`
             flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors w-fit
             ${disabled || uploading
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:opacity-90'}
           `}>
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onUpload}
                            disabled={disabled || uploading}
                        />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB.
                    </p>
                </div>
            </div>
        </div>
    )
}
