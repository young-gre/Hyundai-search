'use client'

export default function SearchFilter({ data, filters, setFilters, onReset }) {

const handle = (key, val) => {
if (key === 'car') {
setFilters(prev => ({
...prev, car: val,
engine: '', trim: '', ext: '', int: '', option: '', minPrice: ''
}))
return
}
if (key === 'engine') {
setFilters(prev => ({
...prev, engine: val,
trim: '', ext: '', int: '', option: ''
}))
return
}
setFilters(prev => ({ ...prev, [key]: val }))
}

// ✅ 정렬 초기화 신호도 같이 전달
const reset = () => onReset({
car: '', engine: '', trim: '', ext: '', int: '', option: '', minPrice: ''
})

const carList = [...new Set(data.map(d => d.car).filter(Boolean))].sort()
const byCar = filters.car ? data.filter(d => d.car === filters.car) : data
const engineList = [...new Set(byCar.map(d => d.engine).filter(Boolean))].sort()
const byEngine = filters.engine ? byCar.filter(d => d.engine === filters.engine) : byCar
const trimList = [...new Set(byEngine.map(d => d.trim).filter(Boolean))].sort()
const extList = [...new Set(byEngine.map(d => d.extColor).filter(Boolean))].sort()
const intList = [...new Set(byEngine.map(d => d.intColor).filter(Boolean))].sort()
const optionList = [...new Set(byEngine.map(d => d.option).filter(Boolean))].sort()

const sel = (enabled) => ({
width: '100%', padding: '12px 16px',
border: `1px solid ${enabled ? '#d1d5db' : '#e8e4e0'}`,
borderRadius: 4, fontSize: 14,
background: enabled ? '#fff' : '#f5f5f5',
outline: 'none',
color: enabled ? '#1a1a1a' : '#bbb',
cursor: enabled ? 'pointer' : 'not-allowed',
transition: 'all 0.2s'
})

const lab = (enabled = true) => ({
fontSize: 13, fontWeight: 700,
marginBottom: 8, display: 'block',
color: enabled ? '#002c5f' : '#aaa'
})

const blue = { color: '#00aad2', fontWeight: 500, marginLeft: 4 }
const badge = (color) => ({
marginLeft: 6, fontSize: 10,
background: color, color: '#fff',
padding: '1px 6px', borderRadius: 10, verticalAlign: 'middle'
})

const cascadeSteps = [
{ key: 'car', label: '차종', list: carList, enabled: true, placeholder: '차종 선택' },
{ key: 'engine', label: '엔진', list: engineList, enabled: !!filters.car, placeholder: '엔진 선택' },
]

const freeSteps = [
{ key: 'trim', label: '트림', list: trimList, placeholder: '트림 선택' },
{ key: 'ext', label: '외장컬러', list: extList, placeholder: '외장컬러 선택' },
{ key: 'int', label: '내장컬러', list: intList, placeholder: '내장컬러 선택' },
{ key: 'option', label: '옵션', list: optionList, placeholder: '옵션 선택' },
]
return (
<div style={{
background: '#fff', borderRadius: 8,
padding: '28px 24px', marginBottom: 24,
boxShadow: '0 2px 12px rgba(0,44,95,0.08)',
border: '1px solid #e8e4e0'
}}>
<h2 style={{
fontSize: 15, fontWeight: 700, color: '#002c5f',
margin: '0 0 20px 0', paddingBottom: 12,
borderBottom: '2px solid #002c5f'
}}>검색 조건</h2>

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>

{cascadeSteps.map(({ key, label, list, enabled, placeholder }) => (
<div key={key}>
<label style={lab(enabled)}>
{label}
{enabled && <span style={blue}>{list.length}</span>}
<span style={badge('#002c5f')}>필수순서</span>
</label>
<select
style={sel(enabled)}
value={filters[key]}
onChange={e => handle(key, e.target.value)}
disabled={!enabled}
>
<option value="">{!enabled ? '차종을 먼저 선택하세요' : placeholder}</option>
{list.map(v => <option key={v} value={v}>{v}</option>)}
</select>
</div>
))}

<div style={{ gridColumn: '1 / -1' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
<div style={{ flex: 1, height: 1, background: '#f0ece8' }} />
<span style={{
fontSize: 11, color: '#aaa', whiteSpace: 'nowrap',
background: '#fff', padding: '0 8px'
}}>아래 항목은 순서 없이 자유롭게 선택 가능</span>
<div style={{ flex: 1, height: 1, background: '#f0ece8' }} />
</div>
</div>

{freeSteps.map(({ key, label, list, placeholder }) => (
<div key={key}>
<label style={lab(true)}>
{label}
<span style={blue}>{list.length}</span>
<span style={badge('#00aad2')}>자유선택</span>
</label>
<select
style={sel(true)}
value={filters[key]}
onChange={e => handle(key, e.target.value)}
>
<option value="">{placeholder}</option>
{list.map(v => <option key={v} value={v}>{v}</option>)}
</select>
</div>
))}

<div>
<label style={lab(true)}>
조건합계 (최소)
<span style={badge('#00aad2')}>자유선택</span>
</label>
<input
style={sel(true)}
type="number"
placeholder="최소 금액 입력"
value={filters.minPrice || ''}
onChange={e => handle('minPrice', e.target.value)}
/>
</div>
</div>

<div style={{ marginTop: 20 }}>
<p style={{ fontSize: 11, color: '#aaa', margin: '0 0 6px 0' }}>선택 진행도</p>
<div style={{ display: 'flex', gap: 6 }}>
{[
{ key: 'car', label: '차종' },
{ key: 'engine', label: '엔진' },
{ key: 'trim', label: '트림' },
{ key: 'ext', label: '외장' },
{ key: 'int', label: '내장' },
{ key: 'option', label: '옵션' },
].map(({ key, label }) => (
<div key={key} style={{ flex: 1, textAlign: 'center' }}>
<div style={{
height: 4, borderRadius: 2,
background: filters[key] ? '#002c5f' : '#e8e4e0',
marginBottom: 4, transition: 'background 0.3s'
}} />
<span style={{
fontSize: 10,
color: filters[key] ? '#002c5f' : '#ccc',
fontWeight: filters[key] ? 700 : 400
}}>{label}</span>
</div>
))}
</div>
</div>

<div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
<button onClick={reset} style={{
width: 44, height: 44, borderRadius: '50%',
border: '2px solid #002c5f', background: '#fff',
color: '#002c5f', fontSize: 18, cursor: 'pointer'
}}>↺</button>
</div>
</div>
)
}