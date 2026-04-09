import { NextResponse } from 'next/server'

export async function POST(request) {
try {
const { password } = await request.json()

// 환경변수에 설정된 조회용 비밀번호와 비교
if (password === process.env.VIEWER_PASSWORD) {
return NextResponse.json({ success: true })
}

return NextResponse.json(
{ success: false, error: '비밀번호가 일치하지 않습니다.' },
{ status: 401 }
)
} catch (error) {
return NextResponse.json({ error: '서버 오류' }, { status: 500 })
}
}