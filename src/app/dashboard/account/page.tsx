"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email || "")

      // Get profile from users table
      const { data: profile } = await supabase
        .from("users")
        .select("display_name")
        .eq("auth_id", user.id)
        .single()

      if (profile) {
        setUsername(profile.display_name || "")
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from("users")
      .update({ display_name: username })
      .eq("auth_id", user.id)

    if (error) alert(error.message)
    else alert("Profile updated!")
  }

  const changePassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) alert(error.message)
    else {
      alert("Password updated!")
      setNewPassword("")
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border rounded p-2 bg-gray-100 text-gray-800"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2 text-gray-800"
          />
        </div>
        <button
          onClick={updateProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>

        <hr />

        {/* Change Password */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded p-2 text-gray-800"
          />
        </div>
        <button
          onClick={changePassword}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Update Password
        </button>
      </div>
    </div>
  )
}
