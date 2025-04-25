"use client"

import { useState, useEffect } from "react"
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { FaBox, FaSave, FaTimes } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    stockMinimo: "",
    codigoBarras: "",
    categoriaId: "",
  })

  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("/categorias")
        setCategorias(response.data)
      } catch (err) {
        setError("Error al cargar las categorías")
        console.error("Error al cargar categorías:", err)
      }
    }

    const fetchProducto = async () => {
      if (isEditing) {
        try {
          setLoading(true)
          const response = await axios.get(`/productos/${id}`)
          setProducto(response.data)
          setLoading(false)
        } catch (err) {
          setError("Error al cargar el producto")
          setLoading(false)
          console.error("Error al cargar producto:", err)
        }
      }
    }

    fetchCategorias()
    fetchProducto()
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProducto((prevProducto) => ({
      ...prevProducto,
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

      // Convertir valores numéricos
      const productoData = {
        ...producto,
        precio: Number.parseFloat(producto.precio),
        stock: Number.parseInt(producto.stock),
        stockMinimo: Number.parseInt(producto.stockMinimo),
        categoriaId: Number.parseInt(producto.categoriaId),
      }

      if (isEditing) {
        await axios.put(`/productos/${id}`, productoData)
      } else {
        await axios.post("/productos", productoData)
      }

      setSaving(false)
      navigate("/productos")
    } catch (err) {
      setSaving(false)
      setError("Error al guardar el producto")
      console.error("Error al guardar producto:", err)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="product-form">
      <PageHeader
        title={isEditing ? "Editar Producto" : "Nuevo Producto"}
        subtitle={isEditing ? "Modificar información del producto" : "Crear un nuevo producto"}
        icon={FaBox}
      />

      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name="nombre" value={producto.nombre} onChange={handleChange} required />
                  <Form.Control.Feedback type="invalid">El nombre es obligatorio</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select name="categoriaId" value={producto.categoriaId} onChange={handleChange} required>
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">La categoría es obligatoria</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={producto.descripcion || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="precio"
                    value={producto.precio}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    El precio es obligatorio y debe ser mayor o igual a 0
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="stock"
                    value={producto.stock}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    El stock es obligatorio y debe ser mayor o igual a 0
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="stockMinimo"
                    value={producto.stockMinimo || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Código de Barras</Form.Label>
              <Form.Control
                type="text"
                name="codigoBarras"
                value={producto.codigoBarras || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/productos")}>
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

export default ProductForm
