// File: src/pages/Editor.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';

type Template = {
  id: number;
  categoryId: number;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  category?: {
    id: number;
    name?: string;
  };
};

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [text, setText] = useState('Your message here');
  const [fontSize, setFontSize] = useState(28);
  const [uploaded, setUploaded] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get<Template>(`/api/Template/${id}`)
      .then(res => {
        setCard(res.data);
        setText(res.data.title); // default text = template title
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!card) return <div style={{ padding: 24 }}>Editor: card not found.</div>;

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setUploaded(reader.result as string);
    reader.readAsDataURL(f);
  };

  const onDownload = async () => {
    if (!canvasRef.current) return;
    const node = canvasRef.current;
    const canvas = await html2canvas(node, { useCORS: true });

    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${card.id}-custom.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px', display: 'flex', gap: 24 }}>
      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <div
          ref={canvasRef}
          style={{
            width: '100%',
            height: 600,
            border: '1px solid #ddd',
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
            background: '#fff'
          }}
        >
          <img
            src={uploaded ?? card.imageUrl ?? '/placeholder.png'}
            alt={card.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 20,
              color: '#fff',
              textShadow: '0 2px 6px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ fontSize }}>{text}</div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside style={{ width: 320 }}>
        <h3>Customize</h3>
        <label style={{ display: 'block', marginBottom: 8 }}>Text</label>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />

        <label style={{ display: 'block', marginBottom: 8 }}>Font size</label>
        <input
          type="range"
          min={12}
          max={72}
          value={fontSize}
          onChange={e => setFontSize(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 12 }}
        />

        <label style={{ display: 'block', marginBottom: 8 }}>Upload image</label>
        <input type="file" accept="image/*" onChange={onUpload} style={{ marginBottom: 12 }} />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onDownload} style={{ padding: '10px 12px', borderRadius: 8 }}>
            Download PNG
          </button>
          <button
            onClick={() => alert('Save feature not implemented in demo')}
            style={{ padding: '10px 12px', borderRadius: 8 }}
          >
            Save
          </button>
        </div>
      </aside>
    </div>
  );
}
