'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Header from '@/components/Header'
import SearchFilter from '@/components/SearchFilter'
import ResultTable from '@/components/ResultTable'
import LoadingSpinner from '@/components/LoadingSpinner'
import FilterTags from '@/components/FilterTags'
import CarModal from '@/components/CarModal'
import CompareBar from '@/components/CompareBar'

export default function Page() {
// 🔒 인증 관련 상태
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [viewPassword, setViewPassword] = useState('')
const [authError, setAuthError] = useState('')
const [isCheckingAuth, setIsCheckingAuth] = useState(true)

const [allData, setAllData] = useState([])
const [uploadedAt, setUploadedAt] = useState(null)
const [totalCount, setTotalCount] = useState(0)
const [loading, setLoading] = useState(false)
const [filters, setFilters] = useState({
car: '', engine: '', trim: '', ext: '', int: '', option: '', minPrice: ''
})
const [selectedCar, setSelectedCar] = useState(null)
const [compareList, setCompareList] = useState([])
const [resetSort, setResetSort] = useState(false)

// ✅ 데이터 불러오기 (비밀번호 토큰 포함)
const fetchData = useCallback((token) => {
setLoading(true)
fetch('/api/data', {
headers: { 'Authorization': `Bearer ${token}` } // 🔒 헤더에 비밀번호 전송
})
.then(r => {
if (!r.ok) throw new Error('인증 실패')
return r.json()
})
.then(json => {
setAllData(json.data || [])
setUploadedAt(json.uploadedAt || null)
setTotalCount(json.totalCount || 0)
})
.catch(err => {
console.error(err)
setIsAuthenticated(false)
sessionStorage.removeItem('viewer_auth')
})
.finally(() => setLoading(false))
}, [])

// ✅ 최초 접속 시 세션 확인
useEffect(() => {
const savedToken = sessionStorage.getItem('viewer_auth')
if (savedToken) {
setIsAuthenticated(true)
fetchData(savedToken)
}
setIsCheckingAuth(false)
}, [fetchData])

// ✅ 로그인 처리
const handleLogin = async (e) => {
e.preventDefault()
setAuthError('')

try {
const res = await fetch('/api/auth', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ password: viewPassword })
})

if (res.ok) {
sessionStorage.setItem('viewer_auth', viewPassword)
setIsAuthenticated(true)
fetchData(viewPassword)
} else {
setAuthError('비밀번호가 일치하지 않습니다.')
}
} catch (err) {
setAuthError('서버 오류가 발생했습니다.')
}
}

const filtered = useMemo(() => {
return allData.filter(d => {
if (filters.car && d.carNameAdj !== filters.car) return false
if (filters.engine && d.engine !== filters.engine) return false
if (filters.trim && d.trim !== filters.trim) return false
if (filters.ext && d.extColor !== filters.ext) return false
if (filters.int && d.intColor !== filters.int) return false
if (filters.option && d.option !== filters.option) return false
if (filters.minPrice && Number(d.condTotal) < Number(filters.minPrice)) return false
return true
})
}, [allData, filters])

const handleCompare = (car) => {
setCompareList(prev => {
const exists = prev.some(c => c.no === car.no)
if (exists) return prev.filter(c => c.no !== car.no)
if (prev.length >= 3) return prev
return [...prev, car]
})
}

const handleResetFilters = (newFilters) => {
setFilters(newFilters)
setResetSort(prev => !prev)
}

// 🔒 인증 확인 중 화면
if (isCheckingAuth) return <div style={{ minHeight: '100vh', background: '#f6f3f2' }} />

// 🔒 로그인 화면 (인증되지 않았을 때)
if (!isAuthenticated) {
return (
<div style={{
minHeight: '100vh', background: '#f6f3f2',
display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
}}>
<div style={{
background: '#fff', padding: '40px 32px', borderRadius: 12,
boxShadow: '0 10px 40px rgba(0,44,95,0.1)', width: '100%', maxWidth: 400,
textAlign: 'center'
}}>
<h1 style={{ color: '#002c5f', fontSize: 24, fontWeight: 900, margin: '0 0 8px 0' }}>
HYUNDAI
</h1>
<p style={{ color: '#666', fontSize: 14, margin: '0 0 32px 0' }}>
충북 특별조건 검색엔진
</p>

<form onSubmit={handleLogin}>
<input
type="password"
placeholder="접근 비밀번호를 입력하세요"
value={viewPassword}
onChange={(e) => setViewPassword(e.target.value)}
style={{
width: '100%', padding: '14px 16px', borderRadius: 6,
border: '1px solid #d1d5db', fontSize: 15, outline: 'none',
boxSizing: 'border-box', marginBottom: 16, textAlign: 'center'
}}
autoFocus
/>
{authError && (
<p style={{ color: '#e63312', fontSize: 13, margin: '0 0 16px 0' }}>{authError}</p>
)}
<button
type="submit"
style={{
width: '100%', padding: '14px', borderRadius: 6,
background: '#002c5f', color: '#fff', border: 'none',
fontSize: 15, fontWeight: 700, cursor: 'pointer'
}}
>
접속하기
</button>
</form>
</div>
</div>
)
}

// ✅ 인증 완료된 메인 화면
return (
<div style={{ minHeight: '100vh', background: '#f6f3f2' }}>
<div style={{ background: '#002c5f', padding: '12px 0' }}>
<div style={{
maxWidth: 960, margin: '0 auto', padding: '0 16px',
display: 'flex', alignItems: 'center', justifyContent: 'space-between'
}}>
<span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>HYUNDAI</span>
<button
onClick={() => {
sessionStorage.removeItem('viewer_auth')
setIsAuthenticated(false)
}}
style={{ background: 'none', border: 'none', color: '#aacae6', fontSize: 13, cursor: 'pointer' }}
>
로그아웃
</button>
</div>
</div>

<div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
<Header
uploadedAt={uploadedAt}
totalCount={totalCount}
notice="충북 특별판매조건 대상 리스트"
onUploadSuccess={() => fetchData(sessionStorage.getItem('viewer_auth'))}
/>

{loading ? (
<LoadingSpinner />
) : (
<>
<SearchFilter data={allData} filters={filters} setFilters={setFilters} onReset={handleResetFilters} />
<FilterTags filters={filters} setFilters={setFilters} />
<p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
검색 결과: <strong style={{ color: '#002c5f' }}>{filtered.length}</strong>건
<span style={{ color: '#aaa', marginLeft: 8, fontSize: 12 }}>
(행을 클릭하면 상세정보, 체크박스로 비교)
</span>
</p>
<ResultTable data={filtered} onSelectCar={setSelectedCar} compareList={compareList} onCompare={handleCompare} resetSort={resetSort} />
</>
)}
</div>

<div style={{ background: '#002c5f', marginTop: 48, padding: '24px 0', textAlign: 'center' }}>
<p style={{ color: '#aacae6', fontSize: 12, margin: 0 }}>
© 2026 Hyundai Motor Company. All Rights Reserved.
</p>
</div>

<CarModal car={selectedCar} onClose={() => setSelectedCar(null)} onCompare={handleCompare} compareList={compareList} />
<CompareBar compareList={compareList} onRemove={(no) => setCompareList(prev => prev.filter(c => c.no !== no))} onClear={() => setCompareList([])} />
</div>
)
}