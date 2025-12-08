import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function SendCard() {
  const { id: templateId } = useParams();
  const location = useLocation();

  const personalizedImageUrl = location.state?.personalizedImage || null;

  const [savedEmails, setSavedEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ---------------------------------------------------
  //  LOAD TEMPLATE + 10 SAVED EMAILS
  // ---------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        // load template
        const t = await axios.get(`${API_URL}/template/${templateId}`);
        setTemplate(t.data);

        // load emails
        const r = await axios.get(`${API_URL}/subscription/recipients`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSavedEmails(r.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [templateId]);

  // ---------------------------------------------------
  //  SEND EMAIL TO SELECTED RECIPIENT
  // ---------------------------------------------------
  const send = async () => {
    if (!selectedEmail) {
      alert("Please select a recipient email.");
      return;
    }

    setSending(true);
    setError("");

    try {
      await axios.post(
        `${API_URL}/subscription/send-one`,
        {
          TemplateId: parseInt(templateId),
          RecipientEmails: [selectedEmail], // only 1 email
          PersonalizedImageUrl: personalizedImageUrl || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOk(true);
      setTimeout(() => setOk(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Send failed");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return <Spinner animation="border" variant="warning" className="d-block mx-auto my-5" />;

  if (!template) return <Alert variant="danger">Template not found</Alert>;

  return (
    <Container className="my-5" style={{ maxWidth: "700px" }}>
      <Card className="shadow">
        <Card.Header className="bg-warning text-dark">
          <h4>Send Your E-Card</h4>
        </Card.Header>

        <Card.Body>
          {ok && <Alert variant="success">Email sent successfully!</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <h5 className="mb-3">Template: <b>{template.title}</b></h5>

          <div className="text-center mb-3">
            <img
              src={personalizedImageUrl || template.imageUrl}
              alt="preview"
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "10px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.3)"
              }}
            />
          </div>

          {/* EMAIL DROPDOWN */}
          <Form.Group className="mb-3">
            <Form.Label>Select Recipient Email</Form.Label>
            <Form.Select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
            >
              <option value="">-- Choose Email --</option>
              {savedEmails.map((email, i) => (
                <option key={i} value={email}>
                  {email}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button
            className="mt-3"
            variant="success"
            disabled={sending}
            onClick={send}
          >
            {sending ? "Sending..." : "Send E-Card"}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
