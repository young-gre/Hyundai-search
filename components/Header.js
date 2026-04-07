'use client'
import { useState } from 'react'

export default function Header({ uploadedAt, totalCount, notice }) {
const [uploading, setUploading] = useState(false)
const [msg, setMsg] = useState('')

// 날짜 포맷 변환
function formatDate(isoString) {
if (!isoString) return '업로드 기록 없음'
const d = new Date(isoString)
const year = d.getFullYear()
const month = String(d.getMonth() + 1).padStart(2, '0')
const day = String(d.getDate()).padStart(2, '0')
const hour = String(d.getHours()).padStart(2, '0')
const min = String(d.getMinutes()).padStart(2, '0')
console.log('uploadedAt:', uploadedAt)
console.log('totalCount:', totalCount)
return `${year}-${month}-${day} ${hour}시 ${min}분`
}

async function handleUpload(e) {
const file = e.target.files[0]
if (!file) return
setUploading(true)
setMsg('업로드 중...')

try {
const formData = new FormData()
formData.append('file', file)
const res = await fetch('/api/upload', { method: 'POST', body: formData })
const text = await res.text()
const json = JSON.parse(text)
if (json.url) {
setMsg('✅ 업로드 완료! 새로고침하세요.')
} else {
setMsg('❌ 실패: ' + (json.error || '알 수 없는 오류'))
}
} catch (err) {
setMsg('❌ 오류: ' + err.message)
}
setUploading(false)
}

return (
<div style={{ marginBottom: 32 }}>

{/* 업로드 정보 */}
<div style={{
display: 'inline-flex',
alignItems: 'center',
gap: 16,
background: '#002c5f',
color: '#fff',
padding: '8px 16px',
borderRadius: 4,
fontSize: 13,
marginBottom: 16
}}>
<span>
📅 데이터 업로드 : <strong>{formatDate(uploadedAt)}</strong>
</span>
<span style={{ color: '#aacae6' }}>|</span>
<span>
🚗 총 재고 : <strong style={{ color: '#00aad2' }}>{totalCount}</strong>대
</span>
</div>

{/* 제목 */}
<h1 style={{
fontSize: 32,
fontWeight: 900,
margin: '0 0 8px 0',
color: '#002c5f',
letterSpacing: '-1px'
}}>
충북 특별조건 검색엔진
</h1>

{/* 구분선 */}
<div style={{ width: 48, height: 3, background: '#00aad2', marginBottom: 12 }} />

{/* 공지 */}
<p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{notice}</p>

{/* 업로드 버튼 */}
<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
<label style={{
padding: '10px 20px',
background: '#002c5f',
color: '#fff',
borderRadius: 4,
fontSize: 13,
fontWeight: 600,
cursor: uploading ? 'not-allowed' : 'pointer',
opacity: uploading ? 0.7 : 1
}}>
📂 Excel 업로드
<input
type="file"
accept=".xlsx,.xls"
hidden
onChange={handleUpload}
disabled={uploading}
/>
</label>
{msg && (
<span style={{ fontSize: 13, color: msg.includes('✅') ? '#00aad2' : '#e63312' }}>
{msg}
</span>
)}
</div>
</div>
)
}