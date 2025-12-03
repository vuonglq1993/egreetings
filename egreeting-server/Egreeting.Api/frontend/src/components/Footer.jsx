// src/components/Footer.jsx
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/footer.css";

const quickLinks = ["Birthday", "Wedding", "New Year", "Anniversary"];
const companyLinks = ["About Us", "Blog", "Careers", "Contact"];
const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="text-white">
      {/* CTA Section */}
      <div className="footer-cta">
        <Container>
          <h3>Ready to Create Something Special?</h3>
          <p>Start designing your perfect card in under 30 seconds.</p>
          <Button
            size="lg"
            className="cta-button"
            onClick={() => navigate("/templates")}
          >
            Browse All Templates
          </Button>
        </Container>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <Container>
          <Row className="g-4">
            {/* Brand */}
            <Col lg={4} md={6}>
              <div className="footer-brand">
                <h5>
                  <i className="bi bi-gift-fill me-2"></i>Cardify
                </h5>
                <p>
                  Create beautiful, personalized greeting cards for every occasion.<br />
                  Fast. Easy. Heartfelt.
                </p>
                <div className="social-links d-flex gap-3 mt-3">
                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                  <a href="#"><i className="bi bi-twitter"></i></a>
                  <a href="#"><i className="bi bi-pinterest"></i></a>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6}>
              <div className="footer-links">
                <h6>Explore</h6>
                <ul>
                  {quickLinks.map((cat) => (
                    <li key={cat}>
                      <Link to={`/category/${cat}`} className="text-decoration-none">
                        {cat} Cards
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* Company */}
            <Col lg={2} md={6}>
              <div className="footer-links">
                <h6>Company</h6>
                <ul>
                  {companyLinks.map((item) => (
                    <li key={item}>
                      <Link
                        to={`/${item.toLowerCase().replace(" ", "-")}`}
                        className="text-decoration-none"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* Legal */}
            <Col lg={2} md={6}>
              <div className="footer-links">
                <h6>Legal</h6>
                <ul>
                  {legalLinks.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-decoration-none">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            {/* Newsletter */}
            <Col lg={2}>
              <div className="footer-links">
                <h6>Stay Updated</h6>
                <p>Get new templates weekly!</p>
                <Form className="d-flex flex-column gap-2 newsletter">
                  <Form.Control
                    type="email"
                    placeholder="Your email"
                    className="rounded-pill"
                  />
                  <Button variant="outline-light" size="sm" className="rounded-pill">
                    Subscribe
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p>
            © 2025 Cardify. Made with <i className="bi bi-heart-fill text-danger"></i> in Vietnam
          </p>
          <p>
            <i className="bi bi-shield-check text-success me-1"></i>
            Secure & Private
          </p>
        </Container>
      </div>
    </footer>
  );
}