import { useState } from 'react'

function Hero({ listings, setFilteredListings }) {
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

  return (
    <section className="hero">
      <h1>Hayalinizdeki Evi Bulun</h1>
      <p>🏠 Türkiye'nin her yerinden emlak ilanları</p>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Şehir veya başlık ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tüm Tipler</option>
          <option value="Satılık">Satılık</option>
          <option value="Kiralık">Kiralık</option>
          <option value="Arsa">Arsa</option>
          <option value="İş Yeri">İş Yeri</option>
        </select>
        <button onClick={handleSearch}>Ara</button>
        <button onClick={handleReset} className="reset-btn">Sıfırla</button>
      </div>
    </section>
  )
}

export default Hero
