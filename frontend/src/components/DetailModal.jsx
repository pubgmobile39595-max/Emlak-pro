import { getValidImageUrl } from '../utils/imageUtils'

function DetailModal({ listing, onClose }) {
  const formatPrice = (price, type) => {
    const formatted = price.toLocaleString('tr-TR') + ' ₺'
    return (type === 'Kiralık' || type === 'İş Yeri') ? formatted + '/ay' : formatted
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img 
          src={getValidImageUrl(listing.img)} 
          alt={listing.title}
          onError={(e) => { 
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
          }}
        />
        <div className="modal-body">
          <span className="tag-static">{listing.type}</span>
          <h2>{listing.title}</h2>
          <p className="location">📍 {listing.location}</p>
          <div className="price">{formatPrice(listing.price, listing.type)}</div>
          <p>{listing.desc || 'Açıklama yok.'}</p>
          
          <div className="features">
            {listing.rooms && listing.rooms !== '-' && (
              <div className="feature">🛏 {listing.rooms}</div>
            )}
            {listing.area && <div className="feature">📐 {listing.area} m²</div>}
            {listing.bath > 0 && <div className="feature">🛁 {listing.bath}</div>}
            <div className="feature">🏷 {listing.type}</div>
            {listing.views > 0 && <div className="feature">👁 {listing.views} kişi</div>}
          </div>
          
          <div className="modal-actions">
            <a 
              href={`https://wa.me/${(listing.phone || '+905551234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Merhaba, "' + listing.title + '" ilanı hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary whatsapp"
            >
              📞 İletişim
            </a>
            <button className="btn-secondary" onClick={onClose}>Kapat</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailModal
