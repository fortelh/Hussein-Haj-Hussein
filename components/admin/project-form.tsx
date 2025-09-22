"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ImageUpload } from "./image-upload"

interface Project {
  id: string
  title: string
  description: string
  category: string
  image_url: string | null
  created_at: string
  updated_at: string
}

interface ProjectFormProps {
  project?: Project | null
  onProjectSaved: (project: Project) => void
  onCancel: () => void
  userRole: string
}

const categories = [
  { value: "control-cabinet", label: "Schaltschrankbau" },
  { value: "cabling", label: "Verkabelung" },
  { value: "heat-detection", label: "LHD (Linear Heat Detector)" },
  { value: "experiments", label: "Spieleien" },
  { value: "about", label: "Über mich" },
  { value: "other", label: "Sonstiges" },
]

export function ProjectForm({ project, onProjectSaved, onCancel, userRole }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    category: project?.category || "",
    image_url: project?.image_url || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const isEditing = !!project

  const availableCategories = categories.filter((cat) => {
    // Limited users cannot create/edit "about" category
    if (userRole === "limited" && cat.value === "about") {
      return false
    }
    return true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isEditing) {
        const { data, error } = await supabase.from("projects").update(formData).eq("id", project.id).select().single()

        if (error) throw error
        onProjectSaved(data)
      } else {
        const { data, error } = await supabase.from("projects").insert([formData]).select().single()

        if (error) throw error
        onProjectSaved(data)
      }
    } catch (error) {
      console.error("Error saving project:", error)
      setError(error instanceof Error ? error.message : "Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  const handleImageRemoved = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }))
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg">{isEditing ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-slate-200">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-slate-200">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              rows={3}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="text-slate-200">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {availableCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-slate-100">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url || undefined}
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
