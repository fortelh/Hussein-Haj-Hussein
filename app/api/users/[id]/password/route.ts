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

    const { password } = await request.json()

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Create admin client with service role
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Update user password
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(params.id, { password })

    if (updateError) {
      console.error("Error updating user password:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error in password update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
