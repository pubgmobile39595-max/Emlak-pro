import ListingCard from './ListingCard'

function Listings({ listings, loading, favorites, t, onCardClick, onFavoriteClick }) {
  if (loading) {
    return <div className="loading">⏳ {t ? t('loading') : 'İlanlar yükleniyor...'}</div>
  }

  if (listings.length === 0) {
    return <div className="empty">😔 {t ? t('noResults') : 'Sonuç bulunamadı'}</div>
  }

  return (
    <div className="container">
      <div className="result-count">
        {listings.length} {t ? t('listingsFound') : 'ilan bulundu'}
      </div>
      <div className="listings">
        {listings.map(listing => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isFavorite={favorites.includes(listing.id)}
            onClick={() => onCardClick(listing)}
            onFavoriteClick={onFavoriteClick}
          />
        ))}
      </div>
    </div>
  )
}

export default Listings
