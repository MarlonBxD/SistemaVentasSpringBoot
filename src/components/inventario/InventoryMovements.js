"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col, Badge } from "react-bootstrap"
import { FaSearch, FaPlus, FaWarehouse } from "react-icons/fa"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import InventoryMovementModal from "./InventoryMovementModal"
import "./InventoryMovements.css"

const InventoryMovements = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // En un caso real, estas serían llamadas a tu API
        // Por ahora usamos datos de ejemplo
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Datos de ejemplo para movimientos
        const mockMovements = [
          {
            id: 1,
            productoId: 1,
            productoNombre: "Laptop HP",
            fecha: "2023-05-15T10:30:00",
            tipo: "ENTRADA",
            cantidad: 10,
            descripcion: "Compra inicial",
            usuarioNombre: "Admin Sistema",
          },
          {
            id: 2,
            productoId: 2,
            productoNombre: "Monitor LG",
            fecha: "2023-05-16T11:45:00",
            tipo: "ENTRADA",
            cantidad: 15,
            descripcion: "Reposición de stock",
            usuarioNombre: "Admin Sistema",
          },
          {
            id: 3,
            productoId: 1,
            productoNombre: "Laptop HP",
            fecha: "2023-05-17T14:20:00",
            tipo: "SALIDA",
            cantidad: 2,
            descripcion: "Venta #F20230517000001",
            usuarioNombre: "Juan Pérez",
          },
          {
            id: 4,
            productoId: 3,
            productoNombre: "Teclado Logitech",
            fecha: "2023-05-18T09:15:00",
            tipo: "ENTRADA",
            cantidad: 20,
            descripcion: "Nuevo proveedor",
            usuarioNombre: "Admin Sistema",
          },
          {
            id: 5,
            productoId: 3,
            productoNombre: "Teclado Logitech",
            fecha: "2023-05-19T16:30:00",
            tipo: "AJUSTE",
            cantidad: 2,
            descripcion: "Productos defectuosos",
            usuarioNombre: "Admin Sistema",
          },
        ]

        // Datos de ejemplo para productos
        const mockProductos = [
          { id: 1, nombre: "Laptop HP", stock: 8 },
          { id: 2, nombre: "Monitor LG", stock: 15 },
          { id: 3, nombre: "Teclado Logitech", stock: 18 },
          { id: 4, nombre: "Mouse Gamer", stock: 12 },
          { id: 5, nombre: "Impresora Epson", stock: 5 },
        ]

        setMovements(mockMovements)
        setProductos(mockProductos)
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

  const handleAddMovement = async (movementData) => {
    try {
      // En un caso real, esta sería una llamada a tu API
      // const response = await axios.post("/inventario", movementData)

      // Simulamos la respuesta
      const newMovement = {
        id: movements.length + 1,
        productoId: movementData.productoId,
        productoNombre: productos.find((p) => p.id === movementData.productoId)?.nombre || "Producto",
        fecha: new Date().toISOString(),
        tipo: movementData.tipo,
        cantidad: movementData.cantidad,
        descripcion: movementData.descripcion,
        usuarioNombre: "Usuario Actual",
      }

      setMovements([newMovement, ...movements])
      setShowModal(false)
    } catch (err) {
      setError("Error al registrar el movimiento")
      console.error("Error al registrar movimiento:", err)
    }
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

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="inventory-movements">
      <PageHeader
        title="Movimientos de Inventario"
        subtitle="Gestión de entradas, salidas y ajustes de inventario"
        icon={FaWarehouse}
      />

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
                {filteredMovements.length > 0 ? (
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

      <InventoryMovementModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleAddMovement}
        productos={productos}
      />
    </div>
  )
}

export default InventoryMovements
