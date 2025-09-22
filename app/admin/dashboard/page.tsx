import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectsManager } from "@/components/admin/projects-manager"
import { AdminHeader } from "@/components/admin/admin-header"
// import { UsersManager } from "@/components/admin/users-manager" // Removed import

const PERMANENT_OWNER_EMAIL = "hussein.hajj-hussein@hotmail.com"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/admin/login")
  }

  console.log("[v0] User authenticated:", data.user.email)

  let userRole = "limited"
  if (data.user.email === PERMANENT_OWNER_EMAIL) {
    userRole = "owner"
    console.log("[v0] Permanent owner detected")
  } else {
    // For other users, check database profile
    const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("email", data.user.email).single()

    if (userProfile) {
      userRole = userProfile.role
    }
  }

  console.log("[v0] Final user role:", userRole)

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (projectsError) {
    console.error("Error fetching projects:", projectsError)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-6 py-8">
        <AdminHeader userEmail={data.user.email || ""} userRole={userRole} currentPage="dashboard" />

        <ProjectsManager initialProjects={projects || []} userRole={userRole} />
      </div>
    </div>
  )
}
