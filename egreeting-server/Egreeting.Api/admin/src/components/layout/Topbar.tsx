// src/components/layout/Topbar.tsx
import React from 'react';
import { Navbar, Button } from 'react-bootstrap';

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <Navbar
      bg="white"
      className="shadow-sm border-bottom fixed-top"
      style={{
        marginLeft: sidebarOpen ? '250px' : '80px',
        transition: 'margin-left 0.3s ease',
        zIndex: 1020,
      }}
    >
      <div className="container-fluid px-4">
        <Button variant="link" onClick={toggleSidebar} className="text-dark p-0">
          <i className="bi bi-list fs-3"></i>
        </Button>

        <span className="ms-3 fw-bold">Admin Dashboard</span>

        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-muted">Admin</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin avatar"
            className="rounded-circle"
            width={40}
            height={40}
          />
        </div>
      </div>
    </Navbar>
  );
};

export default Topbar;