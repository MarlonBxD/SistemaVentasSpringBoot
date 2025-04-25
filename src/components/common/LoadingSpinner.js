import { Spinner } from "react-bootstrap"
import "./LoadingSpinner.css"

const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="loading-container full-page">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="loading-container">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Cargando...</p>
    </div>
  )
}

export default LoadingSpinner
