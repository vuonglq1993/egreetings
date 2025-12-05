// src/pages/Settings/index.tsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col, InputGroup } from 'react-bootstrap';

interface AdminInfo {
  name: string;
  email: string;
}

interface SystemConfig {
  siteName: string;
  supportEmail: string;
}

const SettingsPage: React.FC = () => {
  // Admin Info
  const [adminInfo, setAdminInfo] = useState<AdminInfo>({
    name: '',
    email: '',
  });

  // Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // System Config
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    siteName: 'E-Greeting',
    supportEmail: 'support@egreeting.com',
  });

  // Feedback
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Load saved settings on mount (simulate from localStorage or API)
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminInfo');
    const savedConfig = localStorage.getItem('systemConfig');

    if (savedAdmin) {
      setAdminInfo(JSON.parse(savedAdmin));
    } else {
      setAdminInfo({ name: 'Admin User', email: 'admin@egreeting.com' });
    }

    if (savedConfig) {
      setSystemConfig(JSON.parse(savedConfig));
    }
  }, []);

  const showAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleUpdateAdminInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInfo.name || !adminInfo.email) {
      showAlert('danger', 'Please fill in all fields.');
      return;
    }
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
    showAlert('success', 'Admin information updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('danger', 'All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('danger', 'New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      showAlert('danger', 'New password must be at least 6 characters.');
      return;
    }

    // In real app: call API to change password
    showAlert('success', 'Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleUpdateSystemConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemConfig.siteName || !systemConfig.supportEmail) {
      showAlert('danger', 'Please fill in all fields.');
      return;
    }
    localStorage.setItem('systemConfig', JSON.stringify(systemConfig));
    showAlert('success', 'System configuration updated successfully!');
  };

  return (
    <>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Settings</h2>
      </div>

      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Row>
        {/* Left Column */}
        <Col md={6}>
          {/* Admin Information */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Admin Information</Card.Title>
              <Form onSubmit={handleUpdateAdminInfo}>
                <Form.Group className="mb-3">
                  <Form.Label>Admin Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={adminInfo.name}
                    onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
                    placeholder="Enter admin name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={adminInfo.email}
                    onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
                    placeholder="admin@example.com"
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Update Information
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Change Password */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>Change Password</Card.Title>
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </Form.Group>

                <Button variant="success" type="submit">
                  Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col md={6}>
          {/* System Configuration */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title>System Configuration</Card.Title>
              <Form onSubmit={handleUpdateSystemConfig}>
                <Form.Group className="mb-3">
                  <Form.Label>Website Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={systemConfig.siteName}
                    onChange={(e) => setSystemConfig({ ...systemConfig, siteName: e.target.value })}
                    placeholder="E-Greeting"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Support Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>@</InputGroup.Text>
                    <Form.Control
                      type="email"
                      value={systemConfig.supportEmail}
                      onChange={(e) => setSystemConfig({ ...systemConfig, supportEmail: e.target.value })}
                      placeholder="support@egreeting.com"
                    />
                  </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Update Configuration
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Info Card */}
          <Card className="shadow-sm border-info">
            <Card.Body className="text-muted small">
              <strong>Note:</strong> These settings are saved locally in your browser for demo purposes.
              In a real application, they would be synced with your backend API and database.
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SettingsPage;