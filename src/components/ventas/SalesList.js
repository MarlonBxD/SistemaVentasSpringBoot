"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaSearch, FaEye, FaTrash, FaShoppingCart, FaFileInvoice } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./SalesList.css"

const SalesList = () => {
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
        const response = await axios.get("/ventas")
        setVentas(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar las ventas")
        setLoading(false)
        console.error("Error al cargar ventas:", err)
      }
    }

    fetchVentas()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta venta? Esta acción no se puede deshacer.")) {
      try {
        await axios.delete(`/ventas/${id}`)
        setVentas(ventas.filter((venta) => venta.id !== id))
      } catch (err) {
        setError("Error al eliminar la venta")
        console.error("Error al eliminar venta:", err)
      }
    }
  }

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target
    setDateFilter({
      ...dateFilter,
      [name]: value,
    })
  }

  const handleGenerateInvoice = async (id) => {
    try {
      window.open(`/api/ventas/${id}/factura`, "_blank")
    } catch (err) {
      setError("Error al generar la factura")
      console.error("Error al generar factura:", err)
    }
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

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="sales-list">
      <PageHeader
        title="Ventas"
        subtitle="Gestión de ventas"
        buttonText="Nueva Venta"
        buttonLink="/ventas/nueva"
        icon={FaShoppingCart}
      />

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
                {filteredVentas.length > 0 ? (
                  filteredVentas.map((venta) => (
                    <tr key={venta.id}>
                      <td>{venta.numeroFactura}</td>
                      <td>{formatDate(venta.fecha)}</td>
                      <td>{venta.clienteNombre}</td>
                      <td>${venta.total.toFixed(2)}</td>
                      <td>{venta.usuarioNombre}</td>
                      <td>
                        <div className="actions">
                          <Button
                            as={Link}
                            to={`/ventas/${venta.id}`}
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
  )
}

export default SalesList
