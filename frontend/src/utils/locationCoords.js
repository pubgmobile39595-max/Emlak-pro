// Türkiye illeri + popüler ilçeler için koordinatlar
const COORDINATES = {
  // İller
  'İstanbul': [41.0082, 28.9784],
  'Ankara': [39.9334, 32.8597],
  'İzmir': [38.4237, 27.1428],
  'Bursa': [40.1826, 29.0665],
  'Antalya': [36.8969, 30.7133],
  'Adana': [37.0000, 35.3213],
  'Konya': [37.8746, 32.4932],
  'Gaziantep': [37.0662, 37.3833],
  'Şanlıurfa': [37.1591, 38.7969],
  'Mersin': [36.8000, 34.6333],
  'Diyarbakır': [37.9144, 40.2306],
  'Kayseri': [38.7312, 35.4787],
  'Eskişehir': [39.7767, 30.5206],
  'Samsun': [41.2867, 36.3300],
  'Denizli': [37.7765, 29.0864],
  'Malatya': [38.3552, 38.3095],
  'Trabzon': [41.0015, 39.7178],
  'Erzurum': [39.9334, 41.2664],
  'Van': [38.4891, 43.3800],
  'Aydın': [37.8486, 27.8453],
  'Muğla': [37.2153, 28.3636],
  'Çanakkale': [40.1553, 26.4142],
  'Sakarya': [40.7861, 30.4024],
  'Tekirdağ': [41.0038, 27.5070],
  'Balıkesir': [39.6484, 27.8826],
  'Manisa': [38.6191, 27.4289],
  'Kocaeli': [40.8533, 29.8815],
  'Bolu': [40.5760, 31.5787],
  'Bilecik': [40.1500, 29.9833],
  'Yalova': [40.6500, 29.2667],
  
  // İlçeler (İstanbul)
  'Beşiktaş': [41.0430, 29.0095],
  'Kadıköy': [40.9906, 29.0278],
  'Şişli': [41.0602, 28.9877],
  'Ataşehir': [40.9923, 29.1244],
  'Beyoğlu': [41.0350, 28.9772],
  'Üsküdar': [41.0214, 29.0167],
  'Bakırköy': [40.9785, 28.8722],
  'Beylikdüzü': [41.0022, 28.6406],
  'Sarıyer': [41.1667, 29.0500],
  'Maltepe': [40.9350, 29.1550],
  'Pendik': [40.8775, 29.2342],
  'Kartal': [40.9061, 29.1869],
  'Bahçelievler': [41.0007, 28.8603],
  'Bağcılar': [41.0392, 28.8564],
  'Zeytinburnu': [41.0014, 28.9080],
  
  // İlçeler (İzmir)
  'Çeşme': [38.3236, 26.3067],
  'Karşıyaka': [38.4603, 27.1103],
  'Bornova': [38.4683, 27.2159],
  'Konak': [38.4189, 27.1287],
  'Buca': [38.3875, 27.1781],
  'Bayraklı': [38.4628, 27.1614],
  
  // İlçeler (Ankara)
  'Çankaya': [39.9208, 32.8541],
  'Keçiören': [39.9833, 32.8667],
  'Yenimahalle': [39.9667, 32.7833],
  'Mamak': [39.9333, 32.9167],
  'Etimesgut': [39.9500, 32.6667],
  
  // İlçeler (Bursa)
  'Nilüfer': [40.2138, 28.9722],
  'Osmangazi': [40.1950, 29.0600],
  'Yıldırım': [40.1833, 29.1000],
  
  // İlçeler (Aydın)
  'Didim': [37.3853, 27.2658],
  'Kuşadası': [37.8579, 27.2600],
  
  // Varsayılan
  'Türkiye': [39.0, 35.0]
}

export function getCoordinates(location) {
  if (!location) return COORDINATES['Türkiye']
  
  // Virgülle ayır: "Beşiktaş, İstanbul"
  const parts = location.split(',').map(p => p.trim())
  
  // Önce ilçe (ilk parça), sonra il
  for (const part of parts) {
    if (COORDINATES[part]) {
      return COORDINATES[part]
    }
  }
  
  // Hiçbiri bulunamazsa varsayılan
  return COORDINATES['Türkiye']
}

export function getListingCoordinates(listing) {
  // Önce backend'den gelen lat/lng
  if (listing.lat && listing.lng) {
    return [listing.lat, listing.lng]
  }
  
  // Sonra konumdan tahmin
  return getCoordinates(listing.location)
}
