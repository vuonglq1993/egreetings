// src/pages/Subscriptions/index.tsx
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

interface Subscription {
  id: number;
  userId: number;
  userName: string;
  packageId: number;
  packageName: string;
  startDate: string; // ISO date
  endDate: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  isActive: boolean;
  createdAt: string;
}

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Partial<Subscription>>({
    userId: 0,
    packageId: 0,
    startDate: '',
    endDate: '',
    paymentStatus: 'Pending',
    isActive: true,
  });

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Subscription[]>('api/subscription/');
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscriptions');
      console.error('Load subscriptions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);



  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSubscription({
      userId: 0,
      packageId: 0,
      startDate: '',
      endDate: '',
      paymentStatus: 'Pending',
      isActive: true,
    });
  };

  const handleSave = async () => {
    if (!currentSubscription.packageId || !currentSubscription.startDate || !currentSubscription.endDate) {
      alert('Please fill in Package ID, Start Date, and End Date.');
      return;
    }

    if (new Date(currentSubscription.endDate!) < new Date(currentSubscription.startDate!)) {
      alert('End Date cannot be earlier than Start Date.');
      return;
    }

    try {
      const payload = {
        userId: currentSubscription.userId || null,
        packageId: Number(currentSubscription.packageId),
        startDate: currentSubscription.startDate,
        endDate: currentSubscription.endDate,
        paymentStatus: currentSubscription.paymentStatus || 'Pending',
        isActive: currentSubscription.isActive ?? true,
      };

      if (isEditMode && currentSubscription.id) {
        await apiPut(`api/subscription/${currentSubscription.id}`, payload);
        alert('Subscription updated successfully!');
      } else {
        await apiPost('api/subscription/create', payload);
        alert('Subscription created successfully!');
      }

      handleCloseModal();
      loadSubscriptions();
    } catch (err: any) {
      console.error('Save subscription error:', err);
      alert('Error: ' + (err.message || 'Could not save subscription'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await apiDelete(`api/subscription/${id}`);
      alert('Subscription deleted successfully!');
      loadSubscriptions();
    } catch (err: any) {
      console.error('Delete subscription error:', err);
      alert('Error: ' + (err.message || 'Could not delete subscription'));
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'danger';
      case 'Refunded': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString: string) => {
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
        <h2>Subscriptions Management</h2>
        <Stack direction="horizontal" gap={3}>
          <Badge bg="primary" className="fs-5 align-self-center">
            Total: {subscriptions.length}
          </Badge>

        </Stack>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading subscriptions...</p>
        </div>
      )}

      {/* Error State */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Empty State */}
      {!loading && !error && subscriptions.length === 0 && (
        <Alert variant="info" className="text-center">
          No subscriptions found.
        </Alert>
      )}

      {/* Subscriptions Table */}
      {!loading && subscriptions.length > 0 && (
        <div className="table-responsive">
          <Table striped hover bordered className="align-middle">
            <thead className="table-light">
              <tr>
                <th width="60">#</th>
                <th>ID</th>
                <th>User</th>
                <th>Package</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Payment Status</th>
                <th>Active</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub, i) => (
                <tr key={sub.id}>
                  <td>{i + 1}</td>
                  <td className="fw-bold">#{sub.id}</td>
                  <td>{sub.userName || <em className="text-muted">—</em>}</td>
                  <td>{sub.packageName || <em className="text-muted">—</em>}</td>
                  <td>{formatDate(sub.startDate)}</td>
                  <td>{formatDate(sub.endDate)}</td>
                  <td>
                    <Badge bg={getPaymentStatusColor(sub.paymentStatus)}>
                      {sub.paymentStatus}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={sub.isActive ? 'success' : 'secondary'}>
                      {sub.isActive ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td>{formatDateTime(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}


    </>
  );
};

export default SubscriptionsPage;