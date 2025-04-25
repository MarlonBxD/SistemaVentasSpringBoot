"use client"

import { useState, useEffect } from "react"
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { FaUserCog, FaSave, FaTimes } from "react-icons/fa"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    username: "",
    password: "",
    email: "",
    activo: true,
    roles: ["VENDEDOR"],
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    const fetchUsuario = async () => {
      if (isEditing) {
        try {
          setLoading(true)
          // En un caso real, esta sería una llamada a tu API
          // const response = await axios.get(`/usuarios/${id}`)
          // setUsuario(response.data)

          // Por ahora usamos datos de ejemplo
          await new Promise((resolve) => setTimeout(resolve, 500))

          if (id === "1") {
            setUsuario({
              id: 1,
              nombre: "Admin",
              apellido: "Sistema",
              username: "admin",
              password: "",
              email: "admin@sistema.com",
              activo: true,
              roles: ["ADMIN"],
            })
          } else if (id === "2") {
            setUsuario({
              id: 2,
              nombre: "Juan",
              apellido: "Pérez",
              username: "jperez",
              password: "",
              email: "jperez@sistema.com",
              activo: true,
              roles: ["VENDEDOR"],
            })
          }

          setLoading(false)
        } catch (err) {
          setError("Error al cargar el usuario")
          setLoading(false)
          console.error("Error al cargar usuario:", err)
        }
      }
    }

    fetchUsuario()
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }))
  }

  const handleRoleChange = (e) => {
    const { value, checked } = e.target

    if (checked) {
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        roles: [...prevUsuario.roles, value],
      }))
    } else {
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        roles: prevUsuario.roles.filter((rol) => rol !== value),
      }))
    }
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

      // En un caso real, estas serían llamadas a tu API
      if (isEditing) {
        // await axios.put(`/usuarios/${id}`, usuario)
      } else {
        // await axios.post("/usuarios", usuario)
      }

      // Simular tiempo de guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaving(false)
      navigate("/usuarios")
    } catch (err) {
      setSaving(false)
      setError("Error al guardar el usuario")
      console.error("Error al guardar usuario:", err)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="user-form">
      <PageHeader
        title={isEditing ? "Editar Usuario" : "Nuevo Usuario"}
        subtitle={isEditing ? "Modificar información del usuario" : "Crear un nuevo usuario"}
        icon={FaUserCog}
      />

      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name="nombre" value={usuario.nombre} onChange={handleChange} required />
                  <Form.Control.Feedback type="invalid">El nombre es obligatorio</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" name="apellido" value={usuario.apellido} onChange={handleChange} required />
                  <Form.Control.Feedback type="invalid">El apellido es obligatorio</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={usuario.username}
                    onChange={handleChange}
                    required
                    disabled={isEditing}
                  />
                  <Form.Control.Feedback type="invalid">El nombre de usuario es obligatorio</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={usuario.email} onChange={handleChange} required />
                  <Form.Control.Feedback type="invalid">Ingrese un email válido</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña {isEditing && "(Dejar en blanco para mantener la actual)"}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={usuario.password}
                onChange={handleChange}
                required={!isEditing}
                minLength={6}
              />
              <Form.Control.Feedback type="invalid">
                La contraseña debe tener al menos 6 caracteres
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Roles</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  id="role-admin"
                  label="Administrador"
                  value="ADMIN"
                  checked={usuario.roles.includes("ADMIN")}
                  onChange={handleRoleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="role-vendedor"
                  label="Vendedor"
                  value="VENDEDOR"
                  checked={usuario.roles.includes("VENDEDOR")}
                  onChange={handleRoleChange}
                  className="mb-2"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label="Usuario Activo"
                name="activo"
                checked={usuario.activo}
                onChange={(e) => setUsuario({ ...usuario, activo: e.target.checked })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate("/usuarios")}>
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

export default UserForm
