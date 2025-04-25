"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Badge, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaSearch, FaEdit, FaTrash, FaUserCog } from "react-icons/fa"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./UserList.css"

const UserList = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true)
        // En un caso real, esta sería una llamada a tu API
        // Por ahora usamos datos de ejemplo
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockUsuarios = [
          {
            id: 1,
            nombre: "Admin",
            apellido: "Sistema",
            username: "admin",
            email: "admin@sistema.com",
            activo: true,
            roles: ["ADMIN"],
          },
          {
            id: 2,
            nombre: "Juan",
            apellido: "Pérez",
            username: "jperez",
            email: "jperez@sistema.com",
            activo: true,
            roles: ["VENDEDOR"],
          },
          {
            id: 3,
            nombre: "María",
            apellido: "González",
            username: "mgonzalez",
            email: "mgonzalez@sistema.com",
            activo: true,
            roles: ["VENDEDOR", "ADMIN"],
          },
          {
            id: 4,
            nombre: "Carlos",
            apellido: "López",
            username: "clopez",
            email: "clopez@sistema.com",
            activo: false,
            roles: ["VENDEDOR"],
          },
        ]

        setUsuarios(mockUsuarios)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los usuarios")
        setLoading(false)
        console.error("Error al cargar usuarios:", err)
      }
    }

    fetchUsuarios()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        // En un caso real, esta sería una llamada a tu API
        // await axios.delete(`/usuarios/${id}`)
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id))
      } catch (err) {
        setError("Error al eliminar el usuario")
        console.error("Error al eliminar usuario:", err)
      }
    }
  }

  const handleToggleActive = async (id, currentStatus) => {
    try {
      // En un caso real, esta sería una llamada a tu API
      // await axios.patch(`/usuarios/${id}`, { activo: !currentStatus })
      setUsuarios(usuarios.map((usuario) => (usuario.id === id ? { ...usuario, activo: !currentStatus } : usuario)))
    } catch (err) {
      setError("Error al actualizar el estado del usuario")
      console.error("Error al actualizar estado del usuario:", err)
    }
  }

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="user-list">
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de usuarios del sistema"
        buttonText="Nuevo Usuario"
        buttonLink="/usuarios/nuevo"
        icon={FaUserCog}
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
                  placeholder="Buscar usuarios..."
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
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{`${usuario.nombre} ${usuario.apellido}`}</td>
                      <td>{usuario.username}</td>
                      <td>{usuario.email}</td>
                      <td>
                        {usuario.roles.map((rol) => (
                          <Badge key={rol} bg={rol === "ADMIN" ? "danger" : "info"} className="me-1">
                            {rol}
                          </Badge>
                        ))}
                      </td>
                      <td>
                        <Badge bg={usuario.activo ? "success" : "secondary"}>
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td>
                        <div className="actions">
                          <Button
                            as={Link}
                            to={`/usuarios/editar/${usuario.id}`}
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant={usuario.activo ? "outline-warning" : "outline-success"}
                            size="sm"
                            className="me-2"
                            onClick={() => handleToggleActive(usuario.id, usuario.activo)}
                          >
                            {usuario.activo ? "Desactivar" : "Activar"}
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(usuario.id)}>
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No se encontraron usuarios
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

export default UserList
