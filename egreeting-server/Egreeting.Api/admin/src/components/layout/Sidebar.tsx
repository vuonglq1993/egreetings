// src/components/layout/Sidebar.tsx
import React from 'react';
import { Button } from 'react-bootstrap';

interface SidebarProps {
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const menuItems = [
    { href: '/admin', icon: 'bi-speedometer2', label: 'Dashboard', active: true },
    { href: '/admin/users', icon: 'bi-people', label: 'Users' },
    { href: '/admin/categories', icon: 'bi-tags', label: 'Categories' },
    { href: '/admin/templates', icon: 'bi-card-text', label: 'Templates' },
    { href: '/admin/transactions', icon: 'bi-cart', label: 'Transactions' },
    { href: '/admin/packages', icon: 'bi-gift', label: 'Packages' },
    { href: '/admin/subscriptions', icon: 'bi-people-fill', label: 'Subscriptions' },
    { href: '/admin/feedbacks', icon: 'bi-chat-left-text', label: 'Feedbacks' },
    { href: '/admin/reports', icon: 'bi-bar-chart', label: 'Reports' },
    { href: '/admin/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  return (
    <div
      className={`bg-dark text-light d-flex flex-column position-fixed h-100 ${
        sidebarOpen ? 'w-250' : 'w-80'
      } transition-all`}
      style={{ zIndex: 1030 }}
    >
      <div className="p-4 text-center bg-black">
        <h4 className="mb-0 text-white">ADMIN</h4>
      </div>

      <nav className="flex-column px-2 flex-grow-1 mt-3">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`d-flex align-items-center text-light text-decoration-none py-3 px-3 rounded mb-1 ${
              item.active ? 'bg-secondary' : ''
            } hover-bg`}
          >
            <i className={`bi ${item.icon} fs-5 ${sidebarOpen ? 'me-3' : ''}`}></i>
            {sidebarOpen && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      <Button variant="danger" className="mx-3 mb-4">
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;