import MediaCard from './MediaCard';

export default function MediaGrid({ items = [] }) {
  if (items.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '60px', fontSize: '14px' }}>
        Tulemusi ei leitud.
      </p>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '16px',
    }}>
      {items.map((item) => (
        <MediaCard key={`${item.media_type || 'item'}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
