"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface Project {
  id: string
  title: string
  description: string
  category: string
  image_url: string | null
  created_at: string
  updated_at: string
}

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  canEdit: boolean
  canDelete: boolean
}

export function ProjectCard({ project, onEdit, onDelete, canEdit, canDelete }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("projects").delete().eq("id", project.id)

      if (error) throw error
      onDelete(project.id)
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {project.image_url && (
            <div className="flex-shrink-0">
              <Image
                src={project.image_url || "/placeholder.svg"}
                alt={project.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-100 mb-1">{project.title}</h3>
            <p className="text-sm text-slate-400 mb-2 line-clamp-2">{project.description}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="bg-slate-700 px-2 py-1 rounded">{project.category}</span>
              <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {canEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(project)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
