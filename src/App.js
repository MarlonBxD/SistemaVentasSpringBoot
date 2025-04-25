"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// Componentes de autenticación
import Login from "./components/auth/Login"
import PrivateRoute from "./components/auth/PrivateRoute"

// Componentes de layout
import Header from "./components/layout/Header"
import Sidebar from "./components/layout/Sidebar"

// Componentes principales
import Dashboard from "./components/dashboard/Dashboard"
import ProductList from "./components/productos/ProductList"
import ProductForm from "./components/productos/ProductForm"
import CategoryList from "./components/categorias/CategoryList"
import CategoryForm from "./components/categorias/CategoryForm"
import ClientList from "./components/clientes/ClientList"
import ClientForm from "./components/clientes/ClientForm"
import SalesList from "./components/ventas/SalesList"
import SalesForm from "./components/ventas/SalesForm"
import SalesDetail from "./components/ventas/SalesDetail"
import InventoryMovements from "./components/inventario/InventoryMovements"
import Reports from "./components/reportes/Reports"
import UserList from "./components/usuarios/UserList"
import UserForm from "./components/usuarios/UserForm"

// Contexto de autenticación
import { AuthProvider } from "./context/AuthContext"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Rutas de Productos */}
                    <Route path="/productos" element={<ProductList />} />
                    <Route path="/productos/nuevo" element={<ProductForm />} />
                    <Route path="/productos/editar/:id" element={<ProductForm />} />

                    {/* Rutas de Categorías */}
                    <Route path="/categorias" element={<CategoryList />} />
                    <Route path="/categorias/nueva" element={<CategoryForm />} />
                    <Route path="/categorias/editar/:id" element={<CategoryForm />} />

                    {/* Rutas de Clientes */}
                    <Route path="/clientes" element={<ClientList />} />
                    <Route path="/clientes/nuevo" element={<ClientForm />} />
                    <Route path="/clientes/editar/:id" element={<ClientForm />} />

                    {/* Rutas de Ventas */}
                    <Route path="/ventas" element={<SalesList />} />
                    <Route path="/ventas/nueva" element={<SalesForm />} />
                    <Route path="/ventas/:id" element={<SalesDetail />} />

                    {/* Rutas de Inventario */}
                    <Route path="/inventario" element={<InventoryMovements />} />

                    {/* Rutas de Reportes */}
                    <Route path="/reportes" element={<Reports />} />

                    {/* Rutas de Usuarios */}
                    <Route path="/usuarios" element={<UserList />} />
                    <Route path="/usuarios/nuevo" element={<UserForm />} />
                    <Route path="/usuarios/editar/:id" element={<UserForm />} />
                  </Routes>
                </PrivateLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

// Layout para rutas privadas
const PrivateLayout = ({ children, sidebarOpen, toggleSidebar }) => {
  return (
    <PrivateRoute>
      <Header toggleSidebar={toggleSidebar} />
      <div className="content-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
          <Container fluid className="py-3">
            {children}
          </Container>
        </main>
      </div>
    </PrivateRoute>
  )
}

export default App
