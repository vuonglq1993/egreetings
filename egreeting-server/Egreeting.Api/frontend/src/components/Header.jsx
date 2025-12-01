// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Image, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { getStableAvatarSmall } from "../utils/avatar";
import "../styles/header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Load user từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        
        // Ưu tiên dùng avatar đã lưu, nếu không có thì tạo mới
        if (userObj.avatar) {
          setAvatarUrl(userObj.avatar);
        } else {
          // Tạo avatar nhỏ với cùng logic
          const avatar = getStableAvatarSmall(userObj);
          setAvatarUrl(avatar);
        }
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }

    setUserLoading(false);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const api = import.meta.env.VITE_API_URL;
        const res = await fetch(`${api}/category`);
        const data = await res.json();

        const formatted = data.map(cat => ({
          name: cat.name,
          path: `/category/${cat.name}`,
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

  // Update user khi có thay đổi từ Profile
  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        const userObj = JSON.parse(stored);
        setUser(userObj);
        
        // Luôn dùng avatar từ user object để đảm bảo đồng nhất
        if (userObj.avatar) {
          setAvatarUrl(userObj.avatar);
        }
      } else {
        setUser(null);
        setAvatarUrl("");
      }
    };

    window.addEventListener("user-updated", updateUser);

    return () => {
      window.removeEventListener("user-updated", updateUser);
    };
  }, []);

  const isActive = path => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAvatarUrl("");
    navigate("/login");
    window.location.reload();
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`luxury-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          E-Greeting
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              HOME
            </Nav.Link>

            <NavDropdown title="TEMPLATES" id="templates-dropdown">
              {loading ? (
                <NavDropdown.Item>
                  <Spinner size="sm" /> Loading...
                </NavDropdown.Item>
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

            <Nav.Link
              as={Link}
              to="/subscribe"
              className={`nav-link ${isActive("/subscribe") ? "active" : ""}`}
            >
              SUBSCRIBE
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/packages"
              className={`nav-link ${isActive("/packages") ? "active" : ""}`}
            >
              PACKAGES
            </Nav.Link> 
            <Nav.Link
              as={Link}
              to="/feedback"
              className={`nav-link ${isActive("/feedback") ? "active" : ""}`}
            >
              FEEDBACK
            </Nav.Link>
          </Nav>

          {/* RIGHT SIDE */}
          <Nav className="align-items-center">
            {userLoading ? (
              <Spinner size="sm" className="text-amber-400" />
            ) : user ? (
              <NavDropdown
                title={
                  <div className="d-flex align-items-center gap-2">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        roundedCircle
                        width={36}
                        height={36}
                        className="border border-amber-400"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          console.log("Avatar load error in Header");
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle border border-amber-400 d-flex align-items-center justify-content-center bg-dark"
                        style={{ width: "36px", height: "36px" }}
                      >
                        <User size={18} className="text-amber-400" />
                      </div>
                    )}
                    <span className="text-white fw-medium">
                      Hello, {user.fullName || 'User'}
                    </span>
                  </div>
                }
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-subscription">
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