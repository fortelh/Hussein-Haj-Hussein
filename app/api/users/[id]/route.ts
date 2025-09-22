import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { role } = await request.json()
    const userId = params.id

    console.log("[v0] Updating user role:", { userId, role })

    const { error } = await supabaseAdmin.from("user_profiles").update({ role }).eq("id", userId)

    if (error) {
      console.log("[v0] Update error:", error)
      throw error
    }

    console.log("[v0] User role updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API Error updating user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    console.log("[v0] Deleting user:", userId)

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.log("[v0] Auth delete error:", authError)
      throw authError
    }

    console.log("[v0] User deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API Error deleting user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete user" },
      { status: 500 },
    )
  }
}
