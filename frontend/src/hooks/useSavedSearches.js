const STORAGE_KEY = 'emlak_saved_searches'

export function getSavedSearches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (e) {
    return []
  }
}

export function saveSearch(filters) {
  const list = getSavedSearches()
  
  const name = generateName(filters)
  const search = {
    id: Date.now(),
    name,
    filters,
    createdAt: new Date().toISOString()
  }
  
  list.push(search)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return search
}

export function deleteSearch(id) {
  const list = getSavedSearches()
  const filtered = list.filter(s => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return filtered
}

function generateName(filters) {
  const parts = []
  if (filters.search) parts.push(filters.search)
  if (filters.type) parts.push(filters.type)
  if (filters.room) parts.push(filters.room)
  if (filters.minPrice) parts.push(`Min:${filters.minPrice}`)
  if (filters.maxPrice) parts.push(`Max:${filters.maxPrice}`)
  return parts.length > 0 ? parts.join(' • ') : 'Tüm İlanlar'
}
