import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

export default function Subscribe() {
  const [emails, setEmails] = useState(Array(10).fill(""));
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");

  // Lấy tất cả template
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/template`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load templates");
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  const changeEmail = (i, v) => {
    const copy = [...emails];
    copy[i] = v;
    setEmails(copy);
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const sendEmails = async () => {
    setError("");
    if (!selectedTemplate) {
      alert("Please select a template first");
      return;
    }

    const validEmails = emails.filter(e => e.includes("@"));
    if (validEmails.length < 10) {
      alert("At least 10 valid emails required");
      return;
    }

    setSending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/subscription/send`,
        {
          TemplateId: selectedTemplate.id,
          RecipientEmails: validEmails,
          PersonalizedImageUrl: selectedTemplate.imageUrl // gửi luôn ảnh template
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOk(true);
      setTimeout(() => setOk(false), 3000);

      setEmails(Array(10).fill(""));
      setSelectedTemplateId(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Sending failed");
    } finally {
      setSending(false);
    }
  };

  if (loadingTemplates) return <Spinner animation="border" variant="warning" className="d-block mx-auto my-5" />;

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-warning text-dark">
          <h4>Subscribe – Daily E-Card Service (Monthly)</h4>
        </Card.Header>
        <Card.Body>
          {ok && <Alert variant="success">Emails sent successfully!</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <p>Enter at least 10 recipient emails:</p>
          {emails.map((e, i) => (
            <Form.Group key={i} className="mb-2">
              <Form.Control
                type="email"
                placeholder={`Email ${i + 1}`}
                value={e}
                onChange={ev => changeEmail(i, ev.target.value)}
              />
            </Form.Group>
          ))}

          <p>Select a template:</p>
          {templates.map(t => (
            <Form.Check
              key={t.id}
              type="radio"
              label={t.title}
              name="template"
              checked={selectedTemplateId === t.id}
              onChange={() => setSelectedTemplateId(t.id)}
            />
          ))}

          {selectedTemplate && (
            <div className="mt-3 text-center">
              <h6>Template Preview:</h6>
              <img
                src={selectedTemplate.imageUrl || "/placeholder.jpg"}
                alt={selectedTemplate.title}
                style={{ maxWidth: "100%", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
            </div>
          )}

          <Button
            variant="success"
            onClick={sendEmails}
            className="mt-3"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send E-Cards Now"}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
