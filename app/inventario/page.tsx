"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col, Badge, Modal } from "react-bootstrap"
import { FaSearch, FaPlus } from "react-icons/fa"
import Layout from "@/components/Layout"

export default function InventoryMovements() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  })
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [productos, setProductos] = useState([])
  const [newMovement, setNewMovement] = useState({
    productoId: "",
    tipo: "ENTRADA",
    cantidad: 1,
    descripcion: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
  
        // Llamadas reales a tu API
        const [movimientosRes, productosRes] = await Promise.all([
          fetch("http://localhost:8080/api/movimientos"),
          fetch("http://localhost:8080/api/productos"),
        ])
  
        if (!movimientosRes.ok || !productosRes.ok) {
          throw new Error("Error al obtener datos del servidor")
        }
  
        const movimientosData = await movimientosRes.json()
        const productosData = await productosRes.json()
  
        setMovements(movimientosData)
        setProductos(productosData)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los datos")
        setLoading(false)
        console.error("Error al cargar datos:", err)
      }
    }
  
    fetchData()
  }, [])
  

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target
    setDateFilter({
      ...dateFilter,
      [name]: value,
    })
  }

  const handleNewMovementChange = (e) => {
    const { name, value } = e.target
    setNewMovement({
      ...newMovement,
      [name]: value,
    })
  }

  const handleAddMovement = () => {
    // Validar datos
    if (!newMovement.productoId || newMovement.cantidad <= 0) {
      alert("Por favor complete todos los campos correctamente")
      return
    }

    // En un caso real, esta sería una llamada a tu API
    const producto = productos.find((p) => p.id === Number.parseInt(newMovement.productoId))

    const newMovementItem = {
      id: movements.length + 1,
      productoId: Number.parseInt(newMovement.productoId),
      productoNombre: producto ? producto.nombre : "Producto desconocido",
      fecha: new Date().toISOString(),
      tipo: newMovement.tipo,
      cantidad: Number.parseInt(newMovement.cantidad),
      descripcion: newMovement.descripcion,
      usuarioNombre: "Usuario Actual",
    }

    setMovements([newMovementItem, ...movements])
    setShowModal(false)
    setNewMovement({
      productoId: "",
      tipo: "ENTRADA",
      cantidad: 1,
      descripcion: "",
    })
  }

  const filteredMovements = movements.filter((movement) => {
    // Filtro por término de búsqueda (producto o descripción)
    const matchesSearch =
      movement.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movement.descripcion && movement.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filtro por tipo
    const matchesType = typeFilter === "" || movement.tipo === typeFilter

    // Filtro por fecha
    let matchesDate = true
    if (dateFilter.startDate && dateFilter.endDate) {
      const movementDate = new Date(movement.fecha)
      const startDate = new Date(dateFilter.startDate)
      const endDate = new Date(dateFilter.endDate)
      endDate.setHours(23, 59, 59) // Incluir todo el día final
      matchesDate = movementDate >= startDate && movementDate <= endDate
    }

    return matchesSearch && matchesType && matchesDate
  })

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getTypeBadge = (tipo) => {
    switch (tipo) {
      case "ENTRADA":
        return <Badge bg="success">Entrada</Badge>
      case "SALIDA":
        return <Badge bg="danger">Salida</Badge>
      case "AJUSTE":
        return <Badge bg="warning">Ajuste</Badge>
      default:
        return <Badge bg="secondary">{tipo}</Badge>
    }
  }

  return (
    <Layout>
      <div className="inventory-movements">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Movimientos de Inventario</h1>
            <p className="text-muted">Gestión de entradas, salidas y ajustes de inventario</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Card className="mb-4">
          <Card.Body>
            <Row className="mb-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar por producto o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="">Todos los tipos</option>
                  <option value="ENTRADA">Entradas</option>
                  <option value="SALIDA">Salidas</option>
                  <option value="AJUSTE">Ajustes</option>
                </Form.Select>
              </Col>
              <Col md={5}>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={dateFilter.startDate}
                        onChange={handleDateFilterChange}
                        placeholder="Fecha inicio"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={dateFilter.endDate}
                        onChange={handleDateFilterChange}
                        placeholder="Fecha fin"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={1}>
                <Button variant="primary" className="w-100" onClick={() => setShowModal(true)}>
                  <FaPlus />
                </Button>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Descripción</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : filteredMovements.length > 0 ? (
                    filteredMovements.map((movement) => (
                      <tr key={movement.id}>
                        <td>{formatDate(movement.fecha)}</td>
                        <td>{movement.productoNombre}</td>
                        <td>{getTypeBadge(movement.tipo)}</td>
                        <td>{movement.cantidad}</td>
                        <td>{movement.descripcion || "-"}</td>
                        <td>{movement.usuarioNombre || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No se encontraron movimientos
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Modal para agregar movimiento */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Registrar Movimiento de Inventario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Producto</Form.Label>
                <Form.Select
                  name="productoId"
                  value={newMovement.productoId}
                  onChange={handleNewMovementChange}
                  required
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - Stock actual: {producto.stock}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Movimiento</Form.Label>
                    <Form.Select name="tipo" value={newMovement.tipo} onChange={handleNewMovementChange}>
                      <option value="ENTRADA">Entrada</option>
                      <option value="SALIDA">Salida</option>
                      <option value="AJUSTE">Ajuste</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      name="cantidad"
                      value={newMovement.cantidad}
                      onChange={handleNewMovementChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={newMovement.descripcion}
                  onChange={handleNewMovementChange}
                  placeholder="Ingrese una descripción del movimiento"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddMovement}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  )
}
