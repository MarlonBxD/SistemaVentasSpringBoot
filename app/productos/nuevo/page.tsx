"use client"

import { useEffect, useState } from "react"
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap"
import { FaSave, FaArrowLeft } from "react-icons/fa"
import Link from "next/link"

export default function NuevoProductoPage() {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [stock, setStock] = useState("")
  const [stockMinimo, setStockMinimo] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [categorias, setCategorias] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token")
  
        const res = await fetch("http://localhost:8080/api/categorias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  
        if (!res.ok) throw new Error("Error al cargar categorías")
        const data = await res.json()
        setCategorias(data)
      } catch (err) {
        setError("No se pudieron cargar las categorías")
        console.error("Error al cargar categorías:", err)
      }
    }
  
    fetchCategorias()
  }, [])
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setExito(null)

    const nuevoProducto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      stockMinimo: parseInt(stockMinimo),
      categoriaId: parseInt(categoriaId),
    }

    try {
        const token = localStorage.getItem("token")
      
        const res = await fetch("http://localhost:8080/api/productos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevoProducto),
        })
      
        if (!res.ok) throw new Error("No se pudo crear el producto")
      
        setExito("Producto creado exitosamente")
        setNombre("")
        setDescripcion("")
        setPrecio("")
        setStock("")
        setStockMinimo("")
        setCategoriaId("")
      } catch (err) {
        setError("Error al crear el producto")
      }
  }

  return (
    <div className="nuevo-producto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Nuevo Producto</h1>
          <p className="text-muted">Registrar un nuevo producto en el sistema</p>
        </div>
        <Button as={Link} href="/productos" variant="secondary">
          <FaArrowLeft className="me-2" /> Volver
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="descripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="precio">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="stock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="stockMinimo">
                  <Form.Label>Stock Mínimo</Form.Label>
                  <Form.Control type="number" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="categoriaId">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                <FaSave className="me-2" />
                Guardar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}
