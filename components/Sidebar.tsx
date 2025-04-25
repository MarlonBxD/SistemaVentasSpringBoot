"use client"
import { Nav } from "react-bootstrap"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        left: 0,
        height: "calc(100vh - 60px)",
        width: isOpen ? "250px" : "70px",
        backgroundColor: "#2c3e50",
        color: "white",
        transition: "width 0.3s ease",
        zIndex: 1020,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {isOpen && (
          <h5
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            Menú Principal
          </h5>
        )}
      </div>

      <Nav className="flex-column" style={{ padding: "1rem 0" }}>
        <Nav.Item>
          <Link href="/dashboard" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/dashboard") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/dashboard") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaTachometerAlt
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Dashboard</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link href="/productos" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/productos") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/productos") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaBox
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Productos</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link href="/categorias" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/categorias") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/categorias") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaTags
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Categorías</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link href="/clientes" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/clientes") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/clientes") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaUsers
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Clientes</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link href="/ventas" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/ventas") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/ventas") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaShoppingCart
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Ventas</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link href="/inventario" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/inventario") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/inventario") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaWarehouse
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Inventario</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link href="/reportes" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/reportes") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/reportes") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaChartBar
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Reportes</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link href="/usuarios" passHref legacyBehavior>
            <Nav.Link
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                borderLeft: isActive("/usuarios") ? "3px solid #3498db" : "3px solid transparent",
                backgroundColor: isActive("/usuarios") ? "rgba(255, 255, 255, 0.1)" : "transparent",
              }}
            >
              <FaUserCog
                style={{
                  fontSize: "1.1rem",
                  minWidth: "20px",
                  marginRight: isOpen ? "10px" : "0",
                }}
              />
              {isOpen && <span>Usuarios</span>}
            </Nav.Link>
          </Link>
        </Nav.Item>
      </Nav>

      {isOpen && (
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.5)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "0.75rem" }}>v1.0.0</div>
        </div>
      )}
    </div>
  )
}
