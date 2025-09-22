"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { UserPlus, Trash2, Crown, Key, UserX, UserCheck } from "lucide-react"

interface UserProfile {
  id: string
  email: string
  role: string
  created_at: string
  updated_at: string
  status?: "active" | "held"
}

const PERMANENT_OWNER_EMAIL = "hussein.hajj-hussein@hotmail.com"

export function UsersManager() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState<string | null>(null)
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "limited",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      const allUsers = data.users || []
      const hasOwner = allUsers.some((user) => user.email === PERMANENT_OWNER_EMAIL)

      if (!hasOwner) {
        allUsers.unshift({
          id: "permanent-owner",
          email: PERMANENT_OWNER_EMAIL,
          role: "owner",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      setUsers(allUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setFormData({ email: "", password: "", role: "limited" })
      setShowForm(false)
      fetchUsers()
    } catch (error) {
      console.error("Error creating user:", error)
      setError(error instanceof Error ? error.message : "Failed to create user")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (userId === "permanent-owner") {
      alert("Cannot change the permanent owner's role")
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
      alert("Failed to update user role")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (userId === "permanent-owner") {
      alert("Cannot delete the permanent owner")
      return
    }

    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user")
    }
  }

  const handleChangeUserPassword = async (userId: string) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwordData.newPassword }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setPasswordData({ newPassword: "", confirmPassword: "" })
      setShowPasswordChange(null)
      setError(null)
      alert("Password updated successfully!")
    } catch (error) {
      console.error("Error updating password:", error)
      setError(error instanceof Error ? error.message : "Failed to update password")
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    if (userId === "permanent-owner") {
      alert("Cannot change the permanent owner's status")
      return
    }

    const newStatus = currentStatus === "held" ? "active" : "held"
    const action = newStatus === "held" ? "hold" : "activate"

    if (!confirm(`Are you sure you want to ${action} this user?`)) return

    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      fetchUsers()
    } catch (error) {
      console.error("Error updating user status:", error)
      alert(`Failed to ${action} user`)
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800 mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">User Management</CardTitle>
          <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-slate-200">
                    Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="limited" className="text-slate-100">
                        Limited
                      </SelectItem>
                      <SelectItem value="admin" className="text-slate-100">
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                    {isLoading ? "Creating..." : "Create User"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {user.id === "permanent-owner" && <Crown className="w-4 h-4 text-yellow-500" />}
                    <div>
                      <h3 className="font-medium text-slate-100 flex items-center gap-2">
                        {user.email}
                        {user.id === "permanent-owner" && (
                          <span className="text-yellow-500 text-sm">(Permanent Owner)</span>
                        )}
                        {user.status === "held" && (
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">HELD</span>
                        )}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUpdateRole(user.id, value)}
                      disabled={user.id === "permanent-owner"}
                    >
                      <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="limited" className="text-slate-100">
                          Limited
                        </SelectItem>
                        <SelectItem value="admin" className="text-slate-100">
                          Admin
                        </SelectItem>
                        <SelectItem value="owner" className="text-slate-100">
                          Owner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {user.id !== "permanent-owner" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPasswordChange(user.id)}
                        className="border-blue-600 text-blue-400 hover:bg-blue-900/20 bg-transparent"
                      >
                        <Key className="w-3 h-3" />
                      </Button>
                    )}
                    {user.id !== "permanent-owner" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleUserStatus(user.id, user.status || "active")}
                        className={
                          user.status === "held"
                            ? "border-green-600 text-green-400 hover:bg-green-900/20 bg-transparent"
                            : "border-orange-600 text-orange-400 hover:bg-orange-900/20 bg-transparent"
                        }
                      >
                        {user.status === "held" ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      </Button>
                    )}
                    {user.id !== "permanent-owner" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {showPasswordChange === user.id && (
                  <div className="mt-4 p-4 bg-slate-700 rounded border border-slate-600">
                    <h4 className="text-sm font-medium text-slate-200 mb-3">Change Password for {user.email}</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="newPassword" className="text-slate-200 text-xs">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                          className="bg-slate-600 border-slate-500 text-slate-100 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-slate-200 text-xs">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-slate-600 border-slate-500 text-slate-100 text-sm"
                        />
                      </div>
                      {error && <p className="text-xs text-red-400">{error}</p>}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleChangeUserPassword(user.id)}
                          className="bg-green-600 hover:bg-green-700 text-xs"
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowPasswordChange(null)
                            setPasswordData({ newPassword: "", confirmPassword: "" })
                            setError(null)
                          }}
                          className="border-slate-500 text-slate-300 hover:bg-slate-600 bg-transparent text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
