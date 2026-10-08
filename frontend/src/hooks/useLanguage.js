import { useState, useEffect } from 'react'

const TRANSLATIONS = {
  tr: {
    heroTitle: 'Hayalinizdeki Evi Bulun',
    heroSub: '🏠 Türkiye\'nin her yerinden emlak ilanları',
    searchPlaceholder: '🔍 Şehir veya başlık ara...',
    allTypes: 'Tüm Tipler',
    forSale: 'Satılık',
    forRent: 'Kiralık',
    land: 'Arsa',
    workplace: 'İş Yeri',
    search: 'Ara',
    reset: 'Sıfırla',
    total: 'Toplam',
    favorites: 'Favori',
    login: 'Giriş',
    logout: 'Çıkış',
    listingsFound: 'ilan bulundu',
    noResults: 'Sonuç Bulunamadı',
    loading: 'İlanlar yükleniyor...',
    newListing: 'Yeni İlan Ekle',
    title: 'Başlık',
    city: 'İl Seç',
    district: 'İlçe',
    price: 'Fiyat',
    type: 'Tip',
    rooms: 'Oda',
    area: 'm²',
    bathroom: 'Banyo',
    phone: 'Telefon',
    image: 'Resim URL',
    description: 'Açıklama',
    save: 'Kaydet',
    cancel: 'İptal',
    loginTitle: 'Giriş Yap',
    registerTitle: 'Kayıt Ol',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    contact: 'İletişim',
    close: 'Kapat',
    loanCalc: 'Kredi Hesapla',
    loanAmount: 'Kredi Tutarı',
    loanRate: 'Aylık Faiz (%)',
    loanMonths: 'Vade (Ay)',
    loanDown: 'Peşinat',
    calculate: 'Hesapla',
    monthlyPayment: 'Aylık Taksit',
    totalPayment: 'Toplam Ödeme',
    totalInterest: 'Toplam Faiz',
    rate: 'Puanla',
    yourRating: 'Sizin puanınız',
    favoritesTitle: 'Favorilerim',
    noFavorites: 'Henüz favori ilanın yok'
  },
  en: {
    heroTitle: 'Find Your Dream Home',
    heroSub: '🏠 Real estate listings from all over Turkey',
    searchPlaceholder: '🔍 Search city or title...',
    allTypes: 'All Types',
    forSale: 'For Sale',
    forRent: 'For Rent',
    land: 'Land',
    workplace: 'Commercial',
    search: 'Search',
    reset: 'Reset',
    total: 'Total',
    favorites: 'Favorites',
    login: 'Login',
    logout: 'Logout',
    listingsFound: 'listings found',
    noResults: 'No Results',
    loading: 'Loading listings...',
    newListing: 'Add New Listing',
    title: 'Title',
    city: 'Select City',
    district: 'District',
    price: 'Price',
    type: 'Type',
    rooms: 'Rooms',
    area: 'm²',
    bathroom: 'Bathroom',
    phone: 'Phone',
    image: 'Image URL',
    description: 'Description',
    save: 'Save',
    cancel: 'Cancel',
    loginTitle: 'Login',
    registerTitle: 'Register',
    username: 'Username',
    password: 'Password',
    contact: 'Contact',
    close: 'Close',
    loanCalc: 'Loan Calculator',
    loanAmount: 'Loan Amount',
    loanRate: 'Monthly Rate (%)',
    loanMonths: 'Term (Months)',
    loanDown: 'Down Payment',
    calculate: 'Calculate',
    monthlyPayment: 'Monthly Payment',
    totalPayment: 'Total Payment',
    totalInterest: 'Total Interest',
    rate: 'Rate',
    yourRating: 'Your rating',
    favoritesTitle: 'My Favorites',
    noFavorites: 'No favorites yet'
  }
}

export function useLanguage() {
  const [lang, setLang] = useState('tr')

  useEffect(() => {
    const saved = localStorage.getItem('emlak_lang')
    if (saved) setLang(saved)
  }, [])

  const toggleLang = () => {
    const next = lang === 'tr' ? 'en' : 'tr'
    setLang(next)
    localStorage.setItem('emlak_lang', next)
  }

  const t = (key) => {
    return TRANSLATIONS[lang][key] || key
  }

  return { lang, t, toggleLang }
}
