// src/pages/SendCard.jsx
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";

export default function SendCard() {
  const { id } = useParams();
  const { state } = useLocation();
  const personalizedImage = state?.personalizedImage;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Wishing you a wonderful day!");

  const handleSend = () => {
    alert(`The card has been sent to ${email}!\nLink: ${personalizedImage}`);
    // TODO: Call API to send real email
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 text-gold">Send Greeting Card</h2>

      {personalizedImage && (
        <Card className="mb-4 shadow">
          <Card.Img src={personalizedImage} />
        </Card>
      )}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Recipient Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="success" size="lg" onClick={handleSend}>
            Send Card Now
          </Button>
        </div>
      </Form>
    </Container>
  );
}
