"use client"
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap"
import Link from "next/link"
import { FaBars, FaUser, FaBell, FaSignOutAlt, FaCog } from "react-icons/fa"
import { useRouter } from "next/navigation"

interface HeaderProps {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Eliminar token y redirigir a login
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="top"
      style={{
        height: "60px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
        zIndex: 1030,
      }}
    >
      <Container fluid>
        <Button
          variant="light"
          className="me-2"
          onClick={toggleSidebar}
          style={{
            padding: "0.5rem",
            border: "none",
            background: "transparent",
          }}
        >
          <FaBars />
        </Button>

        <Navbar.Brand as={Link} href="/dashboard" className="me-auto">
          Sistema de Ventas
        </Navbar.Brand>

        <Nav className="ms-auto">
          <NavDropdown
            title={
              <div className="d-inline-block">
                <FaBell style={{ fontSize: "1.2rem", color: "#6c757d" }} />
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translate(25%, -25%)",
                  }}
                >
                  3
                </span>
              </div>
            }
            id="notification-dropdown"
            align="end"
          >
            <NavDropdown.Item>
              <div>
                <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>Nuevo pedido</div>
                <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>Se ha registrado una nueva venta</div>
                <div style={{ fontSize: "0.75rem", color: "#adb5bd", marginTop: "0.25rem" }}>Hace 5 minutos</div>
              </div>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <div>
                <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>Stock bajo</div>
                <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>El producto "Laptop HP" tiene stock bajo</div>
                <div style={{ fontSize: "0.75rem", color: "#adb5bd", marginTop: "0.25rem" }}>Hace 2 horas</div>
              </div>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="text-center">
              <small>Ver todas las notificaciones</small>
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title={
              <div className="d-inline-block">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#2c3e50",
                    color: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaUser />
                </div>
                <span className="ms-2 d-none d-lg-inline-block">Usuario</span>
              </div>
            }
            id="user-dropdown"
            align="end"
          >
            <NavDropdown.Item as={Link} href="/perfil">
              <FaUser className="me-2" /> Mi Perfil
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} href="/configuracion">
              <FaCog className="me-2" /> Configuración
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Cerrar Sesión
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  )
}
