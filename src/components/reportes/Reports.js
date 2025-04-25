"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Form, Button } from "react-bootstrap"
import { FaChartBar, FaDownload } from "react-icons/fa"
import { Bar, Line, Pie } from "react-chartjs-2"
import { Chart as ChartJS, registerables } from "chart.js"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./Reports.css"

// Registrar componentes de Chart.js
ChartJS.register(...registerables)

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reportType, setReportType] = useState("ventas-por-mes")
  const [year, setYear] = useState(new Date().getFullYear())
  const [chartData, setChartData] = useState(null)

  // Datos para los selectores
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true)

        // En un caso real, estas serían llamadas a tu API
        // Por ahora usamos datos de ejemplo

        // Simular carga de datos
        await new Promise((resolve) => setTimeout(resolve, 500))

        let data = {}

        switch (reportType) {
          case "ventas-por-mes":
            data = {
              labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
              datasets: [
                {
                  label: `Ventas ${year}`,
                  data: [12500, 15800, 14200, 16500, 18200, 15680, 17500, 16800, 19200, 20500, 18200, 22000],
                  backgroundColor: "rgba(52, 152, 219, 0.5)",
                  borderColor: "rgba(52, 152, 219, 1)",
                  borderWidth: 1,
                },
              ],
            }
            break
          case "productos-mas-vendidos":
            data = {
              labels: ["Laptop HP", "Monitor LG", "Teclado Logitech", "Mouse Gamer", "Impresora Epson"],
              datasets: [
                {
                  label: "Unidades vendidas",
                  data: [42, 38, 27, 22, 19],
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
            break
          case "ventas-por-categoria":
            data = {
              labels: ["Electrónicos", "Ropa", "Hogar", "Alimentos", "Bebidas"],
              datasets: [
                {
                  data: [45, 25, 15, 10, 5],
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
            break
          case "stock-por-categoria":
            data = {
              labels: ["Electrónicos", "Ropa", "Hogar", "Alimentos", "Bebidas"],
              datasets: [
                {
                  label: "Stock disponible",
                  data: [120, 85, 65, 45, 30],
                  backgroundColor: "rgba(46, 204, 113, 0.5)",
                  borderColor: "rgba(46, 204, 113, 1)",
                  borderWidth: 1,
                },
              ],
            }
            break
          default:
            data = {}
        }

        setChartData(data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los datos del reporte")
        setLoading(false)
        console.error("Error al cargar datos del reporte:", err)
      }
    }

    fetchReportData()
  }, [reportType, year])

  const handleExportPDF = () => {
    // En un caso real, aquí se implementaría la exportación a PDF
    alert("Exportación a PDF no implementada en esta versión")
  }

  const handleExportExcel = () => {
    // En un caso real, aquí se implementaría la exportación a Excel
    alert("Exportación a Excel no implementada en esta versión")
  }

  const renderChart = () => {
    if (!chartData) return null

    switch (reportType) {
      case "ventas-por-mes":
        return <Line data={chartData} options={{ maintainAspectRatio: false, height: 300 }} />
      case "productos-mas-vendidos":
        return <Bar data={chartData} options={{ maintainAspectRatio: false, height: 300 }} />
      case "ventas-por-categoria":
        return <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      case "stock-por-categoria":
        return <Bar data={chartData} options={{ maintainAspectRatio: false, height: 300 }} />
      default:
        return null
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="reports">
      <PageHeader title="Reportes" subtitle="Visualización de datos y estadísticas" icon={FaChartBar} />

      {error && <div className="alert alert-danger">{error}</div>}

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tipo de Reporte</Form.Label>
                <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="ventas-por-mes">Ventas por Mes</option>
                  <option value="productos-mas-vendidos">Productos Más Vendidos</option>
                  <option value="ventas-por-categoria">Ventas por Categoría</option>
                  <option value="stock-por-categoria">Stock por Categoría</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Año</Form.Label>
                <Form.Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end justify-content-end">
              <Button variant="outline-secondary" className="me-2" onClick={handleExportPDF}>
                <FaDownload className="me-1" /> PDF
              </Button>
              <Button variant="outline-secondary" onClick={handleExportExcel}>
                <FaDownload className="me-1" /> Excel
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          {reportType === "ventas-por-mes" && `Ventas Mensuales - ${year}`}
          {reportType === "productos-mas-vendidos" && "Productos Más Vendidos"}
          {reportType === "ventas-por-categoria" && "Distribución de Ventas por Categoría"}
          {reportType === "stock-por-categoria" && "Stock Disponible por Categoría"}
        </Card.Header>
        <Card.Body>
          <div className="chart-container">{renderChart()}</div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Reports
