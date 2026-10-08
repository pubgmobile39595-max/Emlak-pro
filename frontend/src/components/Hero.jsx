import { useState } from 'react'
import { saveSearch } from '../hooks/useSavedSearches'

function Hero({ listings, setFilteredListings, t, onOpenSavedSearches }) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const handleSearch = () => {
    let filtered = [...listings]
    
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      )
    }
    
    if (type) {
      filtered = filtered.filter(l => l.type === type)
    }
    
    setFilteredListings(filtered)
  }

  const handleReset = () => {
    setSearch('')
    setType('')
    setFilteredListings(listings)
  }

  const handleSaveSearch = () => {
    if (!search && !type) {
      alert('⚠️ Kaydetmek için en az bir filtre seç!')
      return
    }

    const filters = { search, type }
    const saved = saveSearch(filters)
    alert('✅ Arama kaydedildi: ' + saved.name)
  }

  return (
    <section className="hero">
      <h1>{t ? t('heroTitle') : 'Hayalinizdeki Evi Bulun'}</h1>
      <p>{t ? t('heroSub') : "🏠 Türkiye'nin her yerinden emlak ilanları"}</p>
      
      <div className="search-box">
        <input
          type="text"
          placeholder={t ? t('searchPlaceholder') : '🔍 Şehir veya başlık ara...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">{t ? t('allTypes') : 'Tüm Tipler'}</option>
          <option value="Satılık">{t ? t('forSale') : 'Satılık'}</option>
          <option value="Kiralık">{t ? t('forRent') : 'Kiralık'}</option>
          <option value="Arsa">{t ? t('land') : 'Arsa'}</option>
          <option value="İş Yeri">{t ? t('workplace') : 'İş Yeri'}</option>
        </select>
        <button onClick={handleSearch}>{t ? t('search') : 'Ara'}</button>
        <button onClick={handleReset} className="reset-btn">{t ? t('reset') : 'Sıfırla'}</button>
      </div>

      <div className="search-actions">
        <button className="save-search-btn" onClick={handleSaveSearch}>
          💾 Aramayı Kaydet
        </button>
        <button className="saved-searches-btn" onClick={onOpenSavedSearches}>
          📋 Kayıtlı Aramalar
        </button>
      </div>
    </section>
  )
}

export default Hero
