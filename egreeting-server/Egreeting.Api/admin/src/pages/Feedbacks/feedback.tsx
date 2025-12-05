// src/pages/Feedbacks/index.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { apiGet, apiDelete } from '@/lib/api';

interface User {
  fullName?: string;
  email?: string;
}

interface Feedback {
  id: number;
  message: string;
  createdAt: string;
  user?: User | null;
}

const FeedbacksPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Feedback[]>('api/feedback/with-user');
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load feedback data');
      console.error('Load feedbacks error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await apiDelete(`api/feedback/${id}`); // Fixed template string
      alert('Feedback deleted successfully!');
      loadFeedbacks();
    } catch (err: any) {
      console.error('Delete feedback error:', err);
      alert('Error: ' + (err.message || 'Could not delete feedback'));
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
        <h2>Feedback Management</h2>
        <Badge bg="primary" className="fs-5">
          Total: {feedbacks.length}
        </Badge>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading feedback...</p>
        </div>
      )}

      {/* Error State */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Empty State */}
      {!loading && !error && feedbacks.length === 0 && (
        <Alert variant="info" className="text-center">
          No feedback yet. When users submit feedback, it will appear here.
        </Alert>
      )}

      {/* Feedback Table */}
      {!loading && feedbacks.length > 0 && (
        <div className="table-responsive">
          <Table striped hover bordered className="align-middle">
            <thead className="table-light">
              <tr>
                <th width="60">#</th>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Message</th>
                <th>Created At</th>
                <th width="100" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={fb.id}>
                  <td>{index + 1}</td>
                  <td className="fw-bold">#{fb.id}</td>
                  <td>{fb.user?.fullName || <em className="text-muted">Guest</em>}</td>
                  <td>{fb.user?.email || <span className="text-danger">N/A</span>}</td>
                  <td style={{ maxWidth: '300px' }}>
                    <div className="text-truncate" title={fb.message}>
                      {fb.message || '—'}
                    </div>
                  </td>
                  <td>{formatDate(fb.createdAt)}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(fb.id)}
                      title="Delete feedback"
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
    </>
  );
};

export default FeedbacksPage;