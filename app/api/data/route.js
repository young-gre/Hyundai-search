import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export const revalidate = 60

// ✅ request 파라미터 추가
export async function GET(request) {
try {
// 🔒 보안 패치: 헤더에 올바른 비밀번호가 있는지 확인
const authHeader = request.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.VIEWER_PASSWORD}`) {
return NextResponse.json(
{ error: '인증되지 않은 접근입니다.' },
{ status: 401 }
)
}

const { blobs } = await list()
const jsonBlob = blobs.find(b => b.pathname === 'hyundai-data.json')

if (!jsonBlob) {
return NextResponse.json(
{ data: [], uploadedAt: null, totalCount: 0 },
{ headers: { 'Cache-Control': 'no-store' } }
)
}

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