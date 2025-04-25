"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Badge, Row, Col } from "react-bootstrap"
import Link from "next/link"
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import Layout from "@/components/Layout"

export default function UserList() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/api/usuarios")
      if (!response.ok) throw new Error("No se pudo cargar la lista")
  
      const data = await response.json()
      setUsuarios(data)
      setLoading(false)
    } catch (err) {
      setError("Error al cargar los usuarios")
      setLoading(false)
      console.error("Error al cargar usuarios:", err)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      // En un caso real, esta sería una llamada a tu API
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id))
    }
  }

  const handleToggleActive = (id, currentStatus) => {
    // En un caso real, esta sería una llamada a tu API
    setUsuarios(usuarios.map((usuario) => (usuario.id === id ? { ...usuario, activo: !currentStatus } : usuario)))
  }

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Layout>
      <div className="user-list">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Usuarios</h1>
            <p className="text-muted">Gestión de usuarios del sistema</p>
          </div>
          <Button as={Link} href="/usuarios/nuevo" variant="primary">
            <FaPlus className="me-2" /> Nuevo Usuario
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
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : filteredUsuarios.length > 0 ? (
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
                          <div className="d-flex justify-content-center">
                            <Button
                              as={Link}
                              href={`/usuarios/editar/${usuario.id}`}
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
    </Layout>
  )
}
