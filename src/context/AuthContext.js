"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar la aplicación
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      setCurrentUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)
      const response = await axios.post("/auth/login", { username, password })
      const { accessToken } = response.data

      // Guardar token en localStorage
      localStorage.setItem("token", accessToken)

      // Obtener información del usuario
      const userResponse = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const user = userResponse.data
      setCurrentUser(user)
      localStorage.setItem("user", JSON.stringify(user))

      return user
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentUser(null)
  }

  const isAuthenticated = () => {
    return !!currentUser && !!localStorage.getItem("token")
  }

  const hasRole = (role) => {
    if (!currentUser || !currentUser.roles) return false
    return currentUser.roles.includes(role)
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
