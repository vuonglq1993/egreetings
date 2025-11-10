// File: src/pages/Editor.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CARDS } from '../data/cards';
import html2canvas from 'html2canvas';


export default function Editor(){
const { id } = useParams<{id:string}>();
const card = CARDS.find(c=>c.id === id);
const canvasRef = useRef<HTMLDivElement | null>(null);
const [text, setText] = useState('Your message here');
const [fontSize, setFontSize] = useState(28);
const [uploaded, setUploaded] = useState<string | null>(null);


useEffect(()=> {
if(card) setText(card.title);
},[card]);


if(!card) return <div style={{padding:24}}>Editor: card not found.</div>;


const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
const f = e.target.files?.[0];
if(!f) return;
const reader = new FileReader();
reader.onload = () => setUploaded(reader.result as string);
reader.readAsDataURL(f);
};


const onDownload = async () => {
if(!canvasRef.current) return;
const node = canvasRef.current;
const canvas = await html2canvas(node, { useCORS: true });  

const blob: Blob | undefined = await new Promise((resolve) => {
  canvas.toBlob((b) => resolve(b || undefined));
});
if(!blob) return;
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${card.id}-custom.png`;
a.click();
URL.revokeObjectURL(url);
};


return (
<div style={{maxWidth:1100,margin:'24px auto',padding:'0 16px',display:'flex',gap:24}}>
<div style={{flex:1}}>
<div ref={canvasRef} style={{width:'100%',height:600,border:'1px solid #ddd',borderRadius:8,position:'relative',overflow:'hidden',background:'#fff'}}>
<img src={uploaded ?? card.full ?? card.thumb} alt="card" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
<div style={{position:'absolute',left:20,top:20,color:'#fff',textShadow:'0 2px 6px rgba(0,0,0,0.6)'}}>
<div style={{fontSize}}>{text}</div>
</div>
</div>
</div>


<aside style={{width:320}}>
<h3>Customize</h3>
<label style={{display:'block',marginBottom:8}}>Text</label>
<input value={text} onChange={e=>setText(e.target.value)} style={{width:'100%',padding:8,marginBottom:12}} />


<label style={{display:'block',marginBottom:8}}>Font size</label>
<input type="range" min={12} max={72} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} style={{width:'100%',marginBottom:12}} />


<label style={{display:'block',marginBottom:8}}>Upload image</label>
<input type="file" accept="image/*" onChange={onUpload} style={{marginBottom:12}} />


<div style={{display:'flex',gap:8,marginTop:12}}>
<button onClick={onDownload} style={{padding:'10px 12px',borderRadius:8}}>Download PNG</button>
<button onClick={()=>alert('Save feature not implemented in demo')} style={{padding:'10px 12px',borderRadius:8}}>Save</button>
</div>
</aside>
</div>
);
}