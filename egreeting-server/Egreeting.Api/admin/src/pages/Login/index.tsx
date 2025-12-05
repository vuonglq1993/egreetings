// src/pages/Login/index.tsx
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '@/lib/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiPost('api/auth/login', { email, password });

      if (res.token && res.user?.role) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        if (res.user.role.toLowerCase() !== 'admin') {
          setError('You do not have Admin access!');
          localStorage.clear();
          return;
        }

        // Chuyển hướng đến dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.message?.includes('Failed to fetch')
          ? 'Cannot connect to server. Is the backend running?'
          : err.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4a00e0, #8e2de2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card style={{ maxWidth: '400px', width: '100%', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
        <Card.Body className="p-5">
          <h3 className="text-center mb-4 fw-bold" style={{ color: '#4a00e0' }}>
            Admin Login
          </h3>

          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                size="lg"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                size="lg"
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={loading}
              style={{
                background: 'linear-gradient(90deg, #4a00e0, #8e2de2)',
                border: 'none',
                fontWeight: '600',
                padding: '12px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>

          <div className="text-center mt-3 text-muted small">
            Admin only • Protected access
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;