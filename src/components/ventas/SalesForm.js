"use client"

import { useState, useEffect, useContext } from "react"
import { Card, Form, Button, Row, Col, Table, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FaShoppingCart, FaPlus, FaTrash, FaSave, FaTimes } from "react-icons/fa"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./SalesForm.css"

const SalesForm = () => {
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext)

  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [venta, setVenta] = useState({
    clienteId: "",
    detalles: [],
  })

  const [nuevoDetalle, setNuevoDetalle] = useState({
    productoId: "",
    cantidad: 1,
  })

  const [subtotal, setSubtotal] = useState(0)
  const [impuesto, setImpuesto] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Cargar clientes
        const clientesResponse = await axios.get("/clientes")
        setClientes(clientesResponse.data)

        // Cargar productos
        const productosResponse = await axios.get("/productos")
        setProductos(productosResponse.data)

        setLoading(false)
      } catch (err) {
        setError("Error al cargar los datos")
        setLoading(false)
        console.error("Error al cargar datos:", err)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Calcular totales
    const calcularTotales = () => {
      const subtotalValue = venta.detalles.reduce((acc, detalle) => {
        const producto = productos.find((p) => p.id === Number.parseInt(detalle.productoId))
        if (producto) {
          return acc + producto.precio * detalle.cantidad
        }
        return acc
      }, 0)

      const impuestoValue = subtotalValue * 0.1 // 10% de impuesto
      const totalValue = subtotalValue + impuestoValue

      setSubtotal(subtotalValue)
      setImpuesto(impuestoValue)
      setTotal(totalValue)
    }

    calcularTotales()
  }, [venta.detalles, productos])

  const handleClienteChange = (e) => {
    setVenta({
      ...venta,
      clienteId: e.target.value,
    })
  }

  const handleProductoChange = (e) => {
    setNuevoDetalle({
      ...nuevoDetalle,
      productoId: e.target.value,
    })
  }

  const handleCantidadChange = (e) => {
    setNuevoDetalle({
      ...nuevoDetalle,
      cantidad: Number.parseInt(e.target.value),
    })
  }

  const agregarProducto = () => {
    if (!nuevoDetalle.productoId || nuevoDetalle.cantidad <= 0) {
      return
    }

    // Verificar si el producto ya está en la lista
    const index = venta.detalles.findIndex((detalle) => detalle.productoId === nuevoDetalle.productoId)

    if (index !== -1) {
      // Actualizar cantidad si ya existe
      const nuevosDetalles = [...venta.detalles]
      nuevosDetalles[index].cantidad += nuevoDetalle.cantidad

      setVenta({
        ...venta,
        detalles: nuevosDetalles,
      })
    } else {
      // Agregar nuevo detalle
      setVenta({
        ...venta,
        detalles: [...venta.detalles, { ...nuevoDetalle }],
      })
    }

    // Resetear el formulario de nuevo detalle
    setNuevoDetalle({
      productoId: "",
      cantidad: 1,
    })
  }

  const eliminarProducto = (index) => {
    const nuevosDetalles = venta.detalles.filter((_, i) => i !== index)
    setVenta({
      ...venta,
      detalles: nuevosDetalles,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!venta.clienteId) {
      setError("Debe seleccionar un cliente")
      return
    }

    if (venta.detalles.length === 0) {
      setError("Debe agregar al menos un producto")
      return
    }

    try {
      setSaving(true)

      const response = await axios.post("/ventas", venta)

      setSaving(false)
      navigate(`/ventas/${response.data.id}`)
    } catch (err) {
      setSaving(false)
      setError("Error al guardar la venta")
      console.error("Error al guardar venta:", err)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="sales-form">
      <PageHeader title="Nueva Venta" subtitle="Registrar una nueva venta" icon={FaShoppingCart} />

      <Card className="mb-4">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cliente</Form.Label>
                  <Form.Select value={venta.clienteId} onChange={handleClienteChange} required>
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - {cliente.documento}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vendedor</Form.Label>
                  <Form.Control
                    type="text"
                    value={`${currentUser?.nombre || ""} ${currentUser?.apellido || ""}`}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Card className="mb-4">
              <Card.Header>Agregar Productos</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Producto</Form.Label>
                      <Form.Select value={nuevoDetalle.productoId} onChange={handleProductoChange}>
                        <option value="">Seleccione un producto</option>
                        {productos.map((producto) => (
                          <option key={producto.id} value={producto.id} disabled={producto.stock <= 0}>
                            {producto.nombre} - ${producto.precio.toFixed(2)} - Stock: {producto.stock}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Cantidad</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={nuevoDetalle.cantidad}
                        onChange={handleCantidadChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <Button
                      variant="success"
                      onClick={agregarProducto}
                      className="w-100"
                      disabled={!nuevoDetalle.productoId || nuevoDetalle.cantidad <= 0}
                    >
                      <FaPlus className="me-2" /> Agregar
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header>Detalle de Venta</Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venta.detalles.length > 0 ? (
                        venta.detalles.map((detalle, index) => {
                          const producto = productos.find((p) => p.id === Number.parseInt(detalle.productoId))
                          return (
                            <tr key={index}>
                              <td>{producto?.nombre}</td>
                              <td>${producto?.precio.toFixed(2)}</td>
                              <td>{detalle.cantidad}</td>
                              <td>${(producto?.precio * detalle.cantidad).toFixed(2)}</td>
                              <td>
                                <Button variant="outline-danger" size="sm" onClick={() => eliminarProducto(index)}>
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No hay productos agregados
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">
                          Subtotal:
                        </td>
                        <td colSpan="2">${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">
                          Impuesto (10%):
                        </td>
                        <td colSpan="2">${impuesto.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">
                          Total:
                        </td>
                        <td colSpan="2" className="fw-bold">
                          ${total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/ventas")}>
                <FaTimes className="me-2" /> Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={saving || venta.detalles.length === 0}>
                <FaSave className="me-2" /> {saving ? "Guardando..." : "Guardar Venta"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default SalesForm
