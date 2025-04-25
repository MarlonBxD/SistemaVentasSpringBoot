"use client"

import { useContext } from "react"
import { Nav } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import {
  FaTachometerAlt,
  FaBox,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaWarehouse,
  FaChartBar,
  FaUserCog,
} from "react-icons/fa"
import { AuthContext } from "../../context/AuthContext"
import "./Sidebar.css"

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const { hasRole } = useContext(AuthContext)

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">{isOpen && <h5 className="sidebar-title">Menú Principal</h5>}</div>

      <Nav className="flex-column sidebar-nav">
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
            <FaTachometerAlt className="sidebar-icon" />
            {isOpen && <span>Dashboard</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/productos" className={isActive("/productos") ? "active" : ""}>
            <FaBox className="sidebar-icon" />
            {isOpen && <span>Productos</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/categorias" className={isActive("/categorias") ? "active" : ""}>
            <FaTags className="sidebar-icon" />
            {isOpen && <span>Categorías</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/clientes" className={isActive("/clientes") ? "active" : ""}>
            <FaUsers className="sidebar-icon" />
            {isOpen && <span>Clientes</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/ventas" className={isActive("/ventas") ? "active" : ""}>
            <FaShoppingCart className="sidebar-icon" />
            {isOpen && <span>Ventas</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/inventario" className={isActive("/inventario") ? "active" : ""}>
            <FaWarehouse className="sidebar-icon" />
            {isOpen && <span>Inventario</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/reportes" className={isActive("/reportes") ? "active" : ""}>
            <FaChartBar className="sidebar-icon" />
            {isOpen && <span>Reportes</span>}
          </Nav.Link>
        </Nav.Item>

        {hasRole("ADMIN") && (
          <Nav.Item>
            <Nav.Link as={Link} to="/usuarios" className={isActive("/usuarios") ? "active" : ""}>
              <FaUserCog className="sidebar-icon" />
              {isOpen && <span>Usuarios</span>}
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>

      {isOpen && (
        <div className="sidebar-footer">
          <div className="version">v1.0.0</div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
