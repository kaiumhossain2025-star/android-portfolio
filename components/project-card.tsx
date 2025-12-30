"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: number
    title: string
    description: string
    image?: string
    image_url?: string
    tags: string[]
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      className="card group cursor-pointer h-full flex flex-col"
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-(--color-bg)">
        <Image
          src={project.image_url || project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        <h3 className="text-xl font-bold text-(--color-text) group-hover:text-(--color-primary) transition-colors">
          {project.title}
        </h3>
        <p className="text-(--color-text-secondary) text-sm flex-1">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-(--color-primary-light) text-(--color-primary) font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <div className="flex items-center gap-2 text-(--color-primary) font-semibold pt-2 group-hover:gap-3 transition-all">
          View Details
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  )
}
