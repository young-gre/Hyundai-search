export default function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 0',
      gap: 16
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '4px solid #e8e4e0',
        borderTop: '4px solid #002c5f',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
        데이터를 불러오는 중입니다...
      </p>
      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
