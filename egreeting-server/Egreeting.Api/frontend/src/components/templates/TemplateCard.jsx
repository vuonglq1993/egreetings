import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TemplateCard({ template }) {
  if (!template) return null;

  return (
    <Link to={`/edit/${template.id}`} className="text-decoration-none">
      <Card className="h-100 shadow-sm hover-shadow transition">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={template.imageUrl || "/placeholder.jpg"}
            alt={template.title}
            style={{ height: "200px", objectFit: "cover" }}
          />
          {template.price > 0 && (
            <Badge bg="primary" className="position-absolute top-0 end-0 m-2">
              ${template.price}
            </Badge>
          )}
        </div>
        <Card.Body>
          <Card.Title className="fs-6 fw-semibold text-dark">
            {template.title}
          </Card.Title>
          <Card.Text className="text-muted small">{template.categoryName}</Card.Text>
          <small className="text-muted">{template.transactionCount} lượt gửi</small>
        </Card.Body>
      </Card>
    </Link>
  );
}
