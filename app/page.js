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
const [allData, setAllData] = useState([])
const [uploadedAt, setUploadedAt] = useState(null)
const [totalCount, setTotalCount] = useState(0)
const [loading, setLoading] = useState(true)
const [filters, setFilters] = useState({
car: '', engine: '', trim: '', ext: '', int: '', option: '', minPrice: ''
})
const [selectedCar, setSelectedCar] = useState(null)
const [compareList, setCompareList] = useState([])

// ✅ 데이터 fetch 함수 분리 (재사용 가능하도록)
const fetchData = useCallback(() => {
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

useEffect(() => {
fetchData()
}, [fetchData])

const filtered = useMemo(() => {
return allData.filter(d => {
if (filters.car && d.car !== filters.car) return false
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
// ✅ 필터 리셋 시 정렬도 초기화하도록 ref 전달
const [resetSort, setResetSort] = useState(false)
const handleResetFilters = (newFilters) => {
setFilters(newFilters)
setResetSort(prev => !prev) // 토글로 ResultTable에 신호
}

return (
<div style={{ minHeight: '100vh', background: '#f6f3f2' }}>
{/* 네비게이션 */}
<div style={{ background: '#002c5f', padding: '12px 0' }}>
<div style={{
maxWidth: 1200, margin: '0 auto', padding: '0 16px',
display: 'flex', alignItems: 'center'
}}>
<span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>HYUNDAI</span>
</div>
</div>

{/* 메인 */}
<div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
{/* ✅ onUploadSuccess로 자동 리페치 */}
<Header
uploadedAt={uploadedAt}
totalCount={totalCount}
notice="충북 특별판매조건 대상 리스트"
onUploadSuccess={fetchData}
/>

{loading ? (
<LoadingSpinner />
) : (
<>
<SearchFilter
data={allData}
filters={filters}
setFilters={setFilters}
onReset={handleResetFilters}
/>
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
resetSort={resetSort}
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

<CarModal
car={selectedCar}
onClose={() => setSelectedCar(null)}
onCompare={handleCompare}
compareList={compareList}
/>

<CompareBar
compareList={compareList}
onRemove={(no) => setCompareList(prev => prev.filter(c => c.no !== no))}
onClear={() => setCompareList([])}
/>
</div>
)
}