import { useEffect } from 'react'

function MapView({ onCardClick }) {
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'openListing' && e.data.id) {
        if (onCardClick) onCardClick(e.data.id)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onCardClick])

  return (
    <div className="map-section">
      <h2>🗺️ İlanları Haritada Gör</h2>
      <iframe
        src="/harita.html"
        title="Emlak Haritası"
        className="map-container"
        style={{ width: '100%', height: '450px', border: 'none' }}
      />
    </div>
  )
}

export default MapView
