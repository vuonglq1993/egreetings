// src/pages/Feedback.tsx
import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Row, Col, Card } from "react-bootstrap";

export default function Feedback() {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const submit = async () => {
    if (!msg.trim()) {
      setError("Please enter your feedback before submitting.");
      return;
    }
    if (!currentUser) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post(`${(import.meta as any).env.VITE_API_URL}/feedback`, {
        message: msg,
        userId: currentUser.id,
      });

      setSent(true);
      setMsg("");
      setTimeout(() => setSent(false), 3000); // Hiển thị alert 3s
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <h3 className="text-center mb-4">Send Feedback</h3>

            {sent && (
              <Alert variant="success" className="text-center">
                Thank you for your feedback!
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Your feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Share your thoughts..."
                />
              </Form.Group>

              <div className="text-center">
                <Button
                  variant="primary"
                  onClick={submit}
                  disabled={!msg.trim() || loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
