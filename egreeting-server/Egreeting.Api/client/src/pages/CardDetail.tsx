import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CARDS } from '../data/cards';


export default function CardDetail(){
const { id } = useParams<{id:string}>();
const navigate = useNavigate();
const card = CARDS.find(c=>c.id === id);
if(!card) return <div style={{padding:24}}>Card not found.</div>;


return (
<div style={{maxWidth:900,margin:'24px auto',padding:'0 16px'}}>
<div style={{display:'flex',gap:24}}>
<div style={{flex:'1 1 0%'}}>
<img src={card.full ?? card.thumb} alt={card.title} style={{width:'100%',borderRadius:8}} />
</div>
<div style={{width:320}}>
<h1>{card.title}</h1>
<p style={{color:'#666'}}>{card.description}</p>
<div style={{marginTop:16,display:'flex',gap:8}}>
<button onClick={()=>navigate(`/editor/${card.id}`)} style={{padding:'10px 12px',borderRadius:8}}>Customize</button>
<button onClick={()=>alert('Added to favorites (demo)')} style={{padding:'10px 12px',borderRadius:8}}>Favorite</button>
</div>
</div>
</div>
</div>
);
}