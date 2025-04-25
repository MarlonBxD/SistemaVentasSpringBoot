"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Form, Button } from "react-bootstrap"
import { FaDownload } from "react-icons/fa"
import Layout from "@/components/Layout"

export default function Reports() {
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

  return (
    <Layout>
      <div className="reports">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Reportes</h1>
            <p className="text-muted">Visualización de datos y estadísticas</p>
          </div>
        </div>

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
            <div className="text-center p-5">
              {loading ? (
                <p>Cargando datos del reporte...</p>
              ) : (
                <div>
                  <p>Visualización de gráficos no disponible en esta versión</p>
                  <p className="text-muted">
                    Los gráficos se mostrarán aquí cuando se implemente la funcionalidad completa
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  )
}
