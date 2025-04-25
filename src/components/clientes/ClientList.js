"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaSearch, FaEdit, FaTrash, FaUsers } from "react-icons/fa"
import axios from "axios"
import PageHeader from "../common/PageHeader"
import LoadingSpinner from "../common/LoadingSpinner"
import "./ClientList.css"

const ClientList = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/clientes")
        setClientes(response.data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los clientes")
        setLoading(false)
        console.error("Error al cargar clientes:", err)
      }
    }

    fetchClientes()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este cliente?")) {
      try {
        await axios.delete(`/clientes/${id}`)
        setClientes(clientes.filter((cliente) => cliente.id !== id))
      } catch (err) {
        setError("Error al eliminar el cliente")
        console.error("Error al eliminar cliente:", err)
      }
    }
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.documento.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="client-list">
      <PageHeader
        title="Clientes"
        subtitle="Gestión de clientes"
        buttonText="Nuevo Cliente"
        buttonLink="/clientes/nuevo"
        icon={FaUsers}
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
                {filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{`${cliente.nombre} ${cliente.apellido}`}</td>
                      <td>{`${cliente.tipoDocumento || ""} ${cliente.documento}`}</td>
                      <td>{cliente.telefono || "-"}</td>
                      <td>{cliente.email || "-"}</td>
                      <td>
                        <div className="actions">
                          <Button
                            as={Link}
                            to={`/clientes/editar/${cliente.id}`}
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
  )
}

export default ClientList
