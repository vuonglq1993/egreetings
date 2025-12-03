import { memo } from "react";
import { Card, Button, Col } from "react-bootstrap";

const gradientMap = {
  Birthday: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
  Wedding: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  "New Year": "linear-gradient(135deg, #84fab0, #8fd3f4)",
};

// Icon phù hợp với từng category (dùng Bootstrap Icons)
const iconMap = {
  Birthday: "bi-balloon-heart-fill",
  Wedding: "bi-heart-fill",
  "New Year": "bi-stars",
  Christmas: "bi-tree-fill",
  Halloween: "bi-ghost",
  Valentine: "bi-cup-straw",
  Anniversary: "bi-calendar-heart",
  Baby: "bi-person-arms-up",
  // Thêm mới ở đây...
};

const CategoryCard = memo(({ category, sample, count, bgPattern, onClick }) => {
  const grad = gradientMap[category] || "#ccc";
  const bg = grad;

  // Tự động chọn icon, fallback nếu chưa có
  const icon = iconMap[category] || "bi-gift";

  return (
    <Col md={4} className="mb-4">
      <Card
        className="h-100 border-0 category-card overflow-hidden"
        style={{
          background: bg,
          backgroundSize: "cover",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <div className="shine-effect" />
        {sample && (
          <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
            <Card.Img variant="top" src={sample.image} className="category-img" />
          </div>
        )}
        <Card.Body className="d-flex flex-column p-4 text-white position-relative z-2">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
            <i className={`bi ${icon} fs-2 animate-icon`} />
            <Card.Title className="mb-0 fw-bold fs-4">{category}</Card.Title>
          </div>
          <p className="text-white opacity-90 text-center mb-3">
            {count} beautiful template{count > 1 ? "s" : ""}
          </p>
          <Button
            variant="light"
            className="mt-auto mx-auto rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
            style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Explore Now <i className="bi bi-arrow-right" />
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
});

export default CategoryCard;