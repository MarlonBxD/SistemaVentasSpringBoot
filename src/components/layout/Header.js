"use client"

import { useContext } from "react"
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaBars, FaUser, FaBell, FaSignOutAlt, FaCog } from "react-icons/fa"
import { AuthContext } from "../../context/AuthContext"
import "./Header.css"

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
  }

  return (
    <Navbar bg="white" expand="lg" fixed="top" className="header-navbar">
      <Container fluid>
        <Button variant="light" className="me-2 sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </Button>

        <Navbar.Brand as={Link} to="/dashboard" className="me-auto">
          Sistema de Ventas
        </Navbar.Brand>

        <Nav className="ms-auto">
          <NavDropdown
            title={
              <div className="d-inline-block">
                <FaBell className="notification-icon" />
                <span className="notification-badge">3</span>
              </div>
            }
            id="notification-dropdown"
            align="end"
          >
            <NavDropdown.Item>
              <div className="notification-item">
                <div className="notification-title">Nuevo pedido</div>
                <div className="notification-text">Se ha registrado una nueva venta</div>
                <div className="notification-time">Hace 5 minutos</div>
              </div>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <div className="notification-item">
                <div className="notification-title">Stock bajo</div>
                <div className="notification-text">El producto "Laptop HP" tiene stock bajo</div>
                <div className="notification-time">Hace 2 horas</div>
              </div>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <div className="notification-item">
                <div className="notification-title">Nuevo cliente</div>
                <div className="notification-text">Se ha registrado un nuevo cliente</div>
                <div className="notification-time">Hace 1 día</div>
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
                <div className="header-user-avatar">
                  <FaUser />
                </div>
                <span className="ms-2 d-none d-lg-inline-block">{currentUser?.nombre || "Usuario"}</span>
              </div>
            }
            id="user-dropdown"
            align="end"
          >
            <NavDropdown.Item as={Link} to="/perfil">
              <FaUser className="me-2" /> Mi Perfil
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/configuracion">
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

export default Header
