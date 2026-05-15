export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'rgba(8, 9, 26, 0.9)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.4)',
      textAlign: 'center',
      padding: '24px',
      marginTop: '60px',
      fontSize: '13px',
      position: 'relative',
      zIndex: 1,
    }}>
      <p>KinoKast — andmed pärinevad <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.5)' }}>TMDb API</a>-st</p>
    </footer>
  );
}
