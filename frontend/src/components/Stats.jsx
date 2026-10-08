function Stats({ listings, favorites, t }) {
  const total = listings.length
  const satilik = listings.filter(l => l.type === 'Satılık').length
  const kiralik = listings.filter(l => l.type === 'Kiralık').length

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-num">{total}</div>
        <div className="stat-label">{t ? t('total') : 'Toplam'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{satilik}</div>
        <div className="stat-label">{t ? t('forSale') : 'Satılık'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{kiralik}</div>
        <div className="stat-label">{t ? t('forRent') : 'Kiralık'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{favorites.length}</div>
        <div className="stat-label">{t ? t('favorites') : 'Favori'}</div>
      </div>
    </div>
  )
}

export default Stats
