"use client"

import { type ReactNode, useState, useEffect } from "react"
import { Container } from "react-bootstrap"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { useRouter } from "next/navigation"
import "bootstrap/dist/css/bootstrap.min.css"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      <div
        className="content-container"
        style={{
          display: "flex",
          flex: 1,
          marginTop: "60px",
        }}
      >
        <Sidebar isOpen={sidebarOpen} />
        <main
          className={`main-content ${sidebarOpen ? "" : "expanded"}`}
          style={{
            flex: 1,
            marginLeft: sidebarOpen ? "250px" : "70px",
            transition: "margin-left 0.3s ease",
            padding: "20px",
          }}
        >
          <Container fluid className="py-3">
            {children}
          </Container>
        </main>
      </div>
    </div>
  )
}
