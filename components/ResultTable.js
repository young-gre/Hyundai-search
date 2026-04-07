export default function ResultTable({ data }) {
  if (data.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 0',
        color: '#999',
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e4e0'
      }}>
        <p style={{ fontSize: 32, margin: '0 0 8px 0' }}></p>
        <p style={{ fontSize: 14, margin: 0 }}>조건에 맞는 차량이 없습니다.</p>
      </div>
    )
  }

  const th = {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: 12,
    color: '#fff',
    background: '#002c5f',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px'
  }

  const td = {
    padding: '13px 16px',
    fontSize: 13,
    color: '#333',
    borderBottom: '1px solid #f0ece8',
    whiteSpace: 'nowrap'
  }

  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: 8,
      boxShadow: '0 2px 12px rgba(0,44,95,0.08)',
      border: '1px solid #e8e4e0'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>NO</th>
            <th style={th}>차종</th>
            <th style={th}>판매코드</th>
            <th style={th}>옵션</th>
            <th style={th}>외장칼라</th>
            <th style={th}>내장칼라</th>
            <th style={th}>요청</th>
            <th style={th}>재고</th>
            <th style={th}>가격</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i} style={{
              background: i % 2 === 0 ? '#fff' : '#f9f7f5',
              transition: 'background 0.15s'
            }}>
              <td style={{ ...td, color: '#999', fontSize: 12 }}>{d.no}</td>
              <td style={td}>
                <span style={{
                  background: '#002c5f',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: 3,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}>{d.car}</span>
              </td>
              <td style={{ ...td, color: '#00aad2', fontWeight: 600 }}>{d.code}</td>
              <td style={td}>{d.option}</td>
              <td style={td}>{d.ext}</td>
              <td style={td}>{d.int}</td>
              <td style={td}>{d.request}</td>
              <td style={td}>
                <span style={{
                  color: d.stock ? '#00aad2' : '#999',
                  fontWeight: d.stock ? 600 : 400
                }}>{d.stock || '-'}</span>
              </td>
              <td style={{ ...td, fontWeight: 600, color: '#002c5f' }}>
                {d.price ? Number(d.price).toLocaleString() + '원' : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
