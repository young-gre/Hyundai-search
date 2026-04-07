import * as XLSX from 'xlsx'
import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
try {
const { blobs } = await list()

// Excel 파일 찾기
const excelBlob = blobs.find(b => b.pathname === 'hyundai-data.xlsx')
// 메타데이터 파일 찾기
const metaBlob = blobs.find(b => b.pathname === 'hyundai-meta.json')

if (!excelBlob) {
return NextResponse.json({ data: [], uploadedAt: null, totalCount: 0 })
}

// 메타데이터 읽기
let uploadedAt = null
let totalCount = 0
if (metaBlob) {
const metaRes = await fetch(metaBlob.url, {
cache: 'no-store',
headers: { 'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
})
const meta = await metaRes.json()
uploadedAt = meta.uploadedAt
totalCount = meta.totalCount
}

// Excel 읽기
const res = await fetch(excelBlob.url, {
cache: 'no-store',
headers: { 'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
})

const arrayBuffer = await res.arrayBuffer()
const workbook = XLSX.read(arrayBuffer, { type: 'buffer' })
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const json = XLSX.utils.sheet_to_json(sheet)

const data = json.map((row, i) => {
const keys = Object.keys(row)
const carKeys = keys.filter(k => k.startsWith('차종'))
const optKeys = keys.filter(k => k.startsWith('옵션'))
const extKeys = keys.filter(k => k.startsWith('외장'))
const intKeys = keys.filter(k => k.startsWith('내장'))

return {
no: row['NO'] ?? i + 1,
code: row['판매코드'] ?? '',
request: row['요청'] ?? '',
stock: row['재고'] ?? '',
price: row['가격'] ?? '',
car: row[carKeys[1]] ?? row[carKeys[0]] ?? '',
option: row[optKeys[1]] ?? row[optKeys[0]] ?? '',
ext: row[extKeys[extKeys.length - 1]] ?? '',
int: row[intKeys[intKeys.length - 1]] ?? '',
}
})

return NextResponse.json({ data, uploadedAt, totalCount })

} catch (e) {
console.error('데이터 오류:', e.message)
return NextResponse.json({ error: e.message }, { status: 500 })
}
}