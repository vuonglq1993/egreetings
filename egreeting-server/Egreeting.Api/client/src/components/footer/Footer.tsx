import React from 'react';


export default function Footer(){
return (
<footer style={{borderTop:'1px solid #eee',padding:20,marginTop:40,background:'#fafafa'}}>
<div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
<div>
<strong>MyCards</strong>
<div style={{fontSize:13,color:'#666'}}>© {new Date().getFullYear()} MyCards. All rights reserved.</div>
</div>
<div style={{fontSize:13,color:'#666'}}>Contact: hello@mycards.example</div>
</div>
</footer>
);
}