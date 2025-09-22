"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ProjectForm } from "./project-form"
import { ProjectCard } from "./project-card"

interface Project {
  id: string
  title: string
  description: string
  category: string
  image_url: string | null
  created_at: string
  updated_at: string
}

interface ProjectsManagerProps {
  initialProjects: Project[]
  userRole: string
}

export function ProjectsManager({ initialProjects, userRole }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleProjectAdded = (newProject: Project) => {
    setProjects([newProject, ...projects])
    setShowForm(false)
  }

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
    setEditingProject(null)
  }

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const handleEdit = (project: Project) => {
    if (userRole === "limited" && project.category === "about") {
      alert('Limited users cannot edit "About" section projects')
      return
    }
    setEditingProject(project)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProject(null)
  }

  const canEditProject = (project: Project) => {
    return userRole !== "limited" || project.category !== "about"
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Project Management</CardTitle>
            {userRole !== "limited" && (
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <ProjectForm
                project={editingProject}
                onProjectSaved={editingProject ? handleProjectUpdated : handleProjectAdded}
                onCancel={handleCancelForm}
                userRole={userRole}
              />
            </div>
          )}

          <div className="grid gap-4">
            {projects.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No projects found. Add your first project to get started.
              </p>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleProjectDeleted}
                  canEdit={canEditProject(project)}
                  canDelete={userRole !== "limited"}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
