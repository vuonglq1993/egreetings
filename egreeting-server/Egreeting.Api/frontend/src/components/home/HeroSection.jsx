// src/components/home/HeroSection.jsx
import { Container, Form, Button } from "react-bootstrap";

export default function HeroSection({ search, setSearch, onSearch }) {
  return (
    <section className="hero-section">
      <Container className="position-relative z-3 text-center text-white py-5">
        <div className="animate__animated animate__fadeIn">
          <h1 className="display-3 fw-bold mb-3">Send a Smile Today</h1>
          <p className="lead mb-4 fs-5 opacity-90">
            Choose from hundreds of stunning cards, personalize in seconds, and share joy instantly.
          </p>

          <Form className="d-flex justify-content-center mt-4" onSubmit={onSearch}>
            <div className="search-bar d-flex align-items-center">
              <i className="bi bi-search position-absolute start-0 ms-4 fs-5 text-white" />
              <Form.Control
                type="search"
                placeholder="Search for cards, occasions, or themes..."
                className="border-0 py-3 flex-grow-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="light" type="submit" className="btn-search rounded-pill px-4 fw-semibold me-1">
                Search
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </section>
  );
}