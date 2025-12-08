// FILE: src/pages/EditCard.jsx
// Full version: Export JPG + Save local + Redirect (no upload)
// + Color Picker for text
// + Premium sticker collection

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Rect } from "react-konva";
import { Button, Container, Spinner, Alert, Dropdown, Form, Modal } from "react-bootstrap";
import useImage from "use-image";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import { HexColorPicker } from "react-colorful";

const API_URL = import.meta.env.VITE_API_URL;

// NEW: Fancy sticker library
const STICKERS = [
  // Cute hearts
  "https://cdn-icons-png.flaticon.com/512/2589/2589175.png",
  "https://cdn-icons-png.flaticon.com/512/2107/2107957.png",

  // Balloons
  "https://cdn-icons-png.flaticon.com/512/869/869869.png",
  "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",

  // Gift & ribbons
  "https://cdn-icons-png.flaticon.com/512/2541/2541988.png",
  "https://cdn-icons-png.flaticon.com/512/2541/2541983.png",

  // Sparkles
  "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  "https://cdn-icons-png.flaticon.com/512/2107/2107929.png",

  // Flowers
  "https://cdn-icons-png.flaticon.com/512/869/869869.png",
  "https://cdn-icons-png.flaticon.com/512/744/744465.png",

  // Fireworks
  "https://cdn-icons-png.flaticon.com/512/993/993928.png",
  "https://cdn-icons-png.flaticon.com/512/993/993934.png",
];

export default function EditCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stageRef = useRef(null);

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [texts, setTexts] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const [textColor, setTextColor] = useState("#ffd700");
  const [fontSize, setFontSize] = useState(48);

  const [showTextModal, setShowTextModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [customText, setCustomText] = useState("");

  const [isPaid, setIsPaid] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/template/${id}/with-relations`);
        setTemplate(res.data);
      } catch {
        setTemplate({
          id,
          price: 0,
          imageUrl: "/placeholder.jpg",
          title: "Card",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Restore saved editor state
  useEffect(() => {
    const saved = sessionStorage.getItem(`template_state_${id}`);
    const paid = sessionStorage.getItem(`paid_template_${id}`);
    const auto = sessionStorage.getItem(`auto_export_${id}`);

    if (saved) {
      const s = JSON.parse(saved);
      setTexts(s.texts || []);
      setStickers(s.stickers || []);
      setBackgroundColor(s.bg || "#fff");
      setTextColor(s.textColor || "#ffd700");
      setFontSize(s.fontSize || 48);
    }

    if (paid === "true") setIsPaid(true);

    if (auto === "true") {
      sessionStorage.removeItem(`auto_export_${id}`);
      setTimeout(() => handleExport(), 300);
    }
  }, [id]);

  const [templateImage] = useImage(template?.imageUrl || "", "anonymous");

  const addText = () => setShowTextModal(true);

  const handleAddCustomText = () => {
    if (!customText.trim()) return;

    const t = {
      id: `text-${Date.now()}`,
      text: customText,
      x: 100,
      y: 100,
      fontSize,
      fill: textColor,
      fontFamily: "Dancing Script",
      draggable: true,
      shadowColor: "black",
      shadowBlur: 8,
      shadowOffset: { x: 4, y: 4 },
      shadowOpacity: 0.7,
    };

    setTexts(prev => [...prev, t]);
    setSelectedId(t.id);
    setCustomText("");
    setShowTextModal(false);
  };

  const addSticker = (src) => {
    const s = {
      id: `sticker-${Date.now()}`,
      src,
      x: 200,
      y: 200,
      width: 120,
      height: 120,
      draggable: true,
    };
    setStickers(prev => [...prev, s]);
    setSelectedId(s.id);
  };

  const exportCanvas = useCallback(async () => {
    const node = stageRef.current?.container();
    if (!node) return null;

    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });

    return canvas.toDataURL("image/jpeg", 0.95);
  }, []);

  const handleSaveFree = () => {
    navigate(`/send/${id}`, {
      state: { personalizedImage: null, freeMode: true },
    });
  };

  const handleExport = useCallback(async () => {
    setProcessing(true);

    const jpg = await exportCanvas();

    if (jpg) {
      sessionStorage.setItem(`edited_card_${id}`, jpg);

      const a = document.createElement("a");
      a.href = jpg;
      a.download = `ecard-${id}.jpg`;
      a.click();
    }

    setProcessing(false);

    navigate(`/send/${id}`, { state: { personalizedImage: jpg } });
  }, [id, exportCanvas, navigate]);

  const handlePayClick = async () => {
    if (!template) return;
    setProcessing(true);

    sessionStorage.setItem(
      `template_state_${id}`,
      JSON.stringify({
        texts,
        stickers,
        bg: backgroundColor,
        textColor,
        fontSize,
      })
    );

    try {
      const res = await axios.post(`${API_URL}/paypal/pay?templateId=${template.id}`);
      window.location.href = res.data.approval_url;
    } catch {
      alert("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner/></div>;
  if (!template) return <Alert>Error loading template.</Alert>;

  return (
    <Container fluid className="py-4 bg-dark text-light">

      {/* ADD TEXT MODAL */}
      <Modal show={showTextModal} onHide={() => setShowTextModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Add Text</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form.Control
            className="bg-secondary text-light"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowTextModal(false)}>Cancel</Button>
          <Button onClick={handleAddCustomText}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* TOOLBAR */}
      <div className="d-flex justify-content-center gap-3 mb-3">

        <Button onClick={addText}>Add Text</Button>

        {/* COLOR PICKER */}
        <Button
          variant="warning"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          Text Color
        </Button>

        {showColorPicker && (
          <div
            style={{
              position: "absolute",
              marginTop: 60,
              zIndex: 10,
              padding: 10,
              background: "#222",
              borderRadius: 10,
            }}
          >
            <HexColorPicker
              color={textColor}
              onChange={color => {
                setTextColor(color);
                if (selectedId?.includes("text")) {
                  setTexts(prev =>
                    prev.map(t =>
                      t.id === selectedId ? { ...t, fill: color } : t
                    )
                  );
                }
              }}
            />
          </div>
        )}

        {/* STICKERS */}
        <Dropdown>
          <Dropdown.Toggle>Add Sticker</Dropdown.Toggle>
          <Dropdown.Menu className="p-2" style={{ maxHeight: 250, overflow: "auto" }}>
            {STICKERS.map((s, i) => (
              <img
                key={i}
                src={s}
                style={{ width: 70, margin: 6, cursor: "pointer" }}
                onClick={() => addSticker(s)}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {/* FONT SIZE */}
        <Form.Range
          min={20}
          max={140}
          value={fontSize}
          onChange={(e) => {
            const v = Number(e.target.value);
            setFontSize(v);

            if (selectedId?.includes("text")) {
              setTexts(prev =>
                prev.map(t =>
                  t.id === selectedId ? { ...t, fontSize: v } : t
                )
              );
            }
          }}
        />

        {/* DELETE */}
        <Button
          variant="danger"
          onClick={() => {
            if (!selectedId) return;

            if (selectedId.includes("text"))
              setTexts(prev => prev.filter(t => t.id !== selectedId));
            else
              setStickers(prev => prev.filter(s => s.id !== selectedId));

            setSelectedId(null);
          }}
        >
          Delete
        </Button>

        {/* PAY / SAVE */}
        {template.price > 0 && !isPaid ? (
          <Button onClick={handlePayClick} disabled={processing}>
            {processing ? "Processing..." : `Pay $${template.price}`}
          </Button>
        ) : template.price === 0 ? (
          <Button onClick={handleSaveFree}>Save & Send</Button>
        ) : (
          <Button onClick={handleExport} disabled={processing}>
            {processing ? "Exporting..." : "Save & Send"}
          </Button>
        )}
      </div>

      {/* CANVAS */}
      <div className="d-flex justify-content-center">
        <Stage width={800} height={600} ref={stageRef}>
          <Layer>
            <Rect width={800} height={600} fill={backgroundColor} />

            {templateImage && (
              <KonvaImage image={templateImage} width={800} height={600} />
            )}

            {stickers.map(s => {
              const [img] = useImage(s.src);
              return (
                <KonvaImage
                  key={s.id}
                  image={img}
                  {...s}
                  onClick={() => setSelectedId(s.id)}
                  draggable
                />
              );
            })}

            {texts.map(t => (
              <Text
                key={t.id}
                {...t}
                onClick={() => setSelectedId(t.id)}
                draggable
              />
            ))}
          </Layer>
        </Stage>
      </div>

    </Container>
  );
}
