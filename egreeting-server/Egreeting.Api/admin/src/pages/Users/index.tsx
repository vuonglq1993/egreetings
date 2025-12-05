// src/pages/Users/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Modal,
  Form,
  Stack,
} from 'react-bootstrap';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'User' | 'Admin';
  status: boolean;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    fullName: '',
    email: '',
    role: 'User',
    status: true,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<User[]>('api/users/with-relations');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentUser({
      fullName: '',
      email: '',
      role: 'User',
      status: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setIsEditMode(true);
    setCurrentUser({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSave = async () => {
    if (!currentUser.fullName || !currentUser.email) {
      alert('Please fill in Full Name and Email.');
      return;
    }

    try {
      const payload: any = {
        fullName: currentUser.fullName,
        email: currentUser.email,
        role: currentUser.role || 'User',
        status: currentUser.status ?? true,
      };

      if (isEditMode && currentUser.id) {
        await apiPut(`api/users/${currentUser.id}`, payload);
        alert('User updated successfully!');
      } else {
        // For new user: ask for password
        const password = window.prompt('Enter password for new user:');
        if (!password) {
          alert('Password is required for new users!');
          return;
        }
        payload.password = password; // backend will hash it
        await apiPost('api/users', payload);
        alert('User created successfully!');
      }

      handleCloseModal();
      loadUsers();
    } catch (err: any) {
      console.error('Save user error:', err);
      alert('Error: ' + (err.message || 'Could not save user'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await apiDelete(`api/users/${id}/delete`);
      alert('User deleted successfully!');
      loadUsers();
    } catch (err: any) {
      console.error('Delete user error:', err);
      alert('Error: ' + (err.message || 'Could not delete user'));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
        <Stack direction="horizontal" gap={3}>
          <Badge bg="primary" className="fs-5 align-self-center">
            Total: {users.length}
          </Badge>
          <Button variant="primary" onClick={openAddModal}>
            Add New User
          </Button>
        </Stack>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Empty State */}
      {!loading && !error && users.length === 0 && (
        <Alert variant="info" className="text-center">
          No users found. Click "Add New User" to create one.
        </Alert>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <div className="table-responsive">
          <Table striped hover bordered className="align-middle">
            <thead className="table-light">
              <tr>
                <th width="60">#</th>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td className="fw-bold">#{user.id}</td>
                  <td>{user.fullName || <em className="text-muted">—</em>}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'Admin' ? 'danger' : 'primary'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={user.status ? 'success' : 'secondary'}>
                      {user.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(user)}
                      title="Edit user"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(user.id)}
                      title="Delete user"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={currentUser.fullName || ''}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, fullName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                value={currentUser.email || ''}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={currentUser.role || 'User'}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value as 'User' | 'Admin' })
                }
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={currentUser.status ?? true}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, status: e.target.checked })
                }
              />
            </Form.Group>

            {!isEditMode && (
              <Alert variant="info" className="small">
                <strong>Note:</strong> You will be prompted to enter a password after clicking "Create".
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersPage;