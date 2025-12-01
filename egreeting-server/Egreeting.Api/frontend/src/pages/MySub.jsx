import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

export default function MySub() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/subscription/my`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setSub(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
        setSub(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!sub) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="info">
          You don’t have any active subscription.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: 600 }}>
      <Card className="shadow-lg p-4 rounded-4">
        <h2 className="text-center fw-bold mb-4">My Subscription</h2>

        <h4 className="text-primary fw-bold">{sub.packageName}</h4>
        <p className="text-muted">{sub.description}</p>

        <p className="fw-bold">
          Price: <span className="text-success">${sub.price}</span>
        </p>

        <p>
          Start date: <strong>{new Date(sub.startDate).toLocaleDateString()}</strong>
        </p>
        <p>
          Expire date: <strong>{new Date(sub.endDate).toLocaleDateString()}</strong>
        </p>

        <p
          className={`fw-bold ${
            sub.isExpired ? "text-danger" : "text-success"
          }`}
        >
          Status: {sub.isExpired ? "Expired" : "Active"}
        </p>
      </Card>
    </Container>
  );
}
