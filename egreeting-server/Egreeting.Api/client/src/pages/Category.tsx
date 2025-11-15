import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Template {
  id: string;
  title: string;
  description?: string;
  thumb?: string;
  full?: string;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
  templates?: Template[];
}

export default function Category() {
  const { type } = useParams<{ type: string }>();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!type) return;
    axios.get(`${import.meta.env.VITE_API_URL}/Category/${type}`)
      .then(res => {
        const cat: Category = res.data;
        setTemplates(cat.templates ?? []); // fallback nếu templates undefined
      })
      .catch(err => console.error(err));
  }, [type]);

  const items = templates.filter(t =>
    filter === 'All' || t.tags?.includes(filter.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ textTransform: 'capitalize' }}>{type ?? 'Category'}</h1>
      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        {['All','Funny','Kids','Classic'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: filter===f?'#111':'#fff',
              color: filter===f?'#fff':'#111',
              border:'1px solid #eee'
            }}>{f}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16, marginTop:12 }}>
        {items.length === 0 && <div style={{color:'#666'}}>No cards found in this category.</div>}
        {items.map(t => (
          <Link key={t.id} to={`/card/${t.id}`} style={{ textDecoration:'none', color:'inherit' }}>
            <div style={{ border:'1px solid #eee', borderRadius:8, overflow:'hidden' }}>
              <img src={t.thumb} alt={t.title} style={{ width:'100%', height:140, objectFit:'cover' }}/>
              <div style={{ padding:12 }}>
                <h3 style={{ margin:0, fontSize:16 }}>{t.title}</h3>
                <p style={{ margin:'8px 0 0', fontSize:13, color:'#666' }}>{t.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
