"use client"

import { useState } from "react"
import { Modal, Button, Form, Row, Col } from "react-bootstrap"
import { FaSave } from "react-icons/fa"

const InventoryMovementModal = ({ show, onHide, onSave, productos }) => {
  const [movement, setMovement] = useState({
    productoId: "",
    tipo: "ENTRADA",
    cantidad: 1,
    descripcion: "",
  })
  const [validated, setValidated] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setMovement({
      ...movement,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    // Convertir valores numéricos
    const movementData = {
      ...movement,
      productoId: Number.parseInt(movement.productoId),
      cantidad: Number.parseInt(movement.cantidad),
    }

    onSave(movementData)

    // Resetear el formulario
    setMovement({
      productoId: "",
      tipo: "ENTRADA",
      cantidad: 1,
      descripcion: "",
    })
    setValidated(false)
  }

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Movimiento de Inventario</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Producto</Form.Label>
            <Form.Select name="productoId" value={movement.productoId} onChange={handleChange} required>
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - Stock actual: {producto.stock}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">Seleccione un producto</Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Movimiento</Form.Label>
                <Form.Select name="tipo" value={movement.tipo} onChange={handleChange} required>
                  <option value="ENTRADA">Entrada</option>
                  <option value="SALIDA">Salida</option>
                  <option value="AJUSTE">Ajuste</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  name="cantidad"
                  value={movement.cantidad}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">La cantidad debe ser al menos 1</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={movement.descripcion}
              onChange={handleChange}
              placeholder="Ingrese una descripción del movimiento"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            <FaSave className="me-2" /> Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default InventoryMovementModal
