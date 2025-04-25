import { Row, Col, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import "./PageHeader.css"

const PageHeader = ({ title, subtitle, buttonText, buttonLink, icon: Icon }) => {
  return (
    <div className="page-header">
      <Row className="align-items-center">
        <Col>
          <h1 className="page-title">
            {Icon && <Icon className="page-icon" />}
            {title}
          </h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </Col>
        {buttonText && buttonLink && (
          <Col xs="auto">
            <Button as={Link} to={buttonLink} variant="primary">
              {buttonText}
            </Button>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default PageHeader
