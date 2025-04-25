"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap"
import Link from "next/link"
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import Layout from "@/components/Layout"

export default function CategoryList() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true)
  
        const token = localStorage.getItem("token") // ← asegúrate que esto existe
  
        const response = await fetch("http://localhost:8080/api/categorias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  
        if (!response.ok) throw new Error("No se pudieron cargar las categorías")
  
        const data = await response.json()
        setCategorias(data)
      } catch (err) {
        setError("Error al cargar las categorías")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  
    fetchCategorias()
  }, [])
  
  

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar esta categoría?")) {
      // En un caso real, esta sería una llamada a tu API
      setCategorias(categorias.filter((categoria) => categoria.id !== id))
    }
  }

  const filteredCategorias = categorias.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Layout>
      <div className="category-list">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Categorías</h1>
            <p className="text-muted">Gestión de categorías de productos</p>
          </div>
          <Button as={Link} href="/categorias/nueva" variant="primary">
            <FaPlus className="me-2" /> Nueva Categoría
          </Button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <Card>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : filteredCategorias.length > 0 ? (
                    filteredCategorias.map((categoria) => (
                      <tr key={categoria.id}>
                        <td>{categoria.id}</td>
                        <td>{categoria.nombre}</td>
                        <td>{categoria.descripcion || "-"}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Button
                              as={Link}
                              href={`/categorias/editar/${categoria.id}`}
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                            >
                              <FaEdit />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(categoria.id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No se encontraron categorías
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
