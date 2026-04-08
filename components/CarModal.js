'use client'
import { useEffect } from 'react'

export default function CarModal({ car, onClose, onCompare, compareList }) {
    const isInCompare = compareList?.some(c => c.no === car?.no)

// ESC 키로 닫기
useEffect(() => {
    if (!car) return
    const handler = (e) => {if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
}, [onClose])
if (!car) return null


const rows = [
{ label: 'NO', value: car.no },
{ label: '차종', value: car.car },
{ label: '차량명', value: car.carName },
{ label: '트림', value: car.trim },
{ label: '엔진', value: car.engine },
{ label: '판매코드', value: car.saleCode },
{ label: '옵션코드', value: car.optionCode },
{ label: '생산번호', value: car.prodNo },
{ label: '생산일', value: car.prodDate },
{ label: '출고센터', value: car.center },
{ label: '외장컬러', value: car.extColor },
{ label: '내장컬러', value: car.intColor },
{ label: '옵션', value: car.option },
{ label: '차량상태', value: car.status },
{ label: '특별조건금액', value: car.specialPrice ? Number(car.specialPrice).toLocaleString() + '원' : '-'},
{ label: '판매조건계', value: car.totalPrice ? Number(car.totalPrice).toLocaleString() + '원' : '-'},
{ label: '예상 차량가격', value: car.expectedPrice ? Number(car.expectedPrice).toLocaleString() + '원' : '-', highlight: 'red' },
{ label: '차량가격', value: car.carPrice ? Number(car.carPrice).toLocaleString() + '원' : '-', highlight: 'blue' },
{ label: '조건합계', value: car.condTotal ? Number(car.condTotal).toLocaleString() + '원' : '-', highlight: 'blue' },
]

return (
<>
{/* 오버레이 */}
<div
onClick={onClose}
style={{
position: 'fixed', inset: 0,
background: 'rgba(0,0,0,0.5)',
zIndex: 100,
backdropFilter: 'blur(2px)',
animation: 'fadeIn 0.2s ease'
}}
/>

{/* 모달 */}
<div style={{
position: 'fixed',
top: '50%', left: '50%',
transform: 'translate(-50%, -50%)',
background: '#fff',
borderRadius: 12,
width: '90%', maxWidth: 520,
maxHeight: '85vh',
overflowY: 'auto',
zIndex: 101,
boxShadow: '0 20px 60px rgba(0,44,95,0.3)',
animation: 'slideUp 0.25s ease'
}}>

{/* 모달 헤더 */}
<div style={{
background: '#002c5f',
padding: '20px 24px',
borderRadius: '12px 12px 0 0',
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
position: 'sticky', top: 0, zIndex: 1
}}>
<div>
<p style={{ color: '#aacae6', fontSize: 11, margin: '0 0 4px 0' }}>차량 상세정보</p>
<h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>
{car.carName || car.car}
</h2>
</div>
<button
onClick={onClose}
style={{
background: 'rgba(255,255,255,0.15)',
border: 'none',
color: '#fff',
width: 32, height: 32,
borderRadius: '50%',
fontSize: 18,
cursor: 'pointer',
display: 'flex',
alignItems: 'center',
justifyContent: 'center'
}}
>×</button>
</div>

{/* 가격 요약 */}
<div style={{
display: 'grid',
gridTemplateColumns: '1fr 1fr 1fr',
gap: 1,
background: '#e8e4e0',
borderBottom: '1px solid #e8e4e0'
}}>
{/* 1번째: 차량가격 */}
<div style={{ background: '#f0fff4', padding: '16px 12px', textAlign: 'center' }}>
<p style={{ fontSize: 11, color: '#888', margin: '0 0 4px 0' }}>차량가격</p>
<p style={{ fontSize: 16, fontWeight: 700, color: '#002c5f', margin: 0 }}>
{car.carPrice ? Number(car.carPrice).toLocaleString() + '원' : '-'}
</p>
</div>

{/* 2번째: 조건합계 */}
<div style={{ background: '#fff7f6', padding: '16px 12px', textAlign: 'center' }}>
<p style={{ fontSize: 11, color: '#888', margin: '0 0 4px 0' }}>조건합계</p>
<p style={{ fontSize: 16, fontWeight: 700, color: '#e63312', margin: 0 }}>
{car.condTotal ? Number(car.condTotal).toLocaleString() + '원' : '-'}
</p>
</div>

{/* 3번째: 예상 차량가격 */}
<div style={{ background: '#f0f7ff', padding: '16px 12px', textAlign: 'center' }}>
<p style={{ fontSize: 11, color: '#888', margin: '0 0 4px 0' }}>예상 차량가격</p>
<p style={{ fontSize: 16, fontWeight: 700, color: '#00aad2', margin: 0 }}>
{car.expectedPrice ? Number(car.expectedPrice).toLocaleString() + '원' : '-'}
</p>
</div>
</div>

{/* 상세 정보 */}
<div style={{ padding: '16px 24px' }}>
{rows.map(({ label, value, highlight }) => (
<div key={label} style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: '10px 0',
borderBottom: '1px solid #f5f5f5'
}}>
<span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{label}</span>
<span style={{
fontSize: 13,
fontWeight: highlight ? 700 : 400,
color: highlight === 'red' ? '#e63312' : highlight === 'blue' ? '#002c5f' : '#1a1a1a'
}}>
{value || '-'}
</span>
</div>
))}
</div>

{/* 비교 추가 버튼 */}
<div style={{ padding: '16px 24px', borderTop: '1px solid #f0ece8' }}>
<button
onClick={() => onCompare(car)}
disabled={!isInCompare && compareList.length >= 3}
style={{
width: '100%',
padding: '12px',
borderRadius: 6,
border: '2px solid',
borderColor: isInCompare ? '#e63312' : compareList.length >= 3 ? '#ccc' : '#002c5f',
background: isInCompare ? '#fff7f6' : compareList.length >= 3 ? '#f5f5f5' : '#002c5f',
color: isInCompare ? '#e63312' : compareList.length >= 3 ? '#aaa' : '#fff',
fontSize: 14,
fontWeight: 700,
cursor: compareList.length >= 3 && !isInCompare ? 'not-allowed' : 'pointer',
transition: 'all 0.2s'
}}
>
{isInCompare
? '✕ 비교에서 제거'
: compareList.length >= 3
? '비교 차량은 최대 3대'
: '+ 비교에 추가'}
</button>
</div>
</div>

<style>{`
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
@keyframes slideUp { from { opacity:0; transform:translate(-50%,-45%) } to { opacity:1; transform:translate(-50%,-50%) } }
`}</style>
</>
)
}