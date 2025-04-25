"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Row, Col, Alert } from "react-bootstrap"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FaArrowLeft, FaFileInvoice, FaTrash, FaShoppingCart } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./SalesDetail.css"

const SalesDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [venta, setVenta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/ventas/${id}`)
        setVenta(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los detalles de la venta")
        setLoading(false)
        console.error("Error al cargar detalles de venta:", err)
      }
    }

    fetchVenta()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de eliminar esta venta? Esta acción no se puede deshacer.")) {
      try {
        await axios.delete(`/ventas/${id}`)
        navigate("/ventas")
      } catch (err) {
        setError("Error al eliminar la venta")
        console.error("Error al eliminar venta:", err)
      }
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      window.open(`/api/ventas/${id}/factura`, "_blank")
    } catch (err) {
      setError("Error al generar la factura")
      console.error("Error al generar factura:", err)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!venta) {
    return (
      <Alert variant="danger">
        No se encontró la venta solicitada.
        <Button as={Link} to="/ventas" variant="link">
          Volver a la lista de ventas
        </Button>
      </Alert>
    )
  }

  return (
    <div className="sales-detail">
      <PageHeader
        title={`Venta #${venta.numeroFactura}`}
        subtitle={`Detalles de la venta realizada el ${formatDate(venta.fecha)}`}
        icon={FaShoppingCart}
      />

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-3">
        <Button as={Link} to="/ventas" variant="outline-secondary" className="me-2">
          <FaArrowLeft className="me-2" /> Volver a Ventas
        </Button>
        <Button variant="outline-primary" onClick={handleGenerateInvoice} className="me-2">
          <FaFileInvoice className="me-2" /> Generar Factura
        </Button>
        <Button variant="outline-danger" onClick={handleDelete}>
          <FaTrash className="me-2" /> Eliminar Venta
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Información de la Venta</Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <th>Número de Factura:</th>
                    <td>{venta.numeroFactura}</td>
                  </tr>
                  <tr>
                    <th>Fecha:</th>
                    <td>{formatDate(venta.fecha)}</td>
                  </tr>
                  <tr>
                    <th>Cliente:</th>
                    <td>{venta.clienteNombre}</td>
                  </tr>
                  <tr>
                    <th>Vendedor:</th>
                    <td>{venta.usuarioNombre}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Resumen</Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <th>Subtotal:</th>
                    <td>${venta.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Impuesto (10%):</th>
                    <td>${venta.impuesto.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Total:</th>
                    <td className="fw-bold">${venta.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>Detalle de Productos</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.productoNombre}</td>
                    <td>${detalle.precioUnitario.toFixed(2)}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${detalle.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">
                    Subtotal:
                  </td>
                  <td>${venta.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">
                    Impuesto (10%):
                  </td>
                  <td>${venta.impuesto.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">
                    Total:
                  </td>
                  <td className="fw-bold">${venta.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default SalesDetail
