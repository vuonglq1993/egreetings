// src/pages/Reports/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Spinner,
  Alert,
  Badge,
  Card,
  Form,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { apiGet } from '@/lib/api';

interface DailyReport {
  reportDate: string; // YYYY-MM-DD
  totalTransactions: number;
  totalRevenue: number;
  activeSubscriptions: number;
  newSubscriptions: number;
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactions, subscriptions] = await Promise.all([
        apiGet<any[]>('api/transaction/'),
        apiGet<any[]>('api/subscription/'),
      ]);

      const reportMap = new Map<string, DailyReport>();

      // Process transactions
      transactions.forEach((t) => {
        const date = t.sentAt?.split('T')[0];
        if (!date) return;

        if (!reportMap.has(date)) {
          reportMap.set(date, {
            reportDate: date,
            totalTransactions: 0,
            totalRevenue: 0,
            activeSubscriptions: 0,
            newSubscriptions: 0,
          });
        }
        const r = reportMap.get(date)!;
        r.totalTransactions += 1;
        r.totalRevenue += Number(t.price || 0);
      });

      // Process subscriptions
      subscriptions.forEach((sub) => {
        const start = sub.startDate?.split('T')[0];
        const end = sub.endDate?.split('T')[0];
        if (!start || !end) return;

        let current = new Date(start);
        const endDateObj = new Date(end);

        while (current <= endDateObj) {
          const dateStr = current.toISOString().split('T')[0];
          if (!reportMap.has(dateStr)) {
            reportMap.set(dateStr, {
              reportDate: dateStr,
              totalTransactions: 0,
              totalRevenue: 0,
              activeSubscriptions: 0,
              newSubscriptions: 0,
            });
          }
          const r = reportMap.get(dateStr)!;
          r.activeSubscriptions += 1;
          if (dateStr === start) r.newSubscriptions += 1;
          current.setDate(current.getDate() + 1);
        }
      });

      const allReports = Array.from(reportMap.values())
        .sort((a, b) => b.reportDate.localeCompare(a.reportDate));

      setReports(allReports);
      setFilteredReports(allReports);

      // Set default date range: last 30 days
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setStartDate(thirtyDaysAgo);
      setEndDate(today);
    } catch (err: any) {
      setError(err.message || 'Failed to generate reports');
      console.error('Generate reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Filter by date range
  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter((r) => {
      return r.reportDate >= startDate && r.reportDate <= endDate;
    });

    setFilteredReports(filtered);
  }, [startDate, endDate, reports]);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date cannot be earlier than start date.');
      return;
    }
    // Trigger re-filter via useEffect
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    setStartDate(thirtyDaysAgo);
    setEndDate(today);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalRevenue = filteredReports.reduce((sum, r) => sum + r.totalRevenue, 0);
  const totalTransactions = filteredReports.reduce((sum, r) => sum + r.totalTransactions, 0);
  const totalNewSubs = filteredReports.reduce((sum, r) => sum + r.newSubscriptions, 0);
  const currentActiveSubs = filteredReports.length > 0 ? filteredReports[0].activeSubscriptions : 0;

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Daily Revenue & Activity Reports</h2>
        <Badge bg="success" className="fs-5">
          {filteredReports.length} Days
        </Badge>
      </div>

      {/* Filter Bar */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </Col>
            <Col md={6}>
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={handleFilter}>
                  Apply Filter
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                  Last 30 Days
                </Button>
                <Button variant="outline-danger" onClick={() => { setStartDate(''); setEndDate(''); }}>
                  Clear
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Generating reports...</p>
        </div>
      )}

      {/* Error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Empty */}
      {!loading && !error && filteredReports.length === 0 && (
        <Alert variant="info" className="text-center">
          No data in selected date range.
        </Alert>
      )}

      {/* Report Table */}
      {!loading && filteredReports.length > 0 && (
        <Card className="shadow-sm">
          <Card.Body>
            <div className="table-responsive">
              <Table hover bordered className="align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Date</th>
                    <th>Transactions</th>
                    <th>Revenue</th>
                    <th>New Subs</th>
                    <th>Active Subs</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((r) => (
                    <tr key={r.reportDate}>
                      <td className="fw-bold">{formatDate(r.reportDate)}</td>
                      <td className="text-center">
                        <Badge bg="info" pill>{r.totalTransactions}</Badge>
                      </td>
                      <td className="text-success fw-bold">
                        ${r.totalRevenue.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <Badge bg="primary">+{r.newSubscriptions}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="success">{r.activeSubscriptions}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light fw-bold fs-6">
                  <tr>
                    <td><strong>Total (Filtered)</strong></td>
                    <td className="text-center text-primary">{totalTransactions}</td>
                    <td className="text-success">${totalRevenue.toFixed(2)}</td>
                    <td className="text-center text-primary">+{totalNewSubs}</td>
                    <td className="text-center text-danger">
                      Current: {currentActiveSubs}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default ReportsPage;