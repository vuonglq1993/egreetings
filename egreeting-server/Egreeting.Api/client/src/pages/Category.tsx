import React, {useMemo, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { CARDS } from '../data/cards';
import type { Card } from '../data/cards';


export default function Category(){
const { type } = useParams<{type:string}>();
const [filter, setFilter] = useState('All');


const items = useMemo(()=> {
const base = CARDS.filter(c => c.category === (type ?? ''));
if(filter === 'All') return base;
return base.filter(c => c.tags?.includes(filter.toLowerCase()));
},[type,filter]);


return (
<div style={{maxWidth:1100,margin:'24px auto',padding:'0 16px'}}>
<h1 style={{textTransform:'capitalize'}}>{type ?? 'Category'}</h1>
<div style={{margin:'12px 0',display:'flex',gap:8}}>
{['All','Funny','Kids','Classic'].map(f=> (
<button key={f} onClick={()=>setFilter(f)} style={{padding:'6px 10px',borderRadius:6,background:filter===f?'#111':'#fff',color:filter===f?'#fff':'#111',border:'1px solid #eee'}}>{f}</button>
))}
</div>


<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16,marginTop:12}}>
{items.length === 0 && <div style={{color:'#666'}}>No cards found in this category.</div>}
{items.map((c:Card)=> (
<Link key={c.id} to={`/card/${c.id}`} style={{textDecoration:'none',color:'inherit'}}>
<div style={{border:'1px solid #eee',borderRadius:8,overflow:'hidden'}}>
<img src={c.thumb} alt={c.title} style={{width:'100%',height:140,objectFit:'cover'}}/>
<div style={{padding:12}}>
<h3 style={{margin:0,fontSize:16}}>{c.title}</h3>
<p style={{margin: '8px 0 0',fontSize:13,color:'#666'}}>{c.description}</p>
</div>
</div>
</Link>
))}
</div>
</div>
);
}