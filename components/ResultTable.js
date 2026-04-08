'use client'
import { useState } from 'react'

export default function ResultTable({ data, onSelectCar, compareList, onCompare }) {
const [sortKey, setSortKey] = useState(null)
const [sortDir, setSortDir] = useState('asc')

const handleSort = (key, e) => {
e.stopPropagation()
if (sortKey === key) {
setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
} else {
setSortKey(key)
setSortDir('asc')
}
}

const sorted = [...data].sort((a, b) => {
if (!sortKey) return 0
const aVal = a[sortKey], bVal = b[sortKey]
if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
}
return sortDir === 'asc'
? String(aVal ?? '').localeCompare(String(bVal ?? ''), 'ko')
: String(bVal ?? '').localeCompare(String(aVal ?? ''), 'ko')
})

if (data.length === 0) {
return (
<div style={{
textAlign: 'center', padding: '60px 0', color: '#999',
background: '#fff', borderRadius: 8, border: '1px solid #e8e4e0'
}}>
<p style={{ fontSize: 32, margin: '0 0 8px 0' }}>🔍</p>
<p style={{ fontSize: 14, margin: 0 }}>조건에 맞는 차량이 없습니다.</p>
</div>
)
}
const th = {
padding: '14px 12px',
textAlign: 'left',
fontWeight: 700, fontSize: 12,
color: '#fff', background: '#002c5f',
whiteSpace: 'nowrap', letterSpacing: '0.5px',
cursor: 'pointer', userSelect: 'none'
}

const td = {
padding: '13px 12px',
fontSize: 13, color: '#333',
borderBottom: '1px solid #f0ece8',
whiteSpace: 'nowrap'
}

const sortIcon = (key) => {
if (sortKey !== key) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>
return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
}

const columns = [
{ key: 'no', label: 'NO' },
{ key: 'car', label: '차종' },
{ key: 'carName', label: '차량명' },
{ key: 'trim', label: '트림' },
{ key: 'engine', label: '엔진' },
{ key: 'saleCode', label: '판매코드' },
{ key: 'optionCode', label: '옵션코드' },
{ key: 'extColor', label: '외장컬러' },
{ key: 'intColor', label: '내장컬러' },
{ key: 'option', label: '옵션' },
{ key: 'specialPrice', label: '특별조건금액' },
{ key: 'totalPrice', label: '판매조건계' },
{ key: 'status', label: '차량상태' },
]

return (
<div style={{
overflowX: 'auto', borderRadius: 8,
boxShadow: '0 2px 12px rgba(0,44,95,0.08)',
border: '1px solid #e8e4e0'
}}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
<thead>
<tr>
{/* 비교 체크박스 헤더 */}
<th style={{ ...th, width: 40, cursor: 'default' }}>비교</th>
{columns.map(col => (
<th key={col.key} style={th} onClick={(e) => handleSort(col.key, e)}>
{col.label}{sortIcon(col.key)}
</th>
))}
</tr>
</thead>
<tbody>
{sorted.map((d, i) => {
const isCompared = compareList.some(c => c.no === d.no)
return (
<tr
key={i}
onClick={() => onSelectCar(d)}
style={{
background: isCompared
? '#eef4fb'
: i % 2 === 0 ? '#fff' : '#f9f7f5',
cursor: 'pointer',
transition: 'background 0.15s'
}}
onMouseEnter={e => { if (!isCompared) e.currentTarget.style.background = '#f0f7ff' }}
onMouseLeave={e => { if (!isCompared) e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f9f7f5' }}
>
    {/* 체크박스 */}
<td
style={{ ...td, textAlign: 'center' }}
onClick={e => { e.stopPropagation(); onCompare(d) }}
>
<div style={{
width: 20, height: 20,
borderRadius: 4,
border: `2px solid ${isCompared ? '#002c5f' : '#d1d5db'}`,
background: isCompared ? '#002c5f' : '#fff',
display: 'flex', alignItems: 'center', justifyContent: 'center',
margin: '0 auto',
transition: 'all 0.15s'
}}>
{isCompared && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
</div>
</td>

<td style={{ ...td, color: '#999', fontSize: 12 }}>{d.no}</td>
<td style={td}>
<span style={{
background: '#002c5f', color: '#fff',
padding: '3px 10px', borderRadius: 3,
fontSize: 11, fontWeight: 700
}}>{d.car}</span>
</td>
<td style={td}>{d.carName}</td>
<td style={td}>{d.trim}</td>
<td style={td}>{d.engine}</td>
<td style={{ ...td, color: '#00aad2', fontWeight: 600 }}>{d.saleCode}</td>
<td style={{ ...td, color: '#00aad2', fontWeight: 600 }}>{d.optionCode}</td>
<td style={td}>{d.extColor}</td>
<td style={td}>{d.intColor}</td>
<td style={td}>{d.option}</td>
<td style={{ ...td, fontWeight: 600, color: '#e63312' }}>
{d.specialPrice ? Number(d.specialPrice).toLocaleString() + '원' : '-'}
</td>
<td style={{ ...td, fontWeight: 600, color: '#002c5f' }}>
{d.totalPrice ? Number(d.totalPrice).toLocaleString() + '원' : '-'}
</td>
<td style={td}>
<span style={{
background: d.status ? '#e8f5e9' : '#f5f5f5',
color: d.status ? '#2e7d32' : '#999',
padding: '3px 10px', borderRadius: 3,
fontSize: 11, fontWeight: 600
}}>{d.status || '-'}</span>
</td>
</tr>
)
})}
</tbody>
</table>
</div>
)
}