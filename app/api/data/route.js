import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export const revalidate = 60

export async function GET() {
try {
const { blobs } = await list()
const jsonBlob = blobs.find(b => b.pathname === 'hyundai-data.json')

if (!jsonBlob) {
return NextResponse.json(
{ data: [], uploadedAt: null, totalCount: 0 },
{ headers: { 'Cache-Control': 'no-store' } }
)
}

// ✅ JSON만 fetch (XLSX 파싱 없음!)
const res = await fetch(jsonBlob.url, {
cache: 'no-store',
headers: { 'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
})

const { data, uploadedAt, totalCount } = await res.json()

return NextResponse.json(
{ data, uploadedAt, totalCount },
{ headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' } }
)

} catch (e) {
console.error('데이터 오류:', e.message)
return NextResponse.json({ error: e.message }, { status: 500 })
}
}