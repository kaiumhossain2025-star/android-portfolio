"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Mail, Clock, RefreshCw, Smartphone } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { getContactMessages } from "@/app/actions/contact"

interface Message {
  id: number
  created_at: string
  name: string
  email: string
  message: string
}

export default function MessagesPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchMessages()

    // ⭐ REALTIME LISTENER FOR NEW MESSAGES
    const channel = supabase
      .channel("contact-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        (payload) => {
          console.log("New message received:", payload.new)

          // Prepend new message (latest at top)
          setMessages((prev) => [payload.new as Message, ...prev])

          toast.success("New message received!")
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // ⭐ FETCH MESSAGES — newest first using ID
  const fetchMessages = async () => {
    setRefreshing(true)

    try {
      // Use Server Action to bypass RLS if using secret login
      const data = await getContactMessages()
      if (data) setMessages(data)
    } catch (error) {
      console.log("Error fetching messages:", error)
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>

        <button
          onClick={fetchMessages}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center p-12 bg-card border border-border rounded-xl text-muted-foreground">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
          No messages received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-card border border-border p-6 rounded-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{msg.name}</h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap border border-border/50">
                {msg.message}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
