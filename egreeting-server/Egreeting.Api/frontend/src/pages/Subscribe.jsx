import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";

export default function Subscribe() {
  const [emails, setEmails] = useState(Array(10).fill(""));
  const [ok, setOk] = useState(false);

  const change = (i, v) => {
    const copy = [...emails];
    copy[i] = v;
    setEmails(copy);
  };

  const submit = () => {
    const valid = emails.filter(e => e.includes("@")).length;
    if (valid >= 10) {
      setOk(true);
      setTimeout(() => setOk(false), 3000);
      // In real app: call payment gateway
    } else alert("At least 10 valid emails required");
  };

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-warning text-dark">
          <h4>Subscribe – Daily E-Card Service (Monthly)</h4>
        </Card.Header>
        <Card.Body>
          {ok && <Alert variant="success">Subscription request sent!</Alert>}
          <p>Enter at least 10 recipient emails.</p>
          {emails.map((e, i) => (
            <Form.Group key={i} className="mb-2">
              <Form.Control
                type="email"
                placeholder={`Email ${i + 1}`}
                value={e}
                onChange={ev => change(i, ev.target.value)}
              />
            </Form.Group>
          ))}
          <Button variant="primary" onClick={submit}>Subscribe (Pay)</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}