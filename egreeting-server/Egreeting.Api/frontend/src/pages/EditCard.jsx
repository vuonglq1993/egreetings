import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Rect, Transformer } from "react-konva";
import { Button, Container, Spinner, Alert, Dropdown, Form, Modal } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useImage from "use-image";
import axios from "axios";
import html2canvas from "html2canvas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5018/api";

const STICKERS = [  
  "https://cdn-icons-png.flaticon.com/128/1047/1047549.png",
  "https://cdn-icons-png.flaticon.com/128/2581/2581901.png",
  "https://cdn-icons-png.flaticon.com/128/1828/1828887.png",
  "https://cdn-icons-png.flaticon.com/128/2965/2965358.png",
  "https://cdn-icons-png.flaticon.com/128/1057/1057080.png",
  "https://cdn-icons-png.flaticon.com/128/4380/4380589.png",
  // Birthday
  "https://cdn-icons-png.flaticon.com/512/1703/1703040.png",
  "https://cdn-icons-png.flaticon.com/512/3404/3404134.png",
  "https://cdn-icons-png.flaticon.com/512/1703/1703070.png",
  
  // Celebration
  "https://cdn-icons-png.flaticon.com/512/10232/10232540.png",
  "https://cdn-icons-png.flaticon.com/512/10232/10232538.png",
  
  // Holidays
  "https://cdn-icons-png.flaticon.com/512/2583/2583065.png",
  "https://cdn-icons-png.flaticon.com/512/2583/2583067.png",
];

export default function EditCardWithPay() {
  const { id } = useParams(); // template id
  const navigate = useNavigate();
  const location = useLocation();

  const stageRef = useRef(null);

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [selectedId, setSelectedId] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textColor, setTextColor] = useState("#ffd700");
  const [fontSize, setFontSize] = useState(48);
  const [isPaid, setIsPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Thêm state cho modal nhập text
  const [showTextModal, setShowTextModal] = useState(false);
  const [customText, setCustomText] = useState("");

  // Load template metadata
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/template/${id}/with-relations`).catch(() => null);
        if (res && res.data) setTemplate(res.data);
        else {
          const fallback = {
            id: Number(id),
            price: id === "2" ? 4.99 : 0,
            imageUrl: "/placeholder.jpg",
            title: "Demo",
          };
          setTemplate(fallback);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load template");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  // Check paid status from sessionStorage
  useEffect(() => {
    const paid = sessionStorage.getItem(`paid_template_${id}`);
    if (paid === "true") setIsPaid(true);
  }, [id]);

  const [templateImage] = useImage(template?.imageUrl || "", "anonymous");

  const addText = () => {
    // Hiển thị modal để nhập text
    setShowTextModal(true);
  };

  const handleAddCustomText = () => {
    if (!customText.trim()) {
      alert("Please enter some text");
      return;
    }

    const newText = {
      id: `text-${Date.now()}`,
      text: customText,
      x: 100,
      y: 100,
      fontSize,
      fill: textColor,
      fontFamily: "Dancing Script",
      draggable: true,
      shadowColor: "black",
      shadowBlur: 10,
      shadowOffset: { x: 5, y: 5 },
      shadowOpacity: 0.6,
    };
    setTexts((prev) => [...prev, newText]);
    setSelectedId(newText.id);
    setCustomText(""); // Reset input
    setShowTextModal(false); // Đóng modal
  };

  const addSticker = (src) => {
    const newSticker = {
      id: `sticker-${Date.now()}`,
      src,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      draggable: true,
      shadowColor: "black",
      shadowBlur: 20,
      shadowOffset: { x: 10, y: 10 },
      shadowOpacity: 0.8,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedId(newSticker.id);
  };

  const StickerComponent = ({ sticker }) => {
    const [image] = useImage(sticker.src, "anonymous");
    return (
      <KonvaImage
        image={image}
        x={sticker.x}
        y={sticker.y}
        width={sticker.width}
        height={sticker.height}
        draggable
        shadowColor={sticker.shadowColor}
        shadowBlur={sticker.shadowBlur}
        shadowOffset={sticker.shadowOffset}
        shadowOpacity={sticker.shadowOpacity}
        id={sticker.id}
        onClick={() => setSelectedId(sticker.id)}
        onTap={() => setSelectedId(sticker.id)}
        onDragEnd={(e) => {
          const updatedStickers = stickers.map(s => 
            s.id === sticker.id 
              ? { ...s, x: e.target.x(), y: e.target.y() }
              : s
          );
          setStickers(updatedStickers);
        }}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          const updatedStickers = stickers.map(s => 
            s.id === sticker.id 
              ? { 
                  ...s, 
                  scaleX, 
                  scaleY, 
                  rotation: node.rotation(),
                  width: node.width() * scaleX,
                  height: node.height() * scaleY
                }
              : s
          );
          setStickers(updatedStickers);
          
          // Reset scale to avoid cumulative scaling
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
    );
  };

  const handleExportAndUpload = async () => {
    const node = stageRef.current?.container();
    if (!node) return alert("Cannot export!");
    try {
      setProcessing(true);
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setProcessing(false);
          return;
        }
        const form = new FormData();
        form.append("file", blob, `card-${id}.png`);
        try {
          const res = await axios.post(`${API_URL.replace(/\/api$/, "")}/upload/personalized`, form);
          const url = res.data.url;
          navigate(`/send/${id}`, { state: { personalizedImage: url } });
        } catch (err) {
          console.error(err);
          alert("Upload failed - saved locally instead.");
        } finally {
          setProcessing(false);
        }
      }, "image/png");
    } catch (err) {
      console.error(err);
      setProcessing(false);
      alert("Export failed");
    }
  };

  // Pay flow
  const handlePayClick = async () => {
    if (!template) return alert("Template not loaded");
    try {
      setProcessing(true);
      const res = await axios.post(`${API_URL}/paypal/pay?templateId=${template.id}`);
      const approvalUrl = res.data.approval_url || res.data.approvalUrl;
      if (!approvalUrl) throw new Error("No approval url returned");
      
      // Lưu trạng thái hiện tại vào sessionStorage trước khi chuyển hướng
      const currentState = {
        texts,
        stickers,
        backgroundColor,
        textColor,
        fontSize
      };
      sessionStorage.setItem(`template_${id}_state`, JSON.stringify(currentState));
      
      window.location.href = approvalUrl;
    } catch (err) {
      console.error(err);
      if (err?.response) {
        const status = err.response.status;
        const data = err.response.data;
        alert(`Payment initiation failed (${status})${data ? `: ${JSON.stringify(data)}` : ""}`);
      } else {
        alert("Payment initiation failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  // Khôi phục trạng thái sau khi thanh toán thành công
  useEffect(() => {
    const savedState = sessionStorage.getItem(`template_${id}_state`);
    const paid = sessionStorage.getItem(`paid_template_${id}`);
    
    if (paid === "true" && savedState) {
      const state = JSON.parse(savedState);
      setTexts(state.texts || []);
      setStickers(state.stickers || []);
      setBackgroundColor(state.backgroundColor || "#ffffff");
      setTextColor(state.textColor || "#ffd700");
      setFontSize(state.fontSize || 48);
      setIsPaid(true);
      
      // Xóa state đã lưu sau khi khôi phục
      sessionStorage.removeItem(`template_${id}_state`);
    }
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" size="lg" />
      </div>
    );
  if (!template) return <Alert variant="danger">Template not found</Alert>;

  const selectedNode = [...texts, ...stickers].find((i) => i.id === selectedId);

  return (
    <Container fluid className="py-4 bg-dark text-light">
      {/* Modal nhập text */}
      <Modal show={showTextModal} onHide={() => setShowTextModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Add Text</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form.Group>
            <Form.Label>Enter your text:</Form.Label>
            <Form.Control
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type your message here..."
              className="bg-secondary text-white border-0"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomText();
                }
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowTextModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCustomText}>
            Add Text
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="bg-black p-3 rounded-4 shadow-lg mb-4">
        <div className="d-flex gap-3 align-items-center justify-content-center flex-wrap">
          <Button variant="warning" onClick={addText} className="fw-bold">
            Add Text
          </Button>

          <Dropdown>
            <Dropdown.Toggle variant="info" className="fw-bold">
              Add Sticker
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-3">
              <div className="d-flex gap-2">
                {STICKERS.map((s, i) => (
                  <img
                    key={i}
                    src={s}
                    alt="s"
                    width={60}
                    height={60}
                    style={{ cursor: "pointer", borderRadius: 10 }}
                    onClick={() => addSticker(s)}
                  />
                ))}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <div className="position-relative d-inline-block">
            <span className="me-2 text-white">Text Color:</span>
            <div
              className="border border-3 border-white rounded"
              style={{ backgroundColor: textColor, width: 50, height: 40, cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker((v) => !v);
              }}
            />
            {showColorPicker && (
              <>
                <div className="position-fixed" style={{ inset: 0, zIndex: 9998 }} onClick={() => setShowColorPicker(false)} />
                <div className="position-absolute mt-2" style={{ zIndex: 9999 }} onClick={(e) => e.stopPropagation()}>
                  <HexColorPicker
                    color={textColor}
                    onChange={(c) => {
                      setTextColor(c);
                      if (selectedId && selectedNode?.id.includes("text")) {
                        setTexts((prev) => prev.map((t) => (t.id === selectedId ? { ...t, fill: c } : t)));
                      }
                    }}
                  />
                  <div className="text-center mt-2">
                    <Button size="sm" variant="outline-light" onClick={() => setShowColorPicker(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Form.Range
            min="20"
            max="150"
            step="2"
            value={fontSize}
            onChange={(e) => {
              const v = Number(e.target.value);
              setFontSize(v);
              if (selectedId && selectedNode?.id.includes("text")) {
                setTexts((prev) => prev.map((t) => (t.id === selectedId ? { ...t, fontSize: v } : t)));
              }
            }}
            style={{ width: 180 }}
          />
          <span className="fw-bold ms-2">{fontSize}px</span>

          <Button
            variant="danger"
            onClick={() => {
              if (!selectedNode) return;
              if (selectedNode.id.includes("text")) setTexts(texts.filter((t) => t.id !== selectedId));
              else setStickers(stickers.filter((s) => s.id !== selectedId));
              setSelectedId(null);
            }}
          >
            Delete
          </Button>

          {/* Primary action: Pay or Save & Send */}
          {template.price > 0 && !isPaid ? (
            <Button variant="success" size="lg" onClick={handlePayClick} disabled={processing}>
              {processing ? "Processing..." : `Pay $${Number(template.price).toFixed(2)}`}
            </Button>
          ) : (
            <Button variant="success" size="lg" onClick={handleExportAndUpload} disabled={processing}>
              {processing ? "Processing..." : "Save & Send"}
            </Button>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="bg-black rounded-4 overflow-hidden shadow-lg border border-warning border-3">
          <Stage width={800} height={600} ref={stageRef}>
            <Layer>
              <Rect width={800} height={600} fill={backgroundColor} />
              {templateImage && <KonvaImage image={templateImage} width={800} height={600} opacity={0.9} />}
              {stickers.map((s) => (
                <StickerComponent key={s.id} sticker={s} />
              ))}
              {texts.map((t) => (
                <Text
                  key={t.id}
                  {...t}
                  id={t.id}
                  onClick={() => setSelectedId(t.id)}
                  onTap={() => setSelectedId(t.id)}
                  onDragEnd={(e) => {
                    const updatedTexts = texts.map(text => 
                      text.id === t.id 
                        ? { ...text, x: e.target.x(), y: e.target.y() }
                        : text
                    );
                    setTexts(updatedTexts);
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    
                    const updatedTexts = texts.map(text => 
                      text.id === t.id 
                        ? { 
                            ...text, 
                            scaleX, 
                            scaleY, 
                            rotation: node.rotation()
                          }
                        : text
                    );
                    setTexts(updatedTexts);
                    
                    // Reset scale to avoid cumulative scaling
                    node.scaleX(1);
                    node.scaleY(1);
                  }}
                />
              ))}
              {selectedId && (
                <Transformer
                  nodes={[stageRef.current?.findOne(`#${selectedId}`)].filter(Boolean)}
                  boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 ? oldBox : newBox)}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="text-center mt-4">
        <Button variant="outline-light" size="lg" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </Container>
  );
}