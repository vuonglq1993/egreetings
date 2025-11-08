// File: src/components/layout/Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 40,
        padding: "20px 40px",
        backgroundColor: "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          fontFamily: "'Segoe Script', cursive",
          fontSize: 24,
          fontWeight: 600,
          color: "#2ebf66",
          textDecoration: "none",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={28}
          height={28}
          fill="#2ebf66"
          style={{ marginRight: 8 }}
        >
          <path d="M12 2C7.5 2 4 7 4 12c0 5 3.5 10 8 10 4.5 0 8-5 8-10 0-5-3.5-10-8-10zm0 17c-3 0-6-4-6-7a6 6 0 0 1 12 0c0 3-3 7-6 7z" />
        </svg>
        Greetings Island
      </Link>

      {/* Menu */}
      <div style={{ display: "flex", gap: 25, fontWeight: 600, alignItems: "center" }}>
        <Link to="/category/wedding" style={navLinkStyle}>Wedding</Link>
        <Link to="/category/birthday" style={navLinkStyle}>Birthday</Link>
        <Link to="/category/baby" style={navLinkStyle}>Baby & Kids</Link>
        <Link to="/category/party" style={navLinkStyle}>Party</Link>
        <Link to="/category/greeting" style={navLinkStyle}>Greeting cards</Link>
        <Link to="/category/trending" style={navLinkStyle}>Trending</Link>
        <button aria-label="Search" style={searchBtnStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="#222"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            width={22}
            height={22}
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* Login / Premium */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <button style={loginBtnStyle}>Log in</button>
        <button style={premiumBtnStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width={18}
            height={18}
            style={{ marginRight: 6 }}
          >
            <path d="M12 2L15 8l6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" />
          </svg>
          Go Premium
        </button>
      </div>
    </nav>
  );
};

export default Header;

// Styles (có thể tách riêng nếu muốn)
const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#222",
  fontSize: 16,
  cursor: "pointer",
};

const searchBtnStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  marginLeft: 10,
  padding: 0,
};

const loginBtnStyle: React.CSSProperties = {
  backgroundColor: "white",
  border: "1.5px solid #ddd",
  borderRadius: 22,
  padding: "8px 18px",
  fontWeight: 600,
  cursor: "pointer",
};

const premiumBtnStyle: React.CSSProperties = {
  backgroundColor: "#7b51ff",
  borderRadius: 22,
  border: "none",
  color: "white",
  padding: "8px 18px",
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};
