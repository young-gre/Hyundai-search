'use client'
import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import SearchFilter from '@/components/SearchFilter'
import ResultTable from '@/components/ResultTable'

export default function Page() {
const [allData, setAllData] = useState([])
const [uploadedAt, setUploadedAt] = useState(null)
const [totalCount, setTotalCount] = useState(0)
const [filters, setFilters] = useState({
car: '', option: '', ext: '', int: '', code: '', minPrice: ''
})

useEffect(() => {
fetch('/api/data')
.then(r => r.json())
.then(json => {
setAllData(json.data || [])
setUploadedAt(json.uploadedAt || null)
setTotalCount(json.totalCount || 0)
})
}, [])

const filtered = useMemo(() => {
return allData.filter(d => {
if (filters.car && d.car !== filters.car) return false
if (filters.option && d.option !== filters.option) return false
if (filters.ext && d.ext !== filters.ext) return false
if (filters.int && d.int !== filters.int) return false
if (filters.code && !d.code.includes(filters.code)) return false
if (filters.minPrice && Number(d.price) < Number(filters.minPrice)) return false
return true
})
}, [allData, filters])

return (
<div style={{ minHeight: '100vh', background: '#f6f3f2' }}>
{/* 상단 네비게이션 바 */}
<div style={{ background: '#002c5f', padding: '12px 0' }}>
<div style={{
maxWidth: 960, margin: '0 auto', padding: '0 16px',
display: 'flex', alignItems: 'center', justifyContent: 'space-between'
}}>
<span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>HYUNDAI</span>
</div>
</div>

{/* 메인 컨텐츠 */}
<div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
<Header
uploadedAt={uploadedAt}
totalCount={totalCount}
notice="충북 특별판매조건 대상 리스트"
/>
<SearchFilter data={allData} filters={filters} setFilters={setFilters} />
<p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
검색 결과: <strong style={{ color: '#002c5f' }}>{filtered.length}</strong>건
</p>
<ResultTable data={filtered} />
</div>

{/* 하단 푸터 */}
<div style={{ background: '#002c5f', marginTop: 48, padding: '24px 0', textAlign: 'center' }}>
<p style={{ color: '#aacae6', fontSize: 12, margin: 0 }}>
© 2026 Hyundai Motor Company. All Rights Reserved.
</p>
</div>
</div>
)
}