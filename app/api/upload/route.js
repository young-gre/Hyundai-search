import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request) {
try {
const formData = await request.formData()
const file = formData.get('file')
if (!file) return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })

const arrayBuffer = await file.arrayBuffer()
const workbook = XLSX.read(arrayBuffer, { type: 'buffer' })
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const json = XLSX.utils.sheet_to_json(sheet)

// ✅ 업로드 시점에 JSON 변환
const uploadedAt = new Date().toISOString()
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

const totalCount = data.length

// ✅ Excel + JSON 병렬 저장
await Promise.all([
// 원본 Excel 보관
put('hyundai-data.xlsx', file, {
access: 'private',
addRandomSuffix: false,
allowOverwrite: true,
}),
// JSON 변환본 저장 (API에서 이걸 읽음)
put('hyundai-data.json',
JSON.stringify({ data, uploadedAt, totalCount }),
{
access: 'private',
addRandomSuffix: false,
allowOverwrite: true,
contentType: 'application/json'
}
),
])

return NextResponse.json({ totalCount, uploadedAt })

} catch (err) {
console.error('업로드 오류:', err.message)
return NextResponse.json({ error: err.message }, { status: 500 })
}
}