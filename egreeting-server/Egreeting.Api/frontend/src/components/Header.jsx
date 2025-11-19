// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Image, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // { fullName, email, avatar? }
  const [userLoading, setUserLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Lấy user từ localStorage (sau khi login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setUserLoading(false);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5018/api/category");
        const data = await res.json();
        const formatted = data.map(cat => ({
          name: cat.name,
          path: `/category/${cat.name}`
        }));
        setCategories(formatted);
      } catch (err) {
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" sticky="top" className={`luxury-navbar ${scrolled ? "scrolled" : ""}`}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          E-Greeting
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>HOME</Nav.Link>

            <NavDropdown title="TEMPLATES" id="templates-dropdown">
              {loading ? (
                <NavDropdown.Item><Spinner size="sm" /> Loading...</NavDropdown.Item>
              ) : categories.length === 0 ? (
                <NavDropdown.Item>No categories</NavDropdown.Item>
              ) : (
                categories.map(cat => (
                  <NavDropdown.Item key={cat.name} as={Link} to={cat.path}>
                    {cat.name.toUpperCase()}
                  </NavDropdown.Item>
                ))
              )}
            </NavDropdown>

            <Nav.Link as={Link} to="/subscribe" className={`nav-link ${isActive("/subscribe") ? "active" : ""}`}>
              SUBSCRIBE
            </Nav.Link>
            <Nav.Link as={Link} to="/feedback" className={`nav-link ${isActive("/feedback") ? "active" : ""}`}>
              FEEDBACK
            </Nav.Link>
          </Nav>

          {/* RIGHT CORNER: LOGIN OR PROFILE */}
          <Nav className="align-items-center">
            {userLoading ? (
              <Spinner size="sm" className="text-amber-400" />
            ) : user ? (
              <NavDropdown
                title={
                  <div className="d-flex align-items-center gap-2">
                    <Image
                      src="/avatar-placeholder.png"
                      roundedCircle
                      width={36}
                      height={36}
                      className="border border-amber-400"
                    />
                    <span className="text-white fw-medium">{user.fullName}</span>
                  </div>
                }
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-subscriptions">
                  My Subscriptions
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn-login-sm me-2">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn-register-sm">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}