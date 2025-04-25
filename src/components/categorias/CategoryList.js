"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaSearch, FaEdit, FaTrash, FaTags } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./CategoryList.css"

const CategoryList = () => {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/categorias")
        setCategorias(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar las categorías")
        setLoading(false)
        console.error("Error al cargar categorías:", err)
      }
    }

    fetchCategorias()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta categoría?")) {
      try {
        await axios.delete(`/categorias/${id}`)
        setCategorias(categorias.filter((categoria) => categoria.id !== id))
      } catch (err) {
        setError("Error al eliminar la categoría")
        console.error("Error al eliminar categoría:", err)
      }
    }
  }

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="category-list">
      <PageHeader
        title="Categorías"
        subtitle="Gestión de categorías de productos"
        buttonText="Nueva Categoría"
        buttonLink="/categorias/nueva"
        icon={FaTags}
      />

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
                {filteredCategorias.length > 0 ? (
                  filteredCategorias.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>{categoria.id}</td>
                      <td>{categoria.nombre}</td>
                      <td>{categoria.descripcion || "-"}</td>
                      <td>
                        <div className="actions">
                          <Button
                            as={Link}
                            to={`/categorias/editar/${categoria.id}`}
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
  )
}

export default CategoryList
