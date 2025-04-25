"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap"
import Link from "next/link"
import { FaSearch, FaEye, FaTrash, FaFileInvoice, FaPlus } from "react-icons/fa"
import Layout from "@/components/Layout"

export default function SalesList() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true)

        // En un caso real, esta sería una llamada a tu API
        // Por ahora usamos datos de ejemplo
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockVentas = [
          {
            id: 1,
            numeroFactura: "F20230515000001",
            fecha: "2023-05-15T10:30:00",
            clienteNombre: "Juan Pérez",
            total: 1500.0,
            usuarioNombre: "Admin Sistema",
          },
          {
            id: 2,
            numeroFactura: "F20230516000002",
            fecha: "2023-05-16T11:45:00",
            clienteNombre: "María González",
            total: 850.5,
            usuarioNombre: "Juan Pérez",
          },
          {
            id: 3,
            numeroFactura: "F20230517000003",
            fecha: "2023-05-17T14:20:00",
            clienteNombre: "Carlos López",
            total: 2300.75,
            usuarioNombre: "Admin Sistema",
          },
          {
            id: 4,
            numeroFactura: "F20230518000004",
            fecha: "2023-05-18T09:15:00",
            clienteNombre: "Ana Martínez",
            total: 450.25,
            usuarioNombre: "Juan Pérez",
          },
          {
            id: 5,
            numeroFactura: "F20230519000005",
            fecha: "2023-05-19T16:30:00",
            clienteNombre: "Pedro Rodríguez",
            total: 1200.0,
            usuarioNombre: "Admin Sistema",
          },
        ]

        setVentas(mockVentas)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar las ventas")
        setLoading(false)
        console.error("Error al cargar ventas:", err)
      }
    }

    fetchVentas()
  }, [])

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar esta venta? Esta acción no se puede deshacer.")) {
      // En un caso real, esta sería una llamada a tu API
      setVentas(ventas.filter((venta) => venta.id !== id))
    }
  }

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target
    setDateFilter({
      ...dateFilter,
      [name]: value,
    })
  }

  const handleGenerateInvoice = (id) => {
    // En un caso real, esta sería una llamada a tu API para generar la factura
    alert(`Generando factura para la venta #${id}`)
  }

  const filteredVentas = ventas.filter((venta) => {
    // Filtro por término de búsqueda (número de factura o cliente)
    const matchesSearch =
      venta.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por fecha
    let matchesDate = true
    if (dateFilter.startDate && dateFilter.endDate) {
      const ventaDate = new Date(venta.fecha)
      const startDate = new Date(dateFilter.startDate)
      const endDate = new Date(dateFilter.endDate)
      endDate.setHours(23, 59, 59) // Incluir todo el día final
      matchesDate = ventaDate >= startDate && ventaDate <= endDate
    }

    return matchesSearch && matchesDate
  })

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Layout>
      <div className="sales-list">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Ventas</h1>
            <p className="text-muted">Gestión de ventas</p>
          </div>
          <Button as={Link} href="/ventas/nueva" variant="primary">
            <FaPlus className="me-2" /> Nueva Venta
          </Button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar por factura o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Desde</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={dateFilter.startDate}
                        onChange={handleDateFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Hasta</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={dateFilter.endDate}
                        onChange={handleDateFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      onClick={() => setDateFilter({ startDate: "", endDate: "" })}
                    >
                      Limpiar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Factura</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Vendedor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : filteredVentas.length > 0 ? (
                    filteredVentas.map((venta) => (
                      <tr key={venta.id}>
                        <td>{venta.numeroFactura}</td>
                        <td>{formatDate(venta.fecha)}</td>
                        <td>{venta.clienteNombre}</td>
                        <td>${venta.total.toFixed(2)}</td>
                        <td>{venta.usuarioNombre}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Button
                              as={Link}
                              href={`/ventas/${venta.id}`}
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-2"
                              onClick={() => handleGenerateInvoice(venta.id)}
                            >
                              <FaFileInvoice />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(venta.id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No se encontraron ventas
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  )
}
