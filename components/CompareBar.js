'use client'
import { useState } from 'react'

export default function CompareBar({ compareList, onRemove, onClear }) {
const [open, setOpen] = useState(false)

if (compareList.length === 0) return null

const COMPARE_KEYS = [
{ label: '차량명', key: 'carName' },
{ label: '트림', key: 'trim' },
{ label: '엔진', key: 'engine' },
{ label: '외장컬러', key: 'extColor' },
{ label: '내장컬러', key: 'intColor' },
{ label: '옵션', key: 'option' },
{ label: '특별조건금액', key: 'specialPrice', type: 'price', highlight: 'red' },
{ label: '판매조건계', key: 'totalPrice', type: 'price', highlight: 'blue' },
{ label: '차량상태', key: 'status' },
{ label: '출고센터', key: 'center' },
]
return (
<>
{/* 하단 고정 바 */}
<div style={{
position: 'fixed',
bottom: 0, left: 0, right: 0,
background: '#002c5f',
zIndex: 50,
boxShadow: '0 -4px 20px rgba(0,44,95,0.3)',
animation: 'slideUpBar 0.3s ease'
}}>
{/* 비교 테이블 (펼쳤을 때) */}
{open && (
<div style={{
maxWidth: 1200,
margin: '0 auto',
padding: '20px 16px',
overflowX: 'auto'
}}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
<thead>
<tr>
<th style={{
padding: '10px 16px',
fontSize: 12, color: '#aacae6',
textAlign: 'left', width: 120,
borderBottom: '1px solid rgba(255,255,255,0.1)'
}}>항목</th>
{compareList.map((car, i) => (
<th key={i} style={{
padding: '10px 16px',
fontSize: 13, color: '#fff', fontWeight: 700,
textAlign: 'center',
borderBottom: '1px solid rgba(255,255,255,0.1)',
position: 'relative'
}}>
<div>{car.car}</div>
<div style={{ fontSize: 11, color: '#aacae6', fontWeight: 400 }}>
{car.saleCode}
</div>
<button
onClick={() => onRemove(car.no)}
style={{
position: 'absolute', top: 4, right: 4,
background: 'rgba(255,255,255,0.15)',
border: 'none', color: '#fff',
width: 20, height: 20, borderRadius: '50%',
fontSize: 12, cursor: 'pointer',
display: 'flex', alignItems: 'center', justifyContent: 'center'
}}
>×</button>
</th>
))}
</tr>
</thead>
<tbody>
{COMPARE_KEYS.map(({ label, key, type, highlight }) => {
const values = compareList.map(c => c[key])
const allSame = values.every(v => v === values[0])
return (
<tr key={key}>
<td style={{
padding: '10px 16px',
fontSize: 12, color: '#aacae6',
borderBottom: '1px solid rgba(255,255,255,0.06)'
}}>{label}</td>
{compareList.map((car, i) => {
const val = car[key]
const display = type === 'price'
? (val ? Number(val).toLocaleString() + '원' : '-')
: (val || '-')

return (
<td key={i} style={{
padding: '10px 16px',
fontSize: 13,
textAlign: 'center',
borderBottom: '1px solid rgba(255,255,255,0.06)',
color: highlight === 'red'
? '#ff6b6b'
: highlight === 'blue'
? '#7bb8f0'
: allSame ? '#aaa' : '#fff',
fontWeight: highlight ? 700 : allSame ? 400 : 600,
background: !allSame && highlight
? 'rgba(255,255,255,0.05)'
: 'transparent'
}}>
{display}
</td>
)
})}
</tr>
)
})}
</tbody>
</table>
</div>
)}
{/* 하단 바 */}
<div style={{
maxWidth: 1200, margin: '0 auto',
padding: '12px 16px',
display: 'flex', alignItems: 'center', gap: 12
}}>
<span style={{ color: '#aacae6', fontSize: 12, fontWeight: 600 }}>
비교 차량
</span>

{compareList.map((car, i) => (
<div key={i} style={{
display: 'flex', alignItems: 'center', gap: 6,
background: 'rgba(255,255,255,0.1)',
padding: '6px 12px', borderRadius: 20
}}>
<span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
{car.car}
</span>
<span style={{ color: '#aacae6', fontSize: 11 }}>
{car.saleCode}
</span>
<button
onClick={() => onRemove(car.no)}
style={{
background: 'none', border: 'none',
color: '#aacae6', cursor: 'pointer',
fontSize: 14, padding: 0, lineHeight: 1
}}
>×</button>
</div>
))}

{/* 빈 슬롯 */}
{Array.from({ length: 3 - compareList.length }).map((_, i) => (
<div key={i} style={{
width: 80, height: 32,
border: '1px dashed rgba(255,255,255,0.2)',
borderRadius: 20,
display: 'flex', alignItems: 'center', justifyContent: 'center'
}}>
<span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>+</span>
</div>
))}

<div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
<button
onClick={() => setOpen(prev => !prev)}
style={{
padding: '8px 16px',
background: '#00aad2',
border: 'none', color: '#fff',
borderRadius: 4, fontSize: 12,
fontWeight: 700, cursor: 'pointer'
}}
>
{open ? '▼ 접기' : '▲ 비교하기'}
</button>
<button
onClick={onClear}
style={{
padding: '8px 16px',
background: 'rgba(255,255,255,0.1)',
border: '1px solid rgba(255,255,255,0.2)',
color: '#aacae6',
borderRadius: 4, fontSize: 12,
cursor: 'pointer'
}}
>초기화</button>
</div>
</div>
</div>

{/* 비교바 높이만큼 하단 여백 */}
<div style={{ height: open ? 420 : 68 }} />

<style>{`
@keyframes slideUpBar {
from { transform: translateY(100%) }
to { transform: translateY(0) }
}
`}</style>
</>
)
}
