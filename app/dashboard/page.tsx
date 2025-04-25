"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { FaShoppingCart, FaUsers, FaBox, FaMoneyBillWave } from "react-icons/fa"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import { useRouter } from "next/navigation"
import Layout from "@/components/Layout"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalClientes: 0,
    totalProductos: 0,
    ingresosMes: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Configurar el token para las solicitudes
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // En un caso real, estas serían llamadas a tu API
        // Por ejemplo:
        // const ventasResponse = await axios.get("/api/ventas/stats")
        // const clientesResponse = await axios.get("/api/clientes/count")
        // etc.

        // Por ahora usamos datos de ejemplo
        setStats({
          totalVentas: 156,
          totalClientes: 48,
          totalProductos: 124,
          ingresosMes: 15680.5,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
        setLoading(false)

        // Si hay un error de autenticación, redirigir al login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      }
    }

    fetchDashboardData()
  }, [router])

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="mb-4">Dashboard</h1>
        <p className="text-muted mb-4">Resumen general del sistema</p>

        {/* Tarjetas de estadísticas */}
        <Row className="stats-cards">
          <Col md={6} xl={3}>
            <Card className="mb-4">
              <Card.Body className="d-flex align-items-center">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    color: "white",
                    fontSize: "1.25rem",
                    backgroundColor: "#2c3e50",
                  }}
                >
                  <FaShoppingCart />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{stats.totalVentas}</h3>
                  <p className="text-muted mb-0">Ventas Totales</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xl={3}>
            <Card className="mb-4">
              <Card.Body className="d-flex align-items-center">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    color: "white",
                    fontSize: "1.25rem",
                    backgroundColor: "#2ecc71",
                  }}
                >
                  <FaUsers />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{stats.totalClientes}</h3>
                  <p className="text-muted mb-0">Clientes</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xl={3}>
            <Card className="mb-4">
              <Card.Body className="d-flex align-items-center">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    color: "white",
                    fontSize: "1.25rem",
                    backgroundColor: "#f39c12",
                  }}
                >
                  <FaBox />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">{stats.totalProductos}</h3>
                  <p className="text-muted mb-0">Productos</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} xl={3}>
            <Card className="mb-4">
              <Card.Body className="d-flex align-items-center">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    color: "white",
                    fontSize: "1.25rem",
                    backgroundColor: "#e74c3c",
                  }}
                >
                  <FaMoneyBillWave />
                </div>
                <div>
                  <h3 className="mb-0 fs-4">${stats.ingresosMes.toLocaleString()}</h3>
                  <p className="text-muted mb-0">Ingresos del Mes</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>Información del Sistema</Card.Header>
              <Card.Body>
                <p>
                  Bienvenido al Sistema de Ventas. Utilice el menú lateral para navegar por las diferentes secciones.
                </p>
                <ul>
                  <li>Gestione productos y categorías</li>
                  <li>Administre clientes</li>
                  <li>Registre ventas</li>
                  <li>Controle el inventario</li>
                  <li>Visualice reportes</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}
