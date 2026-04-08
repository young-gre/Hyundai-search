import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request) {
try {
const formData = await request.formData()

// ✅ 비밀번호 검증
const password = formData.get('password')
if (password !== process.env.ADMIN_PASSWORD) {
return NextResponse.json(
{ error: '비밀번호가 올바르지 않습니다' },
{ status: 401 }
)
}

const file = formData.get('file')
if (!file) {
return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
}

const arrayBuffer = await file.arrayBuffer()
const buffer = Buffer.from(arrayBuffer)

const workbook = XLSX.read(buffer, { type: 'buffer' })
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const json = XLSX.utils.sheet_to_json(sheet)

const uploadedAt = new Date().toISOString()
const totalCount = json.length

const data = json.map((row, i) => {
const r = {}
Object.keys(row).forEach(k => { r[k.trim()] = row[k] })

return {
no: r['NO'] ?? i + 1,
car: r['차종'] ?? '',
prodNo: r['생산번호'] ?? '',
specialPrice: r['특별조건 금액'] ?? '',
saleCode: r['판매코드'] ?? '',
optionCode: r['옵션코드'] ?? '',
ext: r['외장'] ?? '',
int: r['내장'] ?? '',
prodDate: r['생산일'] ?? '',
center: r['출고센터'] ?? '',
totalPrice: r['판매조건 계(특조 금액 제외)'] ?? '',
status: r['차량상태'] ?? '',
carName: r['차량명'] ?? '',
extColor: r['외장컬러'] ?? '',
intColor: r['내장컬러'] ?? '',
engine: r['엔진'] ?? '',
trim: r['트림'] ?? '',
option: r['옵션'] ?? '',
carPrice: r['차량가격'] ?? '',
condTotal: r['조건합계'] ?? '',
expectedPrice:r['예상 차량가격'] ?? '',
}
})

await Promise.all([
put('hyundai-data.xlsx', buffer, {
access: 'private',
addRandomSuffix: false,
allowOverwrite: true,
contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}),
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

return NextResponse.json({ url: 'ok', totalCount })

} catch (err) {
console.error('업로드 오류:', err.message)
return NextResponse.json({ error: err.message }, { status: 500 })
}
}