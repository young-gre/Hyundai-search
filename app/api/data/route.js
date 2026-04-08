import * as XLSX from 'xlsx'
import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
try {
const { blobs } = await list()

const excelBlob = blobs.find(b => b.pathname === 'hyundai-data.xlsx')
const metaBlob = blobs.find(b => b.pathname === 'hyundai-meta.json')

if (!excelBlob) {
return NextResponse.json({ data: [], uploadedAt: null, totalCount: 0 })
}

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

const res = await fetch(excelBlob.url, {
cache: 'no-store',
headers: { 'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
})

const arrayBuffer = await res.arrayBuffer()
const workbook = XLSX.read(arrayBuffer, { type: 'buffer' })
const sheet = workbook.Sheets[workbook.SheetNames[0]]

// ✅ 헤더 확인용 로그
const json = XLSX.utils.sheet_to_json(sheet)
console.log('Excel 첫번째 행 키:', Object.keys(json[0]))

const data = json.map((row, i) => ({
no: row['NO'] ?? i + 1,
car: row['차종'] ?? '',
prodNo: row['생산번호'] ?? '',
specialPrice: row['특별조건 금액'] ?? '',
saleCode: row['판매코드'] ?? '',
optionCode: row['옵션코드'] ?? '',
ext: row['외장'] ?? '',
int: row['내장'] ?? '',
prodDate: row['생산일'] ?? '',
center: row['출고센터'] ?? '',
totalPrice: row['판매조건 계(특조 금액 제외)'] ?? '',
status: row['차량상태'] ?? '',
carName: row['차량명'] ?? '',
extColor: row['외장컬러'] ?? '',
intColor: row['내장컬러'] ?? '',
engine: row['엔진'] ?? '',
trim: row['트림'] ?? '',
option: row['옵션'] ?? '',
}))

return NextResponse.json({ data, uploadedAt, totalCount })

} catch (e) {
console.error('데이터 오류:', e.message)
return NextResponse.json({ error: e.message }, { status: 500 })
}
}