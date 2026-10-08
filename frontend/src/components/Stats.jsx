function Stats({ listings, favorites }) {
  const total = listings.length
  const satilik = listings.filter(l => l.type === 'Satılık').length
  const kiralik = listings.filter(l => l.type === 'Kiralık').length

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-num">{total}</div>
        <div className="stat-label">Toplam</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{satilik}</div>
        <div className="stat-label">Satılık</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{kiralik}</div>
        <div className="stat-label">Kiralık</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{favorites.length}</div>
        <div className="stat-label">Favori</div>
      </div>
    </div>
  )
}

export default Stats
