// src/pages/Packages/index.tsx
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

interface Package {
  id: number;
  name: string;
  description: string | null;
  durationMonths: number;
  price: number;
  isActive: boolean;
  createdAt: string;
}

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Partial<Package>>({
    name: '',
    description: '',
    durationMonths: 1,
    price: 0,
    isActive: true,
  });

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Package[]>('api/package');
      setPackages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load packages');
      console.error('Load packages error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentPackage({
      name: '',
      description: '',
      durationMonths: 1,
      price: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (pkg: Package) => {
    setIsEditMode(true);
    setCurrentPackage({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      durationMonths: pkg.durationMonths,
      price: pkg.price,
      isActive: pkg.isActive,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSave = async () => {
    if (!currentPackage.name || !currentPackage.durationMonths || currentPackage.price == null) {
      alert('Please fill in all required fields: Name, Duration, Price');
      return;
    }

    try {
      const payload = {
        ...currentPackage,
        description: currentPackage.description || null,
      };

      if (isEditMode && currentPackage.id) {
        await apiPut(`api/package/${currentPackage.id}`, payload);
        alert('Package updated successfully!');
      } else {
        await apiPost('api/package', payload);
        alert('Package added successfully!');
      }

      handleCloseModal();
      loadPackages();
    } catch (err: any) {
      console.error('Save package error:', err);
      alert('Error: ' + (err.message || 'Could not save package'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      await apiDelete(`api/package/${id}`);
      alert('Package deleted successfully!');
      loadPackages();
    } catch (err: any) {
      console.error('Delete package error:', err);
      alert('Error: ' + (err.message || 'Could not delete package'));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
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
        <h2>Packages Management</h2>
        <Stack direction="horizontal" gap={3}>
          <Badge bg="primary" className="fs-5 align-self-center">
            Total: {packages.length}
          </Badge>
          <Button variant="primary" onClick={openAddModal}>
            Add New Package
          </Button>
        </Stack>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading packages...</p>
        </div>
      )}

      {/* Error State */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Empty State */}
      {!loading && !error && packages.length === 0 && (
        <Alert variant="info" className="text-center">
          No packages found. Click "Add New Package" to create one.
        </Alert>
      )}

      {/* Packages Table */}
      {!loading && packages.length > 0 && (
        <div className="table-responsive">
          <Table striped hover bordered className="align-middle">
            <thead className="table-light">
              <tr>
                <th width="60">#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Duration (months)</th>
                <th>Price</th>
                <th>Active</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, index) => (
                <tr key={pkg.id}>
                  <td>{index + 1}</td>
                  <td className="fw-bold">#{pkg.id}</td>
                  <td>{pkg.name}</td>
                  <td style={{ maxWidth: '250px' }}>
                    <div className="text-truncate" title={pkg.description || undefined}>
                      {pkg.description || <em className="text-muted">—</em>}
                    </div>
                  </td>
                  <td>{pkg.durationMonths}</td>
                  <td>${pkg.price.toFixed(2)}</td>
                  <td>
                    <Badge bg={pkg.isActive ? 'success' : 'secondary'}>
                      {pkg.isActive ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td>{formatDate(pkg.createdAt)}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(pkg)}
                      title="Edit package"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(pkg.id)}
                      title="Delete package"
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Package' : 'Add New Package'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={currentPackage.name || ''}
                onChange={(e) =>
                  setCurrentPackage({ ...currentPackage, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentPackage.description || ''}
                onChange={(e) =>
                  setCurrentPackage({ ...currentPackage, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Duration (months) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={currentPackage.durationMonths || 1}
                onChange={(e) =>
                  setCurrentPackage({
                    ...currentPackage,
                    durationMonths: parseInt(e.target.value) || 1,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Price <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={currentPackage.price || 0}
                onChange={(e) =>
                  setCurrentPackage({
                    ...currentPackage,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={currentPackage.isActive ?? true}
                onChange={(e) =>
                  setCurrentPackage({ ...currentPackage, isActive: e.target.checked })
                }
              />
            </Form.Group>
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

export default PackagesPage;