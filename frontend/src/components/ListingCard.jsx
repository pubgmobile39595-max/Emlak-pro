import { getValidImageUrl } from '../utils/imageUtils'

function ListingCard({ listing, isFavorite, onClick, onFavoriteClick }) {
  const formatPrice = (price, type) => {
    const formatted = price.toLocaleString('tr-TR') + ' ₺'
    return (type === 'Kiralık' || type === 'İş Yeri') ? formatted + '/ay' : formatted
  }

  return (
    <div className="card" onClick={onClick}>
      <div className="card-img-wrap">
        <span className="tag">{listing.type}</span>
        <button 
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onFavoriteClick(listing.id)
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <img 
          src={getValidImageUrl(listing.img)} 
          alt={listing.title}
          onError={(e) => { 
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
          }}
        />
      </div>
      <div className="card-body">
        <h3>{listing.title}</h3>
        <p className="location">📍 {listing.location}</p>
        <div className="price">{formatPrice(listing.price, listing.type)}</div>
        {(listing.avgRating > 0 || listing.ratingCount > 0) && (
          <div className="card-rating">
            ⭐ {(listing.avgRating || 0).toFixed(1)}
            <span className="count">({listing.ratingCount || 0})</span>
          </div>
        )}
        <div className="card-info">
          {listing.views > 0 && <span>👁 {listing.views}</span>}
          {listing.rooms && listing.rooms !== '-' && <span>🛏 {listing.rooms}</span>}
          {listing.area && <span>📐 {listing.area} m²</span>}
          {listing.bath > 0 && <span>🛁 {listing.bath}</span>}
        </div>
      </div>
    </div>
  )
}

export default ListingCard
