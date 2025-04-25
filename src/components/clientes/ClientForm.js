"use client"

import { useState, useEffect } from "react"
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { FaUsers, FaSave, FaTimes } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"

const ClientForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    tipoDocumento: "CI",
    direccion: "",
    telefono: "",
    email: "",
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    const fetchCliente = async () => {
      if (isEditing) {
        try {
          setLoading(true)
          const response = await axios.get(`/clientes/${id}`)
          setCliente(response.data)
          setLoading(false)
        } catch (err) {
          setError("Error al cargar el cliente")
          setLoading(false)
          console.error("Error al cargar cliente:", err)
        }
      }
    }

    fetchCliente()
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCliente((prevCliente) => ({
      ...prevCliente,
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
        await axios.put(`/clientes/${id}`, cliente)
      } else {
        await axios.post("/clientes", cliente)
      }

      setSaving(false)
      navigate("/clientes")
    } catch (err) {
      setSaving(false)
      setError("Error al guardar el cliente")
      console.error("Error al guardar cliente:", err)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="client-form">
      <PageHeader
        title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        subtitle={isEditing ? "Modificar información del cliente" : "Registrar un nuevo cliente"}
        icon={FaUsers}
      />

      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                  <Form.Control.Feedback type="invalid">El nombre es obligatorio</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={cliente.apellido}
                    onChange={handleChange}
                    required
                    maxLength={50}
                  />
                  <Form.Control.Feedback type="invalid">El apellido es obligatorio</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Documento</Form.Label>
                  <Form.Select name="tipoDocumento" value={cliente.tipoDocumento} onChange={handleChange}>
                    <option value="CI">Cédula de Identidad</option>
                    <option value="RUC">RUC</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="documento"
                    value={cliente.documento}
                    onChange={handleChange}
                    required
                    maxLength={20}
                  />
                  <Form.Control.Feedback type="invalid">El documento es obligatorio</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={cliente.direccion || ""}
                onChange={handleChange}
                maxLength={255}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={cliente.telefono || ""}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={cliente.email || ""}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">Ingrese un email válido</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/clientes")}>
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

export default ClientForm
