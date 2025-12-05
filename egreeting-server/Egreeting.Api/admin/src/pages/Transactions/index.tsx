// src/pages/Transactions/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Spinner,
  Alert,
  Badge,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { apiGet } from '@/lib/api';

interface Transaction {
  id: number;
  userName: string;
  templateTitle: string;
  recipientEmail: string;
  subject?: string | null;
  message?: string | null;
  price: number;
  paymentMethod?: string | null;
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  sentAt: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Transaction[]>('api/transaction/with-relations');
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
      console.error('Load transactions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'danger';
      case 'Refunded': return 'info';
      default: return 'secondary';
    }
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

  const truncate = (text: string | null | undefined, length: number) =>
    text && text.length > length ? text.substring(0, length) + '...' : text || '—';

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transactions History</h2>
        <Badge bg="primary" className="fs-5">
          Total: {transactions.length}
        </Badge>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading transactions...</p>
        </div>
      )}

      {/* Error State */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Empty State */}
      {!loading && !error && transactions.length === 0 && (
        <Alert variant="info" className="text-center">
          No transactions found.
        </Alert>
      )}

      {/* Transactions Table - Read Only */}
      {!loading && transactions.length > 0 && (
        <div className="table-responsive">
          <Table striped hover bordered className="align-middle">
            <thead className="table-light">
              <tr>
                <th width="60">#</th>
                <th>ID</th>
                <th>User</th>
                <th>Template</th>
                <th>Recipient</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Price</th>
                <th>Method</th>
                <th>Status</th>
                <th>Sent At</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td className="fw-bold">#{t.id}</td>
                  <td>{t.userName || <em className="text-muted">—</em>}</td>
                  <td>{t.templateTitle || <em className="text-muted">—</em>}</td>
                  <td>{t.recipientEmail}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{t.subject || 'No subject'}</Tooltip>}
                    >
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                        {truncate(t.subject, 30)}
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{t.message || 'No message'}</Tooltip>}
                    >
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                        {truncate(t.message, 50)}
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <strong>${t.price.toFixed(2)}</strong>
                  </td>
                  <td>{t.paymentMethod || <em className="text-muted">—</em>}</td>
                  <td>
                    <Badge bg={getPaymentStatusColor(t.paymentStatus)}>
                      {t.paymentStatus || 'Pending'}
                    </Badge>
                  </td>
                  <td>{formatDateTime(t.sentAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default TransactionsPage;