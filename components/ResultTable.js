'use client'
import { useState, useEffect } from 'react'

const PAGE_SIZE = 20

export default function ResultTable({ data, onSelectCar, compareList, onCompare, resetSort }) {
const [sortKey, setSortKey] = useState(null)
const [sortDir, setSortDir] = useState('asc')
const [page, setPage] = useState(1)

// ✅ resetSort 신호 받으면 정렬 초기화
useEffect(() => {
setSortKey(null)
setSortDir('asc')
setPage(1)
}, [resetSort])

// ✅ 필터 바뀌면 1페이지로
useEffect(() => {
setPage(1)
}, [data])

const handleSort = (key, e) => {
e.stopPropagation()
if (sortKey === key) {
setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
} else {
setSortKey(key)
setSortDir('asc')
}
setPage(1)
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

const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
textAlign: 'left', fontWeight: 700, fontSize: 12,
color: '#fff', background: '#002c5f',
whiteSpace: 'nowrap', letterSpacing: '0.5px',
cursor: 'pointer', userSelect: 'none'
}

const td = {
padding: '13px 12px', fontSize: 13, color: '#333',
borderBottom: '1px solid #f0ece8', whiteSpace: 'nowrap'
}

const sortIcon = (key) => {
if (sortKey !== key) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>
return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
}

const columns = [
{ key: 'carName', label: '차량명' },
{ key: 'status', label: '차량상태' },
{ key: 'condTotal', label: '조건합계' },
{ key: 'expectedPrice', label: '예상 차량가격' },
{ key: 'engine', label: '엔진' },
{ key: 'trim', label: '트림' },
{ key: 'extColor', label: '외장컬러' },
{ key: 'intColor', label: '내장컬러' },
{ key: 'option', label: '옵션' },
{ key: 'saleCode', label: '판매코드' },
{ key: 'optionCode', label: '옵션코드' },
]

const renderCell = (d, key) => {
if (key === 'car') {
return (
<span style={{
background: '#002c5f', color: '#fff',
padding: '3px 10px', borderRadius: 3,
fontSize: 11, fontWeight: 700
}}>{d[key]}</span>
)
}
if (key === 'status') {
return (
<span style={{
background: d[key] ? '#e8f5e9' : '#f5f5f5',
color: d[key] ? '#2e7d32' : '#999',
padding: '3px 10px', borderRadius: 3,
fontSize: 11, fontWeight: 600
}}>{d[key] || '-'}</span>
)
}
if (key === 'carPrice') {
return (
<span style={{ fontWeight: 600, color: '#333' }}>
{d[key] ? Number(d[key]).toLocaleString() + '원' : '-'}
</span>
)
}
if (key === 'condTotal') {
return (
<span style={{ fontWeight: 600, color: '#e63312' }}>
{d[key] ? Number(d[key]).toLocaleString() + '원' : '-'}
</span>
)
}
if (key === 'expectedPrice') {
return (
<span style={{ fontWeight: 700, color: '#00aad2' }}>
{d[key] ? Number(d[key]).toLocaleString() + '원' : '-'}
</span>
)
}
if (key === 'saleCode' || key === 'optionCode') {
return (
<span style={{ color: '#00aad2', fontWeight: 600 }}>
{d[key] || '-'}
</span>
)
}
return d[key] || '-'
}

return (
<div>
<div style={{
overflowX: 'auto', borderRadius: 8,
boxShadow: '0 2px 12px rgba(0,44,95,0.08)',
border: '1px solid #e8e4e0'
}}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
<thead>
<tr>
<th style={{ ...th, width: 40, cursor: 'default' }}>비교</th>
{columns.map(col => (
<th key={col.key} style={th} onClick={(e) => handleSort(col.key, e)}>
{col.label}{sortIcon(col.key)}
</th>
))}
</tr>
</thead>
<tbody>
{paged.map((d, i) => {
const isCompared = compareList.some(c => c.no === d.no)
return (
<tr
key={i}
onClick={() => onSelectCar(d)}
style={{
background: isCompared ? '#eef4fb' : i % 2 === 0 ? '#fff' : '#f9f7f5',
cursor: 'pointer', transition: 'background 0.15s'
}}
onMouseEnter={e => { if (!isCompared) e.currentTarget.style.background = '#f0f7ff' }}
onMouseLeave={e => { if (!isCompared) e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f9f7f5' }}
>
<td
style={{ ...td, textAlign: 'center' }}
onClick={e => { e.stopPropagation(); onCompare(d) }}
>
<div style={{
width: 20, height: 20, borderRadius: 4,
border: `2px solid ${isCompared ? '#002c5f' : '#d1d5db'}`,
background: isCompared ? '#002c5f' : '#fff',
display: 'flex', alignItems: 'center', justifyContent: 'center',
margin: '0 auto', transition: 'all 0.15s'
}}>
{isCompared && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
</div>
</td>
{columns.map(col => (
<td key={col.key} style={td}>
{renderCell(d, col.key)}
</td>
))}
</tr>
)
})}
</tbody>
</table>
</div>

{/* ✅ 페이지네이션 */}
{totalPages > 1 && (
<div style={{
display: 'flex', justifyContent: 'center',
alignItems: 'center', gap: 8, marginTop: 20
}}>
{/* 처음 */}
<button
onClick={() => setPage(1)}
disabled={page === 1}
style={pageBtnStyle(page === 1)}
>«</button>

{/* 이전 */}
<button
onClick={() => setPage(p => Math.max(1, p - 1))}
disabled={page === 1}
style={pageBtnStyle(page === 1)}
>‹</button>

{/* ✅ 페이지 번호 - 고유 key */}
{Array.from({ length: totalPages }, (_, i) => i + 1)
.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
.reduce((acc, p, idx, arr) => {
if (idx > 0 && p - arr[idx - 1] > 1) {
acc.push({ type: 'ellipsis', id: `ellipsis-${idx}` })
}
acc.push({ type: 'page', value: p, id: `page-${p}` })
return acc
}, [])
.map(item =>
item.type === 'ellipsis' ? (
<span key={item.id} style={{ color: '#aaa', padding: '0 4px' }}>…</span>
) : (
<button
key={item.id}
onClick={() => setPage(item.value)}
style={{
width: 36, height: 36, borderRadius: 4,
border: `2px solid ${page === item.value ? '#002c5f' : '#e8e4e0'}`,
background: page === item.value ? '#002c5f' : '#fff',
color: page === item.value ? '#fff' : '#333',
fontSize: 13, fontWeight: page === item.value ? 700 : 400,
cursor: 'pointer', transition: 'all 0.15s'
}}
>{item.value}</button>
)
)
}

{/* 다음 */}
<button
onClick={() => setPage(p => Math.min(totalPages, p + 1))}
disabled={page === totalPages}
style={pageBtnStyle(page === totalPages)}
>›</button>

{/* 마지막 */}
<button
onClick={() => setPage(totalPages)}
disabled={page === totalPages}
style={pageBtnStyle(page === totalPages)}
>»</button>

<span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>
{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} / {sorted.length}건
</span>
</div>
)}
</div>
)
}

function pageBtnStyle(disabled) {
return {
width: 36, height: 36, borderRadius: 4,
border: '2px solid #e8e4e0',
background: disabled ? '#f5f5f5' : '#fff',
color: disabled ? '#ccc' : '#333',
fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer',
transition: 'all 0.15s'
}
}

