'use client'

const LABEL_MAP = {
car: '차종',
engine: '엔진',
trim: '트림',
ext: '외장컬러',
int: '내장컬러',
option: '옵션',
minPrice: '조건합계 (최소)',
}

export default function FilterTags({ filters, setFilters }) {
const activeTags = Object.entries(filters).filter(([, v]) => v !== '' && v !== null)

if (activeTags.length === 0) return null

const removeTag = (key) => {
// 계단식 연동 제거
if (key === 'car') {
setFilters(prev => ({
...prev, car: '', engine: '', trim: '', ext: '', int: '', option: ''
}))
} else if (key === 'engine') {
setFilters(prev => ({
...prev, engine: '', trim: '', ext: '', int: '', option: ''
}))
} else if (key === 'trim') {
setFilters(prev => ({
...prev, trim: '', ext: '', int: '', option: ''
}))
} else if (key === 'ext') {
setFilters(prev => ({
...prev, ext: '', int: '', option: ''
}))
} else if (key === 'int') {
setFilters(prev => ({
...prev, int: '', option: ''
}))
} else {
setFilters(prev => ({ ...prev, [key]: '' }))
}
}

return (
<div style={{
display: 'flex',
flexWrap: 'wrap',
gap: 8,
marginBottom: 16,
alignItems: 'center'
}}>
<span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>적용된 필터:</span>
{activeTags.map(([key, val]) => (
<span
key={key}
style={{
display: 'inline-flex',
alignItems: 'center',
gap: 6,
background: '#002c5f',
color: '#fff',
padding: '5px 12px',
borderRadius: 20,
fontSize: 12,
fontWeight: 500,
animation: 'fadeIn 0.2s ease'
}}
>
<span style={{ color: '#aacae6', fontSize: 11 }}>{LABEL_MAP[key]}</span>
{key === 'minPrice'
? `${Number(val).toLocaleString()}원 이상`
: val
}
<button
onClick={() => removeTag(key)}
style={{
background: 'none',
border: 'none',
color: '#aacae6',
cursor: 'pointer',
padding: 0,
fontSize: 14,
lineHeight: 1,
display: 'flex',
alignItems: 'center'
}}
>×</button>
</span>
))}
<style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }`}</style>
</div>
)
}