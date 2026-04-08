import { NextResponse } from 'next/server'

// ✅ 60초 캐싱
export const revalidate = 60

export async function GET() {
try {
const res = await fetch(process.env.JSON_BLOB_URL, {
next: { revalidate: 60 },
headers: {
'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
}
})

// JSON 파일이 아직 없을 때 (최초 배포 시)
if (!res.ok) {
return NextResponse.json(
{ data: [], uploadedAt: null, totalCount: 0 },
{ headers: { 'Cache-Control': 'no-store' } }
)
}

const { data, uploadedAt, totalCount } = await res.json()

return NextResponse.json(
{ data, uploadedAt, totalCount },
{
headers: {
'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
}
}
)

} catch (e) {
console.error('데이터 오류:', e.message)
return NextResponse.json({ error: e.message }, { status: 500 })
}
}