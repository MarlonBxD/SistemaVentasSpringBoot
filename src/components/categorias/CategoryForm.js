"use client"

import { useState, useEffect } from "react"
import { Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { FaTags, FaSave, FaTimes } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"

const CategoryForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [categoria, setCategoria] = useState({
    nombre: "",
    descripcion: "",
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    const fetchCategoria = async () => {
      if (isEditing) {
        try {
          setLoading(true)
          const response = await axios.get(`/categorias/${id}`)
          setCategoria(response.data)
          setLoading(false)
        } catch (err) {
          setError("Error al cargar la categoría")
          setLoading(false)
          console.error("Error al cargar categoría:", err)
        }
      }
    }

    fetchCategoria()
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCategoria((prevCategoria) => ({
      ...prevCategoria,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    try {
      setSaving(true)

      if (isEditing) {
        await axios.put(`/categorias/${id}`, categoria)
      } else {
        await axios.post("/categorias", categoria)
      }

      setSaving(false)
      navigate("/categorias")
    } catch (err) {
      setSaving(false)
      setError("Error al guardar la categoría")
      console.error("Error al guardar categoría:", err)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="category-form">
      <PageHeader
        title={isEditing ? "Editar Categoría" : "Nueva Categoría"}
        subtitle={isEditing ? "Modificar información de la categoría" : "Crear una nueva categoría"}
        icon={FaTags}
      />

      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={categoria.nombre}
                onChange={handleChange}
                required
                maxLength={50}
              />
              <Form.Control.Feedback type="invalid">El nombre es obligatorio</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={categoria.descripcion || ""}
                onChange={handleChange}
                maxLength={255}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/categorias")}>
                <FaTimes className="me-2" /> Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                <FaSave className="me-2" /> {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CategoryForm
