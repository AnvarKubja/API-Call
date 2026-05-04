// Laadimise indikaator ja veateade

// Näidatakse API päringu ajal
export function LoadingSpinner({ text = 'Laadin...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
      <p>⏳ {text}</p>
    </div>
  );
}

// Näidatakse kui API päring ebaõnnestub
export function ErrorMessage({ message }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      color: '#e53935',
      backgroundColor: '#fff3f3',
      borderRadius: '8px',
      margin: '20px 0',
    }}>
      <p>⚠️ Viga: {message || 'Midagi läks valesti'}</p>
    </div>
  );
}
