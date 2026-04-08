'use client'
import { useState, useRef } from 'react'

export default function Header({ uploadedAt, totalCount, notice, onUploadSuccess }) {
const [uploading, setUploading] = useState(false)
const [msg, setMsg] = useState('')
const [showPasswordModal, setShowPasswordModal] = useState(false)
const [password, setPassword] = useState('')
const [pendingFile, setPendingFile] = useState(null)
const inputRef = useRef(null)

function formatDate(isoString) {
if (!isoString) return '업로드 기록 없음'
const d = new Date(isoString)
const year = d.getFullYear()
const month = String(d.getMonth() + 1).padStart(2, '0')
const day = String(d.getDate()).padStart(2, '0')
const hour = String(d.getHours()).padStart(2, '0')
const min = String(d.getMinutes()).padStart(2, '0')
return `${year}-${month}-${day} ${hour}시 ${min}분`
}

// ✅ 파일 선택 시 비밀번호 모달 먼저 표시
function handleFileSelect(e) {
const file = e.target.files[0]
if (!file) return
setPendingFile(file)
setShowPasswordModal(true)
if (inputRef.current) inputRef.current.value = ''
}

// ✅ 비밀번호 확인 후 업로드
async function handleUpload() {
if (!pendingFile || !password) return
setShowPasswordModal(false)
setUploading(true)
setMsg('업로드 중...')

try {
const formData = new FormData()
formData.append('file', pendingFile)
formData.append('password', password) // ✅ 비밀번호 전송

const res = await fetch('/api/upload', { method: 'POST', body: formData })
const json = await res.json()

if (res.status === 401) {
setMsg('❌ 비밀번호가 올바르지 않습니다')
} else if (json.url) {
setMsg('✅ 업로드 완료! 데이터를 갱신합니다...')
await onUploadSuccess()
setMsg('✅ 데이터 갱신 완료!')
setTimeout(() => setMsg(''), 3000)
} else {
setMsg('❌ 실패: ' + (json.error || '알 수 없는 오류'))
}
} catch (err) {
setMsg('❌ 오류: ' + err.message)
}

setUploading(false)
setPassword('')
setPendingFile(null)
}

return (
<div style={{ marginBottom: 32 }}>

{/* 비밀번호 모달 */}
{showPasswordModal && (
<>
<div
onClick={() => {
setShowPasswordModal(false)
setPassword('')
setPendingFile(null)
}}
style={{
position: 'fixed', inset: 0,
background: 'rgba(0,0,0,0.5)',
zIndex: 100, backdropFilter: 'blur(2px)'
}}
/>
<div style={{
position: 'fixed',
top: '50%', left: '50%',
transform: 'translate(-50%, -50%)',
background: '#fff', borderRadius: 12,
padding: 32, width: 320,
zIndex: 101,
boxShadow: '0 20px 60px rgba(0,44,95,0.3)'
}}>
<h3 style={{
color: '#002c5f', fontSize: 16,
fontWeight: 700, margin: '0 0 8px 0'
}}>관리자 인증</h3>
<p style={{ fontSize: 13, color: '#888', margin: '0 0 20px 0' }}>
업로드하려면 비밀번호를 입력하세요
</p>

<input
type="password"
placeholder="비밀번호 입력"
value={password}
onChange={e => setPassword(e.target.value)}
onKeyDown={e => e.key === 'Enter' && handleUpload()}
autoFocus
style={{
width: '100%', padding: '12px 16px',
border: '1px solid #d1d5db', borderRadius: 4,
fontSize: 14, outline: 'none',
boxSizing: 'border-box', marginBottom: 16
}}
/>

<div style={{ display: 'flex', gap: 8 }}>
<button
onClick={() => {
setShowPasswordModal(false)
setPassword('')
setPendingFile(null)
}}
style={{
flex: 1, padding: '10px',
border: '2px solid #e8e4e0',
borderRadius: 4, background: '#fff',
color: '#666', fontSize: 13,
cursor: 'pointer'
}}
>취소</button>
<button
onClick={handleUpload}
disabled={!password}
style={{
flex: 1, padding: '10px',
border: 'none', borderRadius: 4,
background: password ? '#002c5f' : '#ccc',
color: '#fff', fontSize: 13,
fontWeight: 700,
cursor: password ? 'pointer' : 'not-allowed'
}}
>확인</button>
</div>
</div>
</>
)}

{/* 업로드 정보 */}
<div style={{
display: 'inline-flex', alignItems: 'center', gap: 16,
background: '#002c5f', color: '#fff',
padding: '8px 16px', borderRadius: 4,
fontSize: 13, marginBottom: 16
}}>
<span>📅 데이터 업로드 : <strong>{formatDate(uploadedAt)}</strong></span>
<span style={{ color: '#aacae6' }}>|</span>
<span>🚗 총 재고 : <strong style={{ color: '#00aad2' }}>{totalCount}</strong>대</span>
</div>

<h1 style={{
fontSize: 32, fontWeight: 900,
margin: '0 0 8px 0', color: '#002c5f', letterSpacing: '-1px'
}}>
충북 특별조건 검색엔진
</h1>

<div style={{ width: 48, height: 3, background: '#00aad2', marginBottom: 12 }} />
<p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{notice}</p>

<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
<label style={{
padding: '10px 20px',
background: '#002c5f', color: '#fff',
borderRadius: 4, fontSize: 13, fontWeight: 600,
cursor: uploading ? 'not-allowed' : 'pointer',
opacity: uploading ? 0.7 : 1
}}>
{uploading ? '⏳ 업로드 중...' : '📂 Excel 업로드'}
<input
ref={inputRef}
type="file"
accept=".xlsx,.xls"
hidden
onChange={handleFileSelect}
disabled={uploading}
/>
</label>
{msg && (
<span style={{
fontSize: 13,
color: msg.includes('✅') ? '#00aad2' : '#e63312'
}}>
{msg}
</span>
)}
</div>
</div>
)
}

