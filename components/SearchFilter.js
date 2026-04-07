'use client'

export default function SearchFilter({ data, filters, setFilters }) {

const handle = (key, val) => {
if (key === 'car') {
setFilters(prev => ({ ...prev, car: val, option: '', ext: '', int: '' }))
} else {
setFilters(prev => ({ ...prev, [key]: val }))
}
}

const reset = () => setFilters({
car: '', option: '', ext: '', int: '', code: '', minPrice: ''
})

const carList = [...new Set(data.map(d => d.car).filter(Boolean))].sort()
const filteredByCar = filters.car ? data.filter(d => d.car === filters.car) : data
const optionList = [...new Set(filteredByCar.map(d => d.option).filter(Boolean))].sort()
const extList = [...new Set(filteredByCar.map(d => d.ext).filter(Boolean))].sort()
const intList = [...new Set(filteredByCar.map(d => d.int).filter(Boolean))].sort()

const sel = {
width: '100%',
padding: '12px 16px',
border: '1px solid #d1d5db',
borderRadius: 4,
fontSize: 14,
background: '#fff',
outline: 'none',
color: '#1a1a1a',
cursor: 'pointer'
}

const disabledSel = {
width: '100%',
padding: '12px 16px',
border: '1px solid #d1d5db',
borderRadius: 4,
fontSize: 14,
background: '#f0f0f0',
outline: 'none',
color: '#aaa',
cursor: 'not-allowed'
}

const lab = {
fontSize: 13,
fontWeight: 700,
marginBottom: 8,
display: 'block',
color: '#002c5f'
}

const blue = {
color: '#00aad2',
fontWeight: 500,
marginLeft: 4
}

return (
<div style={{
background: '#fff',
borderRadius: 8,
padding: '28px 24px',
marginBottom: 24,
boxShadow: '0 2px 12px rgba(0,44,95,0.08)',
border: '1px solid #e8e4e0'
}}>
<h2 style={{
fontSize: 15,
fontWeight: 700,
color: '#002c5f',
margin: '0 0 20px 0',
paddingBottom: 12,
borderBottom: '2px solid #002c5f'
}}>
검색 조건
</h2>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>

<div>
<label style={lab}>
차종별
<span style={blue}>{carList.length}</span>
</label>
<select style={sel} value={filters.car} onChange={e => handle('car', e.target.value)}>
<option value="">차종 선택</option>
{carList.map(v => (
<option key={v} value={v}>{v}</option>
))}
</select>
</div>

<div>
<label style={lab}>
옵션
<span style={blue}>{optionList.length}</span>
</label>
<select
style={filters.car ? sel : disabledSel}
value={filters.option}
onChange={e => handle('option', e.target.value)}
disabled={!filters.car}
>
<option value="">
{filters.car ? '옵션 선택' : '차종을 먼저 선택하세요'}
</option>
{optionList.map(v => (
<option key={v} value={v}>{v}</option>
))}
</select>
</div>

<div>
<label style={lab}>
외장칼라
<span style={blue}>{extList.length}</span>
</label>
<select
style={filters.car ? sel : disabledSel}
value={filters.ext}
onChange={e => handle('ext', e.target.value)}
disabled={!filters.car}
>
<option value="">
{filters.car ? '외장칼라 선택' : '차종을 먼저 선택하세요'}
</option>
{extList.map(v => (
<option key={v} value={v}>{v}</option>
))}
</select>
</div>

<div>
<label style={lab}>
내장칼라
<span style={blue}>{intList.length}</span>
</label>
<select
style={filters.car ? sel : disabledSel}
value={filters.int}
onChange={e => handle('int', e.target.value)}
disabled={!filters.car}
>
<option value="">
{filters.car ? '내장칼라 선택' : '차종을 먼저 선택하세요'}
</option>
{intList.map(v => (
<option key={v} value={v}>{v}</option>
))}
</select>
</div>

<div>
<label style={lab}>판매코드</label>
<input
style={sel}
placeholder="판매코드 입력"
value={filters.code}
onChange={e => handle('code', e.target.value)}
/>
</div>

<div>
<label style={lab}>가격 (최소)</label>
<input
style={sel}
type="number"
placeholder="최소 가격"
value={filters.minPrice || ''}
onChange={e => handle('minPrice', e.target.value)}
/>
</div>

</div>

<div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
<button
onClick={reset}
style={{
width: 44,
height: 44,
borderRadius: '50%',
border: '2px solid #002c5f',
background: '#fff',
color: '#002c5f',
fontSize: 18,
cursor: 'pointer'
}}
>
↺
</button>
</div>
</div>
)
}