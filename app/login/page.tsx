"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, Form, Button, Alert, Container, Row, Col } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [testConnection, setTestConnection] = useState<string | null>(null)
  const router = useRouter()

  // Añadir un nuevo estado para el resultado de la prueba
  const [testResult, setTestResult] = useState<string | null>(null)

  // Probar la conexión al cargar la página
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await axios.get("/api/test/hello")
        setTestConnection(`Conexión exitosa: ${response.data}`)
      } catch (err) {
        setTestConnection(`Error de conexión: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    testBackendConnection()
  }, [])

  // Añadir una nueva función para probar la comunicación
  const testEchoEndpoint = async () => {
    try {
      setTestResult("Probando comunicación...")
      const testData = { test: true, timestamp: new Date().toISOString() }
      const response = await axios.post("/api/test/echo", testData)
      setTestResult(`Prueba exitosa: ${JSON.stringify(response.data)}`)
    } catch (err: any) {
      setTestResult(`Error en la prueba: ${err.message}`)
      console.error("Error completo de la prueba:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Logs para depuración
    console.log("Intentando iniciar sesión con:", {
      username,
      password: password ? "********" : "(vacío)", // No mostrar la contraseña real por seguridad
    })

    try {
      // Usar la ruta correcta según el controlador AuthController de Spring Boot
      console.log("Enviando solicitud a:", "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      // Enviar la solicitud con el formato que espera el backend de Spring Boot
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      })
      console.log("Respuesta completa:", {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      })

      console.log("Respuesta recibida:", response.data)

      // Verificar si la respuesta contiene el token JWT
      if (response.data && response.data.accessToken) {
        // Guardar token en localStorage
        localStorage.setItem("token", response.data.accessToken)
        console.log("Token guardado en localStorage")

        // Redirigir al dashboard
        console.log("Redirigiendo a /dashboard")
        router.push("/dashboard")
      } else {
        console.error("No se recibió token en la respuesta:", response.data)
        setError("Respuesta inválida del servidor")
      }
    } catch (err: any) {
      console.error("Error completo:", err)
      console.error("Detalles de la respuesta:", err.response?.data)

      // Mostrar mensaje de error más específico si está disponible
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Usuario o contraseña incorrectos")
      }
    } finally {
      setLoading(false)
    }
  }

  // Función para autenticación temporal (solo para pruebas)
  const handleBypassAuth = () => {
    // Crear un token JWT falso para pruebas
    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbiBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    localStorage.setItem("token", fakeToken)
    router.push("/dashboard")
  }

  return (
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: "20px 0",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            {testConnection && (
              <Alert variant={testConnection.includes("exitosa") ? "success" : "warning"} className="mb-3">
                {testConnection}
              </Alert>
            )}

            <Card
              className="login-card"
              style={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
              }}
            >
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Sistema de Ventas</h2>
                  <p className="text-muted">Ingrese sus credenciales para acceder</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese su nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted mb-2">¿Problemas para iniciar sesión?</p>
                  <Button variant="outline-secondary" size="sm" onClick={handleBypassAuth} className="me-2">
                    Acceso temporal (solo para pruebas)
                  </Button>
                  <Button variant="outline-info" size="sm" onClick={testEchoEndpoint}>
                    Probar comunicación
                  </Button>
                </div>

                {testResult && (
                  <Alert variant="info" className="mt-3">
                    <small>{testResult}</small>
                  </Alert>
                )}
              </Card.Body>
            </Card>

            <div className="text-center mt-3 text-muted">
              <small>© 2023 Sistema de Ventas. Todos los derechos reservados.</small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
