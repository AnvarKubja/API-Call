// Kuvab kaardid ruudustikus (grid)

import MediaCard from './MediaCard';

export default function MediaGrid({ items = [] }) {
  // Kui tulemusi pole, näita sõnumit
  if (items.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
        Tulemusi ei leitud.
      </p>
    );
  }

  return (
    <div style={stiilid.ruudustik}>
      {items.map((item) => (
        <MediaCard key={`${item.media_type || 'item'}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

const stiilid = {
  ruudustik: {
    display: 'grid',
    // Automaatne veerude arv - vähemalt 160px lai kaart
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
  },
};
