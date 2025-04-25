"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Badge, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaSearch, FaEdit, FaTrash, FaBox } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./ProductList.css"

const ProductList = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("")
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/productos")
        setProductos(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los productos")
        setLoading(false)
        console.error("Error al cargar productos:", err)
      }
    }

    const fetchCategorias = async () => {
      try {
        const response = await axios.get("/categorias")
        setCategorias(response.data)
      } catch (err) {
        console.error("Error al cargar categorías:", err)
      }
    }

    fetchProductos()
    fetchCategorias()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      try {
        await axios.delete(`/productos/${id}`)
        setProductos(productos.filter((producto) => producto.id !== id))
      } catch (err) {
        setError("Error al eliminar el producto")
        console.error("Error al eliminar producto:", err)
      }
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

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="product-list">
      <PageHeader
        title="Productos"
        subtitle="Gestión de productos"
        buttonText="Nuevo Producto"
        buttonLink="/productos/nuevo"
        icon={FaBox}
      />

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
                {filteredProductos.length > 0 ? (
                  filteredProductos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoriaNombre}</td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>{producto.stock}</td>
                      <td>{getStockStatusBadge(producto.stock, producto.stockMinimo)}</td>
                      <td>
                        <div className="actions">
                          <Button
                            as={Link}
                            to={`/productos/editar/${producto.id}`}
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
  )
}

export default ProductList
