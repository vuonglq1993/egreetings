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
  const [saving, setSaving] = useState(false);

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

  // ------------------------------
  // SAVE RECIPIENTS (new API)
  // ------------------------------
  const saveEmails = async () => {
    setError("");

  

    const validEmails = emails.filter(e => e.includes("@"));
    if (validEmails.length < 10) {
      alert("At least 10 valid emails required");
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/subscription/save`,
        {
          
          RecipientEmails: validEmails
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOk(true);
      setTimeout(() => setOk(false), 3000);

      setEmails(Array(10).fill(""));
      setSelectedTemplateId(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loadingTemplates)
    return (
      <Spinner animation="border" variant="warning" className="d-block mx-auto my-5" />
    );

  return (
    <Container className="my-5">
      <Card className="shadow">
        <Card.Header className="bg-warning text-dark">
          <h4>Subscribe – Daily E-Card Service (Monthly)</h4>
        </Card.Header>
        <Card.Body>
          {ok && <Alert variant="success">Recipients saved successfully!</Alert>}
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

          

          <Button
            variant="success"
            onClick={saveEmails}
            className="mt-3"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Emails"}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
