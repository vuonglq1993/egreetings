import { Container, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";

export default function Feedback() {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!msg.trim()) return;
    const list = JSON.parse(localStorage.getItem("feedback") || "[]");
    list.push({ message: msg, date: new Date().toLocaleDateString() });
    localStorage.setItem("feedback", JSON.stringify(list));
    setSent(true);
    setMsg("");
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <Container className="my-5">
      <h3>Send Feedback</h3>
      {sent && <Alert variant="success">Thank you!</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Your feedback</Form.Label>
          <Form.Control as="textarea" rows={4} value={msg} onChange={e => setMsg(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={submit}>Submit</Button>
      </Form>
    </Container>
  );
}