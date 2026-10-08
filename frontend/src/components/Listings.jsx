import ListingCard from './ListingCard'

function Listings({ listings, loading, favorites, onCardClick, onFavoriteClick }) {
  if (loading) {
    return <div className="loading">⏳ İlanlar yükleniyor...</div>
  }

  if (listings.length === 0) {
    return <div className="empty">😔 Sonuç bulunamadı</div>
  }

  return (
    <div className="container">
      <div className="result-count">{listings.length} ilan bulundu</div>
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
