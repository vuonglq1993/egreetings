// src/components/layout/AdminLayout.tsx
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-layout-wrapper d-flex">
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* ➜ Đây là wrapper chính, margin-left đặt ở đây */}
      <div
        className="admin-content flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? '250px' : '80px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <Topbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <Container fluid className="pt-5 content-area">
          <div className="p-4">
            <Outlet />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
