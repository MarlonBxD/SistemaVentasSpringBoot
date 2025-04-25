"use client"

import { useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { FaSave, FaArrowLeft } from "react-icons/fa"
import Layout from "@/components/Layout"
import Link from "next/link"

export default function NuevaCategoriaPage() {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setExito(null)
  
    const nuevaCategoria = {
      nombre,
      descripcion,
    }
  
    const token = localStorage.getItem("token")
  
    try {
      const res = await fetch("http://localhost:8080/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaCategoria),
      })
  
      if (!res.ok) throw new Error("Error al crear la categoría")
  
      setExito("Categoría creada exitosamente")
      setNombre("")
      setDescripcion("")
    } catch (err) {
      setError("No se pudo crear la categoría")
      console.error(err)
    }
  }

  return (
    <div className="nueva-categoria">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Nueva Categoría</h1>
          <p className="text-muted">Registrar una nueva categoría de productos</p>
        </div>
        <Button as={Link} href="/categorias" variant="secondary">
          <FaArrowLeft className="me-2" /> Volver
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && <Alert variant="success">{exito}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre" className="mb-3">
              <Form.Label>Nombre de la categoría</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="descripcion" className="mb-4">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                <FaSave className="me-2" />
                Guardar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}
