export const metadata = {
  title: '충북 특별조건 검색엔진',
  description: "'26년 4월 특별재고 리스트",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
        background: '#f6f3f2',
        color: '#1a1a1a'
      }}>
        {children}
      </body>
    </html>
  )
}

export default function RootLayout({ children }) {
return (
<html lang="ko">
<head>
{/* ✅ Google Analytics */}
<script
async
src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
/>
<script dangerouslySetInnerHTML={{
__html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-G9C781J4PL');
`
}} />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
</head>
<body style={{
margin: 0,
fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
background: '#f6f3f2',
color: '#1a1a1a'
}}>
{children}
</body>
</html>
)
}