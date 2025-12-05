// src/pages/Dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { apiGet } from '../../lib/api';
interface Counts {
  templates: number;
  users: number;
  transactions: number;
  subscriptions: number;
  categories: number;
  packages: number;
  feedbacks: number;
  reports: number;
}

interface Transaction {
  id: string | number;
  userName?: string;
  templateTitle?: string;
  recipientEmail?: string;
  price?: number;
  paymentMethod?: string;
  paymentStatus?: 'Completed' | 'Pending' | 'Failed' | string;
  sentAt?: string | null;
}

const DashboardPage: React.FC = () => {
  const [counts, setCounts] = useState<Counts>({
    templates: 0,
    users: 0,
    transactions: 0,
    subscriptions: 0,
    categories: 0,
    packages: 0,
    feedbacks: 0,
    reports: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load all counts
  const loadCounts = async () => {
    try {
      const [
        usersRes,
        categoriesRes,
        templatesRes,
        transactionsRes,
        packagesRes,
        subscriptionsRes,
        feedbacksRes,
        reportsRes,
      ] = await Promise.all([
        apiGet('api/users/with-relations').catch(() => []),
        apiGet('api/category').catch(() => []),
        apiGet('api/template').catch(() => []),
        apiGet('api/transaction/with-relations').catch(() => []),
        apiGet('api/package').catch(() => []),
        apiGet('api/subscription/my').catch(() => []),
        apiGet('api/feedback/with-user').catch(() => []),
        apiGet('api/report').catch(() => []),
      ]);

      setCounts({
        users: Array.isArray(usersRes) ? usersRes.length : 0,
        categories: Array.isArray(categoriesRes) ? categoriesRes.length : 0,
        templates: Array.isArray(templatesRes) ? templatesRes.length : 0,
        transactions: Array.isArray(transactionsRes) ? transactionsRes.length : 0,
        packages: Array.isArray(packagesRes) ? packagesRes.length : 0,
        subscriptions: Array.isArray(subscriptionsRes) ? subscriptionsRes.length : 0,
        feedbacks: Array.isArray(feedbacksRes) ? feedbacksRes.length : 0,
        reports: Array.isArray(reportsRes) ? reportsRes.length : 0,
      });
    } catch (err) {
      console.error('Error loading dashboard counts:', err);
    }
  };

  // Load recent transactions (latest 10)
  const loadRecentTransactions = async () => {
    try {
      const data: Transaction[] = await apiGet('api/transaction/with-relations');

      if (Array.isArray(data) && data.length > 0) {
        const sorted = data
          .sort((a, b) => {
            const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
            const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 10);

        setRecentTransactions(sorted);
      }
    } catch (err) {
      console.error('Error loading recent transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
    loadRecentTransactions();
  }, []);

  const getStatusVariant = (status?: string): string => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const statCards = [
    { title: 'Templates', count: counts.templates, icon: 'bi-card-text', color: 'primary', link: '/admin/templates' },
    { title: 'Users', count: counts.users, icon: 'bi-people', color: 'success', link: '/admin/users' },
    { title: 'Transactions', count: counts.transactions, icon: 'bi-cart', color: 'warning', link: '/admin/transactions' },
    { title: 'Subscriptions', count: counts.subscriptions, icon: 'bi-people-fill', color: 'danger', link: '/admin/subscriptions' },
    { title: 'Categories', count: counts.categories, icon: 'bi-tags', color: 'info' },
    { title: 'Packages', count: counts.packages, icon: 'bi-gift', color: 'secondary' },
    { title: 'Feedbacks', count: counts.feedbacks, icon: 'bi-chat-left-text', color: 'success' },
    { title: 'Reports', count: counts.reports, icon: 'bi-bar-chart', color: 'primary' },
  ];

  return (
    <>
      {/* Statistic Cards */}
      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col xl={3} md={6} key={index}>
            <Card className="h-100 shadow-sm border-0 card-stat text-center">
              <Card.Body className="p-4">
                <i className={`bi ${stat.icon} fs-1 text-${stat.color} mb-3`}></i>
                {stat.link ? (
                  <a href={stat.link} className="text-decoration-none text-dark d-block">
                    <h6 className="fw-bold text-uppercase mb-2">{stat.title}</h6>
                  </a>
                ) : (
                  <h6 className="fw-bold text-uppercase mb-2">{stat.title}</h6>
                )}
                <h3 className="mt-3 mb-0">{stat.count.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Transactions */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold">Recent Transactions</h5>
          <a href="/admin/transactions" className="btn btn-sm btn-outline-primary">
            View All
          </a>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading transactions...</p>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-5 text-muted">No transactions found</div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: '520px' }}>
              <Table hover className="mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    <th className="ps-4">#</th>
                    <th>ID</th>
                    <th>User</th>
                    <th>Template</th>
                    <th>Email</th>
                    <th>Price</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t, i) => (
                    <tr key={t.id}>
                      <td className="ps-4">{i + 1}</td>
                      <td className="fw-medium">#{t.id}</td>
                      <td>
                        <strong>{t.userName || 'N/A'}</strong>
                      </td>
                      <td>{t.templateTitle || 'N/A'}</td>
                      <td className="text-muted">{t.recipientEmail || 'N/A'}</td>
                      <td>
                        <strong className="text-primary">
                          ${t.price?.toFixed(2) || '0.00'}
                        </strong>
                      </td>
                      <td>{t.paymentMethod || <span className="text-muted">N/A</span>}</td>
                      <td>
                        <Badge bg={getStatusVariant(t.paymentStatus)}>
                          {t.paymentStatus || 'Pending'}
                        </Badge>
                      </td>
                      <td className="text-muted small">
                        {t.sentAt
                          ? new Date(t.sentAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default DashboardPage;