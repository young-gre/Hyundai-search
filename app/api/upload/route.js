import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request) {
try {
const formData = await request.formData()
const file = formData.get('file')

if (!file) {
return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
}

// Excel 파일 파싱해서 건수 계산
const arrayBuffer = await file.arrayBuffer()
const workbook = XLSX.read(arrayBuffer, { type: 'buffer' })
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const json = XLSX.utils.sheet_to_json(sheet)
const totalCount = json.length

// Excel 파일 업로드
const blob = await put('hyundai-data.xlsx', file, {
access: 'private',
addRandomSuffix: false,
allowOverwrite: true,
})

// 업로드 날짜 & 건수 메타데이터 저장
const meta = {
uploadedAt: new Date().toISOString(),
totalCount: totalCount
}

await put('hyundai-meta.json', JSON.stringify(meta), {
access: 'private',
addRandomSuffix: false,
allowOverwrite: true,
contentType: 'application/json'
})

return NextResponse.json({ url: blob.url, totalCount })

} catch (err) {
console.error('업로드 오류:', err.message)
return NextResponse.json({ error: err.message }, { status: 500 })
}
}