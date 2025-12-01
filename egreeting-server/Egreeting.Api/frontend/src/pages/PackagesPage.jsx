// PackagesPage.jsx – Styled like Category, 3-column layout
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const handleBuy = async (packageId) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/paypal/pay-package?packageId=${packageId}`);
    const url = res.data.approval_url;

    // Redirect user to PayPal
    window.location.href = url;
  } catch (err) {
    console.error(err);
    alert("Failed to start PayPal payment");
  }
};

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/package/with-relations`
        );
        setPackages(res.data || []);
      } catch (err) {
        setError("Failed to load packages.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 text-center py-5">
        <Spinner animation="border" variant="warning" size="lg" />
        <p className="mt-3 text-muted fs-4">Loading packages...</p>
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

  return (
    <Container className="my-5">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 text-center fw-bold display-5 text-primary"
      >
        Subscription Packages
      </motion.h2>

      <Row className="g-4">
        {packages.map((pkg, index) => (
          <Col xs={12} sm={6} md={4} key={pkg.id}>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ y: -12 }}
              className="h-100"
            >
              <Card className="h-100 border-0 shadow-lg overflow-hidden rounded-4 position-relative card-glow">
                <Card.Body className="d-flex flex-column p-4 bg-white text-center">
                  <h4 className="fw-bold mb-3">{pkg.name}</h4>
                  <p className="text-muted mb-2">{pkg.description}</p>
                  <p className="fw-semibold mb-1">Duration: {pkg.durationMonths} months</p>
                  <h5 className="fw-bold text-success mb-3">${pkg.price}</h5>
                  <div className="mt-auto">
                    <button
                    className="btn btn-warning fw-bold w-100 shadow-sm"
                    onClick={() => handleBuy(pkg.id)}
                  >
                    Choose Plan
                  </button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <style>{`
        .card-glow {
          transition: all 0.4s ease;
          background: white;
        }
        .card-glow:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(255, 183, 0, 0.25) !important;
        }
      `}</style>
    </Container>
  );
}

// App.jsx
// <Route path="/packages" element={<PackagesPage />} />
