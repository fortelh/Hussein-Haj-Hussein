import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET() {
  try {
    console.log("[v0] Fetching users from database...")

    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] Error fetching users:", error)
      throw error
    }

    console.log("[v0] Users fetched successfully:", data?.length || 0)
    return NextResponse.json({ users: data || [] })
  } catch (error) {
    console.error("[v0] API Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    console.log("[v0] Creating user:", { email, role })

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.log("[v0] Auth error:", authError)
      throw authError
    }

    console.log("[v0] User created in auth:", authData.user.id)

    const { error: profileError } = await supabaseAdmin.from("user_profiles").insert([
      {
        id: authData.user.id,
        email,
        role,
      },
    ])

    if (profileError) {
      console.log("[v0] Profile error:", profileError)
      throw profileError
    }

    console.log("[v0] User profile created successfully")
    return NextResponse.json({ success: true, user: authData.user })
  } catch (error) {
    console.error("[v0] API Error creating user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 },
    )
  }
}
