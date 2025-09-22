"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Users, LayoutDashboard, Settings, Crown } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AdminHeaderProps {
  userEmail: string
  userRole: string
  currentPage?: string
}

export function AdminHeader({ userEmail, userRole, currentPage = "dashboard" }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match")
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      console.log("[v0] Attempting password change for user:", userEmail)

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) {
        console.log("[v0] Password change error:", error)
        throw error
      }

      console.log("[v0] Password change successful")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordChange(false)
      alert("Password updated successfully!")
    } catch (error) {
      console.error("Error updating password:", error)
      setError(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{currentPage === "users" ? "User Management" : "Admin Dashboard"}</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/admin/dashboard")}
              variant={currentPage === "dashboard" ? "default" : "outline"}
              className={
                currentPage === "dashboard"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
              }
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            {userRole === "owner" && (
              <Button
                onClick={() => router.push("/admin/users")}
                variant={currentPage === "users" ? "default" : "outline"}
                className={
                  currentPage === "users"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                }
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            <span className="bg-slate-700 px-2 py-1 rounded text-xs mr-2 capitalize flex items-center gap-1">
              {userRole === "owner" && <Crown className="w-3 h-3 text-yellow-500" />}
              {userRole}
            </span>
            {userEmail}
          </div>
          <Button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            variant="outline"
            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
          >
            <Settings className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </div>

      {showPasswordChange && (
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Change Your Password
              {userRole !== "owner" && (
                <span className="text-sm text-slate-400 block mt-1">You can change your own password at any time</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="text-slate-200">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  required
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordChange(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
