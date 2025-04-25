"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { FaShoppingCart, FaUsers, FaBox, FaMoneyBillWave } from "react-icons/fa"
import { Line, Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, registerables } from "chart.js"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./Dashboard.css"

// Registrar componentes de Chart.js
ChartJS.register(...registerables)

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalClientes: 0,
    totalProductos: 0,
    ingresosMes: 0,
  })
  const [ventasPorMes, setVentasPorMes] = useState({
    labels: [],
    data: [],
  })
  const [productosMasVendidos, setProductosMasVendidos] = useState({
    labels: [],
    data: [],
  })
  const [ventasPorCategoria, setVentasPorCategoria] = useState({
    labels: [],
    data: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // En un caso real, estas serían llamadas a tu API
        // Por ahora usamos datos de ejemplo

        // Simular carga de datos
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Estadísticas generales
        setStats({
          totalVentas: 156,
          totalClientes: 48,
          totalProductos: 124,
          ingresosMes: 15680.5,
        })

        // Ventas por mes
        setVentasPorMes({
          labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
          data: [12500, 15800, 14200, 16500, 18200, 15680],
        })

        // Productos más vendidos
        setProductosMasVendidos({
          labels: ["Laptop HP", "Monitor LG", "Teclado Logitech", "Mouse Gamer", "Impresora Epson"],
          data: [42, 38, 27, 22, 19],
        })

        // Ventas por categoría
        setVentasPorCategoria({
          labels: ["Electrónicos", "Ropa", "Hogar", "Alimentos", "Bebidas"],
          data: [45, 25, 15, 10, 5],
        })

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  // Configuración de gráficos
  const ventasPorMesConfig = {
    labels: ventasPorMes.labels,
    datasets: [
      {
        label: "Ventas ($)",
        data: ventasPorMes.data,
        fill: false,
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderColor: "rgba(52, 152, 219, 1)",
        tension: 0.4,
      },
    ],
  }

  const productosMasVendidosConfig = {
    labels: productosMasVendidos.labels,
    datasets: [
      {
        label: "Unidades vendidas",
        data: productosMasVendidos.data,
        backgroundColor: [
          "rgba(52, 152, 219, 0.7)",
          "rgba(46, 204, 113, 0.7)",
          "rgba(155, 89, 182, 0.7)",
          "rgba(241, 196, 15, 0.7)",
          "rgba(230, 126, 34, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const ventasPorCategoriaConfig = {
    labels: ventasPorCategoria.labels,
    datasets: [
      {
        data: ventasPorCategoria.data,
        backgroundColor: [
          "rgba(52, 152, 219, 0.7)",
          "rgba(46, 204, 113, 0.7)",
          "rgba(155, 89, 182, 0.7)",
          "rgba(241, 196, 15, 0.7)",
          "rgba(230, 126, 34, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="dashboard">
      <PageHeader title="Dashboard" subtitle="Resumen general del sistema" />

      {/* Tarjetas de estadísticas */}
      <Row className="stats-cards">
        <Col md={6} xl={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon bg-primary">
                <FaShoppingCart />
              </div>
              <div className="stat-details">
                <h3 className="stat-value">{stats.totalVentas}</h3>
                <p className="stat-label">Ventas Totales</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon bg-success">
                <FaUsers />
              </div>
              <div className="stat-details">
                <h3 className="stat-value">{stats.totalClientes}</h3>
                <p className="stat-label">Clientes</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon bg-warning">
                <FaBox />
              </div>
              <div className="stat-details">
                <h3 className="stat-value">{stats.totalProductos}</h3>
                <p className="stat-label">Productos</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon bg-danger">
                <FaMoneyBillWave />
              </div>
              <div className="stat-details">
                <h3 className="stat-value">${stats.ingresosMes.toLocaleString()}</h3>
                <p className="stat-label">Ingresos del Mes</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="mt-4">
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>Ventas de los últimos 6 meses</Card.Header>
            <Card.Body>
              <Line data={ventasPorMesConfig} options={{ maintainAspectRatio: false, height: 300 }} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>Ventas por Categoría</Card.Header>
            <Card.Body>
              <Pie data={ventasPorCategoriaConfig} options={{ maintainAspectRatio: false }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>Productos más vendidos</Card.Header>
            <Card.Body>
              <Bar data={productosMasVendidosConfig} options={{ maintainAspectRatio: false, height: 300 }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
