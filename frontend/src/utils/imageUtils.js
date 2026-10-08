// Resim URL'sini doğrula ve düzelt
export function getValidImageUrl(url) {
  const PLACEHOLDER = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
  
  // Boş veya null ise placeholder
  if (!url) return PLACEHOLDER
  
  // Geçerli http/https URL ise olduğu gibi kullan
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // /uploads/ yolu ise backend URL'sine çevir
  if (url.startsWith('/uploads/')) {
    return 'http://localhost:3000' + url
  }
  
  // Bilinmeyen format → placeholder
  return PLACEHOLDER
}
