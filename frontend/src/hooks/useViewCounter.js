const API_URL = 'http://localhost:3000'

export async function incrementView(listingId) {
  try {
    await fetch(`${API_URL}/api/listings/${listingId}/view`, {
      method: 'POST'
    })
  } catch (err) {
    console.error('View increment error:', err)
  }
}
