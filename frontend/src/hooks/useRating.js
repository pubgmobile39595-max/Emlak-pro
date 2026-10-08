const STORAGE_KEY = 'emlak_ratings'

export function getUserRatings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch (e) {
    return {}
  }
}

export function setUserRating(listingId, value) {
  const ratings = getUserRatings()
  ratings[listingId] = value
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
  return ratings
}

export function getRating(listingId) {
  const ratings = getUserRatings()
  return ratings[listingId] || 0
}
