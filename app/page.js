'use client'
import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import SearchFilter from '@/components/SearchFilter'
import ResultTable from '@/components/ResultTable'
import LoadingSpinner from '@/components/LoadingSpinner'
import FilterTags from '@/components/FilterTags'
import CarModal from '@/components/CarModal'
import CompareBar from '@/components/CompareBar'

export default function Page() {
const [allData, setAllData] = useState([])
const [uploadedAt, setUploadedAt] = useState(null)
const [totalCount, setTotalCount] = useState(0)
const [loading, setLoading] = useState(true)
const [filters, setFilters] = useState({
car: '', engine: '', trim: '', ext: '', int: '', option: '', minPrice: ''
})

// 모달
const [selectedCar, setSelectedCar] = useState(null)

// 비교
const [compareList, setCompareList] = useState([])

useEffect(() => {
setLoading(true)
fetch('/api/data')
.then(r => r.json())
.then(json => {
setAllData(json.data || [])
setUploadedAt(json.uploadedAt || null)
setTotalCount(json.totalCount || 0)
})
.finally(() => setLoading(false))
}, [])

const filtered = useMemo(() => {
return allData.filter(d => {
if (filters.car && d.car !== filters.car) return false
if (filters.engine && d.engine !== filters.engine) return false
if (filters.trim && d.trim !== filters.trim) return false
if (filters.ext && d.extColor !== filters.ext) return false
if (filters.int && d.intColor !== filters.int) return false
if (filters.option && d.option !== filters.option) return false
if (filters.minPrice && Number(d.specialPrice) < Number(filters.minPrice)) return false
return true
})
}, [allData, filters])
// 비교 토글
const handleCompare = (car) => {
setCompareList(prev => {
const exists = prev.some(c => c.no === car.no)
if (exists) return prev.filter(c => c.no !== car.no)
if (prev.length >= 3) return prev
return [...prev, car]
})
}

return (
<div style={{ minHeight: '100vh', background: '#f6f3f2' }}>
{/* 네비게이션 */}
<div style={{ background: '#002c5f', padding: '12px 0' }}>
<div style={{
maxWidth: 960, margin: '0 auto', padding: '0 16px',
display: 'flex', alignItems: 'center'
}}>
<span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>HYUNDAI</span>
</div>
</div>

{/* 메인 */}
<div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
<Header
uploadedAt={uploadedAt}
totalCount={totalCount}
notice="충북 특별판매조건 대상 리스트"
/>

{loading ? (
<LoadingSpinner />
) : (
<>
<SearchFilter data={allData} filters={filters} setFilters={setFilters} />

{/* 필터 태그 */}
<FilterTags filters={filters} setFilters={setFilters} />

<p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
검색 결과: <strong style={{ color: '#002c5f' }}>{filtered.length}</strong>건
<span style={{ color: '#aaa', marginLeft: 8, fontSize: 12 }}>
(행을 클릭하면 상세정보, 체크박스로 비교)
</span>
</p>

<ResultTable
data={filtered}
onSelectCar={setSelectedCar}
compareList={compareList}
onCompare={handleCompare}
/>
</>
)}
</div>

{/* 푸터 */}
<div style={{ background: '#002c5f', marginTop: 48, padding: '24px 0', textAlign: 'center' }}>
<p style={{ color: '#aacae6', fontSize: 12, margin: 0 }}>
© 2026 Hyundai Motor Company. All Rights Reserved.
</p>
</div>

{/* 차량 상세 모달 */}
<CarModal
car={selectedCar}
onClose={() => setSelectedCar(null)}
onCompare={handleCompare}
compareList={compareList}
/>

{/* 비교 바 */}
<CompareBar
compareList={compareList}
onRemove={(no) => setCompareList(prev => prev.filter(c => c.no !== no))}
onClear={() => setCompareList([])}
/>
</div>
)
}