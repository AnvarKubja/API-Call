export function LoadingSpinner({ text = 'Laadin...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.4)' }}>
      <div style={{
        width: '36px', height: '36px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTop: '3px solid rgba(108, 99, 255, 0.8)',
        borderRadius: '50%',
        margin: '0 auto 16px',
        animation: 'spin 0.9s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontSize: '14px' }}>{text}</p>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      color: '#e57373',
      backgroundColor: 'rgba(229, 57, 53, 0.08)',
      border: '1px solid rgba(229, 57, 53, 0.2)',
      borderRadius: '12px',
      margin: '20px 0',
    }}>
      <p>⚠️ Viga: {message || 'Midagi läks valesti'}</p>
    </div>
  );
}
