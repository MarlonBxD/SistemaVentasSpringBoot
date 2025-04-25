"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Badge, Row, Col } from "react-bootstrap"
import Link from "next/link"
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import Layout from "@/components/Layout"

export default function ProductList() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("")
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
  
      const token = localStorage.getItem("token")
  
      const [productosRes, categoriasRes] = await Promise.all([
        fetch("http://localhost:8080/api/productos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://localhost:8080/api/categorias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])
  
      if (!productosRes.ok || !categoriasRes.ok) {
        throw new Error("Error al obtener datos del servidor")
      }
  
      const productosData = await productosRes.json()
      const categoriasData = await categoriasRes.json()
  
      setProductos(productosData)
      setCategorias(categoriasData)
    } catch (err) {
      setError("Error al cargar los datos")
      console.error("Error al cargar datos:", err)
    } finally {
      setLoading(false)
    }
  }
  
  

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      // En un caso real, esta sería una llamada a tu API
      setProductos(productos.filter((producto) => producto.id !== id))
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategoria = categoriaFilter === "" || producto.categoriaId.toString() === categoriaFilter

    return matchesSearch && matchesCategoria
  })

  const getStockStatusBadge = (stock, stockMinimo) => {
    if (stock === 0) {
      return <Badge bg="danger">Sin stock</Badge>
    } else if (stock <= stockMinimo) {
      return <Badge bg="warning">Stock bajo</Badge>
    } else {
      return <Badge bg="success">Disponible</Badge>
    }
  }

  return (
    <Layout>
      <div className="product-list">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Productos</h1>
            <p className="text-muted">Gestión de productos</p>
          </div>
          <Button as={Link} href="/productos/nuevo" variant="primary">
            <FaPlus className="me-2" /> Nuevo Producto
          </Button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6} lg={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} lg={3}>
                <Form.Select value={categoriaFilter} onChange={(e) => setCategoriaFilter(e.target.value)}>
                  <option value="">Todas las categorías</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : filteredProductos.length > 0 ? (
                    filteredProductos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.categoriaNombre}</td>
                        <td>${producto.precio.toFixed(2)}</td>
                        <td>{producto.stock}</td>
                        <td>{getStockStatusBadge(producto.stock, producto.stockMinimo)}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Button
                              as={Link}
                              href={`/productos/editar/${producto.id}`}
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                            >
                              <FaEdit />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(producto.id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No se encontraron productos
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
