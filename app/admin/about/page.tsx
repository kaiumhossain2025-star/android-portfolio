"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { updateAbout } from "@/app/actions/about"

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [id, setId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchAbout()
    }, [])

    const fetchAbout = async () => {
        try {
            const { data, error } = await supabase
                .from('about_page')
                .select('*')
                .order('updated_at', { ascending: false })
                .limit(1)
                .single()

            if (data) {
                setId(data.id)
                setTitle(data.title)
                setDescription(data.description)
                setContent(data.content)
            }
        } catch (error) {
            console.error('Error fetching about page:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const result = await updateAbout({
                id,
                title,
                description,
                content
            })

            if (result.success && result.data) {
                // Update local state with the confirmed data from server
                setId(result.data.id)
                setTitle(result.data.title)
                setDescription(result.data.description)
                setContent(result.data.content)
                
                toast.success("About page updated successfully")
            }
        } catch (error: any) {
            console.error('Error saving about page:', error)
            toast.error(error.message || "Failed to update about page")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">About Page Content</h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Page Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Hero Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="About Aptic Studio"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Hero Subtitle</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description for the page header..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Main Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Full about page content..."
                            className="min-h-[400px] font-mono"
                        />
                        <p className="text-sm text-muted-foreground">
                            You can use plain text here. This content is typically shown in the 'About Us' section.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
