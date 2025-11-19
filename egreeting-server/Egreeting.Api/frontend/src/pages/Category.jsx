// src/pages/Category.jsx – CARD SIÊU ĐẸP 2026 EDITION (Refactored)
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE = `${import.meta.env.VITE_API_URL}/category`;

export default function Category() {
  const { categoryName } = useParams();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!categoryName) return;

    let isMounted = true;

    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const encoded = encodeURIComponent(categoryName.trim());
        const url = `${API_BASE}/${encoded}/templates`;

        // 1) Try primary endpoint
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();

          if (isMounted) {
            setTemplates(data || []);
            setDisplayName(categoryName);
          }
          return;
        }

        // 2) Fallback: fetch list of categories with templates
        console.warn("Primary endpoint failed → Fallback used");

        const fallbackRes = await fetch(`${API_BASE}/with-templates`);
        if (!fallbackRes.ok) throw new Error("Failed to fetch categories");

        const categories = await fallbackRes.json();
        const found = categories.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (!found) throw new Error("Category not found");

        if (isMounted) {
          setTemplates(found.templates || []);
          setDisplayName(found.name);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load templates");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTemplates();

    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  // ------------------------------------------------------------------
  // UI BLOCKS (unchanged)
  // ------------------------------------------------------------------

  if (loading) {
    return (
      <Container className="my-5 text-center py-5">
        <Spinner animation="border" variant="warning" size="lg" />
        <p className="mt-3 text-muted fs-4">Loading amazing templates...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <strong>Oops!</strong> {error}
        </Alert>
      </Container>
    );
  }

  if (templates.length === 0) {
    return (
      <Container className="my-5 text-center py-5">
        <h2 className="text-capitalize">{categoryName} Cards</h2>
        <Alert variant="info" className="mt-4 d-inline-block">
          No templates yet – more stunning designs coming soon!
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 text-center fw-bold display-5 text-primary"
      >
        {displayName.charAt(0).toUpperCase() + displayName.slice(1)} Cards
      </motion.h2>

      <Row className="g-4">
        {templates.map((template, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={template.id}>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ y: -12 }}
              className="h-100"
            >
              <Card className="h-100 border-0 shadow-lg overflow-hidden rounded-4 position-relative card-glow">
                {/* Premium / Free Badge */}
                <div className="position-absolute top-0 start-0 z-3 m-3">
                  {template.price > 0 ? (
                    <Badge bg="success" className="fw-bold px-3 py-2 shadow">
                      ${template.price}
                    </Badge>
                  ) : (
                    <Badge bg="warning" text="dark" className="fw-bold px-3 py-2 shadow">
                      FREE
                    </Badge>
                  )}
                </div>

                {/* New Badge */}
                {template.isNew && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-3 fw-bold px-3 py-2 shadow">
                    NEW
                  </Badge>
                )}

                {/* Image */}
                <div className="position-relative overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={template.imageUrl || "/placeholder.jpg"}
                    alt={template.title}
                    className="card-img-top"
                    style={{
                      height: "280px",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                    }}
                  />
                  <div className="image-overlay" />
                </div>

                <Card.Body className="d-flex flex-column p-4 bg-white">
                  <Card.Title className="fw-bold fs-5 text-dark mb-3 text-truncate">
                    {template.title}
                  </Card.Title>

                  <div className="mt-auto">
                    <Link
                      to={`/edit/${template.id}`}
                      className="btn btn-warning w-100 fw-bold text-dark shadow-sm btn-hover-lift"
                    >
                      Personalize Now
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Styles */}
      <style jsx>{`
        .card-glow {
          transition: all 0.4s ease;
          background: white;
        }
        .card-glow:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(255, 183, 0, 0.25) !important;
        }
        .card-glow:hover .card-img-top {
          transform: scale(1.12);
        }
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 50%, rgba(0,0,0,0.7));
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .card-glow:hover .image-overlay {
          opacity: 1;
        }
        .btn-hover-lift {
          transition: all 0.3s ease;
        }
        .btn-hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 183, 0, 0, 0.4) !important;
        }
      `}</style>
    </Container>
  );
}
