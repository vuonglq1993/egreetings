import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Rect, Transformer } from "react-konva";
import { Button, Container, Spinner, Alert, Dropdown, Form } from "react-bootstrap";
import { HexColorPicker } from "react-colorful";
import { useParams, useNavigate } from "react-router-dom";
import useImage from "use-image";
import axios from "axios";
import html2canvas from "html2canvas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5018/api";

// High-quality sticker list (extendable)
const STICKERS = [
    "https://cdn-icons-png.flaticon.com/128/1047/1047549.png",
    "https://cdn-icons-png.flaticon.com/128/2581/2581901.png",
    "https://cdn-icons-png.flaticon.com/128/1828/1828887.png",
    "https://cdn-icons-png.flaticon.com/128/2965/2965358.png",
    "https://cdn-icons-png.flaticon.com/128/1057/1057080.png",
    "https://cdn-icons-png.flaticon.com/128/4380/4380589.png",
];

export default function EditCard() {
    const { id } = useParams();
    const navigate = useNavigate();
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

    // Load template image
    const [templateImage] = useImage(template?.imageUrl || "", "anonymous");

    // Hide color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowColorPicker(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Fetch template with relations
    useEffect(() => {
        axios
            .get(`${API_URL}/template/${id}/with-relations`)
            .then(res => setTemplate(res.data))
            .catch(() => alert("Failed to load template"))
            .finally(() => setLoading(false));
    }, [id]);

    // Add a new text element to the canvas
    const addText = () => {
        const newText = {
            id: `text-${Date.now()}`,
            text: "Happy Birthday!",
            x: 100,
            y: 100,
            fontSize,
            fill: textColor,
            fontFamily: "Dancing Script",
            fontStyle: "bold",
            draggable: true,
            shadowColor: "black",
            shadowBlur: 10,
            shadowOffset: { x: 5, y: 5 },
            shadowOpacity: 0.6,
        };
        setTexts(prev => [...prev, newText]);
        setSelectedId(newText.id);
    };

    // Add a sticker to the canvas
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
        setStickers(prev => [...prev, newSticker]);
        setSelectedId(newSticker.id);
    };

    // Sticker render component
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
                onClick={() => setSelectedId(sticker.id)}
                onTap={() => setSelectedId(sticker.id)}
                onDragEnd={(e) => {
                    sticker.x = e.target.x();
                    sticker.y = e.target.y();
                }}
                onTransformEnd={(e) => {
                    const node = e.target;
                    sticker.scaleX = node.scaleX();
                    sticker.scaleY = node.scaleY();
                    sticker.rotation = node.rotation();
                    sticker.width = node.width() * node.scaleX();
                    sticker.height = node.height() * node.scaleY();
                }}
            />
        );
    };

    // Export canvas as an image + upload to backend
    const handleExport = async () => {
        const node = stageRef.current?.container();
        if (!node) return alert("Cannot export!");

        try {
            const canvas = await html2canvas(node, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ecard-${id}-VIP.png`;
                a.click();
                URL.revokeObjectURL(url);

                const form = new FormData();
                form.append("file", blob, `card-${id}.png`);

                try {
                    const res = await axios.post(`${API_URL}/upload/personalized`, form);
                    navigate(`/send/${id}`, { state: { personalizedImage: res.data.url } });
                } catch (err) {
                    alert("Upload failed, but the file was still downloaded.");
                }
            }, "image/png");
        } catch (err) {
            console.error(err);
            alert("Export error!");
        }
    };

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="warning" size="lg" />
            </div>
        );

    if (!template) return <Alert variant="danger">Template does not exist</Alert>;

    const selectedNode = [...texts, ...stickers].find(item => item.id === selectedId);

    return (
        <Container fluid className="py-4 bg-dark text-light">
            {/* Toolbar */}
            <div className="bg-black p-3 rounded-4 shadow-lg mb-4">
                <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center">
                    <Button variant="warning" onClick={addText} className="fw-bold">
                        Add Text
                    </Button>

                    {/* Sticker selection dropdown */}
                    <Dropdown>
                        <Dropdown.Toggle variant="info" className="fw-bold">
                            Add Sticker
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-3">
                            <div className="d-flex flex-wrap gap-2">
                                {STICKERS.map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt="sticker"
                                        style={{ width: 60, height: 60, cursor: "pointer", borderRadius: 10 }}
                                        onClick={() => addSticker(src)}
                                    />
                                ))}
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Color Picker for text */}
                    <div className="position-relative d-inline-block">
                        <span className="me-2 text-white">Text Color:</span>
                        <div
                            className="border border-3 border-white rounded d-inline-block shadow"
                            style={{
                                backgroundColor: textColor,
                                width: 50,
                                height: 40,
                                cursor: "pointer",
                                boxShadow: "0 0 10px rgba(255,215,0,0.6)"
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowColorPicker(prev => !prev);
                            }}
                        />

                        {showColorPicker && (
                            <>
                                {/* Background overlay */}
                                <div
                                    className="position-fixed top-0 start-0 w-100 h-100"
                                    style={{ background: "rgba(0,0,0,0.5)", zIndex: 9998 }}
                                    onClick={() => setShowColorPicker(false)}
                                />

                                {/* Color Picker panel */}
                                <div
                                    className="position-absolute start-0 mt-2 shadow-lg rounded-4 overflow-hidden"
                                    style={{ zIndex: 9999, background: "#1a1a1a" }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-3">
                                        <HexColorPicker
                                            color={textColor}
                                            onChange={(newColor) => {
                                                setTextColor(newColor);
                                                if (selectedId && selectedNode?.id.includes("text")) {
                                                    setTexts(prev =>
                                                        prev.map(t =>
                                                            t.id === selectedId ? { ...t, fill: newColor } : t
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                        <div className="text-center mt-3">
                                            <Button size="sm" variant="outline-gold" onClick={() => setShowColorPicker(false)}>
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Font size slider */}
                    <Form.Range
                        min="20"
                        max="150"
                        step="2"
                        value={fontSize}
                        onChange={(e) => {
                            const newSize = Number(e.target.value);
                            setFontSize(newSize);
                            if (selectedId && selectedNode?.id.includes("text")) {
                                setTexts(prev =>
                                    prev.map(t =>
                                        t.id === selectedId ? { ...t, fontSize: newSize } : t
                                    )
                                );
                            }
                        }}
                        style={{ width: 180 }}
                    />
                    <span className="fw-bold ms-2">{fontSize}px</span>

                    {/* Delete selected item */}
                    <Button
                        variant="danger"
                        onClick={() =>
                            selectedNode &&
                            (selectedNode.id.includes("text")
                                ? setTexts(texts.filter(t => t.id !== selectedId))
                                : setStickers(stickers.filter(s => s.id !== selectedId)))
                        }
                    >
                        Delete
                    </Button>

                    {/* Export */}
                    <Button variant="success" size="lg" onClick={handleExport}>
                        Save & Send
                    </Button>
                </div>
            </div>

            {/* Canvas Panel */}
            <div className="d-flex justify-content-center">
                <div className="bg-black rounded-4 overflow-hidden shadow-lg border border-warning border-3">
                    <Stage width={800} height={600} ref={stageRef}>
                        <Layer>
                            {/* Background */}
                            <Rect width={800} height={600} fill={backgroundColor} />

                            {/* Template image */}
                            {templateImage && (
                                <KonvaImage image={templateImage} width={800} height={600} opacity={0.9} />
                            )}

                            {/* Stickers */}
                            {stickers.map(sticker => (
                                <StickerComponent key={sticker.id} sticker={sticker} />
                            ))}

                            {/* Text objects */}
                            {texts.map(text => (
                                <Text
                                    key={text.id}
                                    {...text}
                                    onClick={() => setSelectedId(text.id)}
                                    onTap={() => setSelectedId(text.id)}
                                    onDragEnd={(e) => {
                                        text.x = e.target.x();
                                        text.y = e.target.y();
                                    }}
                                    onTransformEnd={(e) => {
                                        const node = e.target;
                                        text.scaleX = node.scaleX();
                                        text.scaleY = node.scaleY();
                                        text.rotation = node.rotation();
                                    }}
                                />
                            ))}

                            {/* Transformer for resizing/rotating selected element */}
                            {selectedId && (
                                <Transformer
                                    attachedTo={stageRef.current?.findOne(`#${selectedId}`)}
                                    boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 ? oldBox : newBox)}
                                />
                            )}
                        </Layer>
                    </Stage>
                </div>
            </div>

            {/* Back navigation */}
            <div className="text-center mt-4">
                <Button variant="outline-light" size="lg" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>
        </Container>
    );
}
