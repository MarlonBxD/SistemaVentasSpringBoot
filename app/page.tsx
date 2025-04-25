"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página de login
    router.push("/login")
  }, [router])

  return <div>Redirigiendo...</div>
}
