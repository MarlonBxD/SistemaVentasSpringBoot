"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap"
import Link from "next/link"
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import Layout from "@/components/Layout"

export default function ClientList() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true)

        // En un caso real, esta sería una llamada a tu API
        // Por ahora usamos datos de ejemplo
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockClientes = [
          {
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            documento: "12345678",
            tipoDocumento: "CI",
            telefono: "0981123456",
            email: "juan.perez@example.com",
          },
          {
            id: 2,
            nombre: "María",
            apellido: "González",
            documento: "87654321",
            tipoDocumento: "CI",
            telefono: "0982234567",
            email: "maria.gonzalez@example.com",
          },
          {
            id: 3,
            nombre: "Carlos",
            apellido: "López",
            documento: "23456789",
            tipoDocumento: "RUC",
            telefono: "0983345678",
            email: "carlos.lopez@example.com",
          },
          {
            id: 4,
            nombre: "Ana",
            apellido: "Martínez",
            documento: "98765432",
            tipoDocumento: "CI",
            telefono: "0984456789",
            email: "ana.martinez@example.com",
          },
          {
            id: 5,
            nombre: "Pedro",
            apellido: "Rodríguez",
            documento: "34567890",
            tipoDocumento: "PASAPORTE",
            telefono: "0985567890",
            email: "pedro.rodriguez@example.com",
          },
        ]

        setClientes(mockClientes)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los clientes")
        setLoading(false)
        console.error("Error al cargar clientes:", err)
      }
    }

    fetchClientes()
  }, [])

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de eliminar este cliente?")) {
      // En un caso real, esta sería una llamada a tu API
      setClientes(clientes.filter((cliente) => cliente.id !== id))
    }
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.documento.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Layout>
      <div className="client-list">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Clientes</h1>
            <p className="text-muted">Gestión de clientes</p>
          </div>
          <Button as={Link} href="/clientes/nuevo" variant="primary">
            <FaPlus className="me-2" /> Nuevo Cliente
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
                    placeholder="Buscar clientes por nombre, apellido o documento..."
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
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Cargando...
                      </td>
                    </tr>
                  ) : filteredClientes.length > 0 ? (
                    filteredClientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <td>{cliente.id}</td>
                        <td>{`${cliente.nombre} ${cliente.apellido}`}</td>
                        <td>{`${cliente.tipoDocumento || ""} ${cliente.documento}`}</td>
                        <td>{cliente.telefono || "-"}</td>
                        <td>{cliente.email || "-"}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Button
                              as={Link}
                              href={`/clientes/editar/${cliente.id}`}
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                            >
                              <FaEdit />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cliente.id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No se encontraron clientes
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
