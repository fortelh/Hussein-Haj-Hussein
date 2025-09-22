import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PERMANENT_OWNER_EMAIL = "hussein.hajj-hussein@hotmail.com"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated and is the permanent owner
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user || user.email !== PERMANENT_OWNER_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    if (!status || !["active", "held"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Create admin client with service role
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Update user status in auth metadata and disable/enable user
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(params.id, {
      user_metadata: { status },
      // Disable user if held, enable if active
      email_confirm: status === "active",
    })

    if (updateError) {
      console.error("Error updating user status:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Also update the user profile in the database
    const { error: profileError } = await adminSupabase
      .from("user_profiles")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", params.id)

    if (profileError) {
      console.error("Error updating user profile:", profileError)
    }

    return NextResponse.json({ message: "User status updated successfully" })
  } catch (error) {
    console.error("Error in status update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
