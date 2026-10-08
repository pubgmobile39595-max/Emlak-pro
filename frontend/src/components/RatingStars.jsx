import { useState, useEffect } from 'react'
import { getUserRatings, setUserRating } from '../hooks/useRating'

function RatingStars({ listingId, avgRating = 0, ratingCount = 0, onRate }) {
  const [userRating, setUserRating_] = useState(0)
  const [hovered, setHovered] = useState(0)

  useEffect(() => {
    const ratings = getUserRatings()
    setUserRating_(ratings[listingId] || 0)
  }, [listingId])

  const handleClick = (value) => {
    setUserRating(listingId, value)
    setUserRating_(value)
    if (onRate) onRate(listingId, value)
  }

  const displayRating = hovered || userRating

  return (
    <div className="rating-section">
      <div className="rating-stars" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= displayRating ? 'active' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHovered(star)}
          >
            ★
          </span>
        ))}
      </div>
      <div className="rating-info">
        {userRating > 0 ? (
          <span>Sizin puanınız: {userRating}/5</span>
        ) : avgRating > 0 ? (
          <span>⭐ {avgRating.toFixed(1)} ({ratingCount} oy)</span>
        ) : (
          <span>Puanla ve görüşünü paylaş</span>
        )}
      </div>
    </div>
  )
}

export default RatingStars
