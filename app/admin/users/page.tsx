import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { UsersManager } from "@/components/admin/users-manager"

const PERMANENT_OWNER_EMAIL = "hussein.hajj-hussein@hotmail.com"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/admin/login")
  }

  let userRole = "limited"
  if (data.user.email === PERMANENT_OWNER_EMAIL) {
    userRole = "owner"
  } else {
    // For other users, check database profile
    const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("email", data.user.email).single()

    if (userProfile) {
      userRole = userProfile.role
    }
  }

  // Only owners can access user management
  if (userRole !== "owner") {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-6 py-8">
        <AdminHeader userEmail={data.user.email || ""} userRole={userRole} currentPage="users" />
        <UsersManager />
      </div>
    </div>
  )
}
