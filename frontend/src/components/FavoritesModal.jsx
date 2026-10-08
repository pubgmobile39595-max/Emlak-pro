import ListingCard from './ListingCard'

function FavoritesModal({ listings, favorites, onClose, onCardClick, onFavoriteClick }) {
  const favoriteListings = listings.filter(l => favorites.includes(l.id))

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <h2>❤️ Favorilerim ({favoriteListings.length})</h2>
          
          {favoriteListings.length === 0 ? (
            <div className="empty-fav">
              <p>😔 Henüz favori ilanın yok</p>
              <p className="small">Kartların sağ üstündeki 🤍 butonuna basarak favorilere ekleyebilirsin</p>
            </div>
          ) : (
            <div className="listings-fav">
              {favoriteListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorite={true}
                  onClick={() => {
                    onCardClick(listing)
                    onClose()
                  }}
                  onFavoriteClick={onFavoriteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FavoritesModal
