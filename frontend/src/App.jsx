import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Listings from './components/Listings'
import DetailModal from './components/DetailModal'
import AddListingModal from './components/AddListingModal'
import AuthModal from './components/AuthModal'
import FavoritesModal from './components/FavoritesModal'
import './App.css'

const API_URL = 'http://localhost:3000'

function App() {
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showFavModal, setShowFavModal] = useState(false)
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    fetchListings()
    
    const savedUser = localStorage.getItem('emlak_user')
    if (savedUser) setUser(JSON.parse(savedUser))
    
    const savedFavs = localStorage.getItem('emlak_favs')
    if (savedFavs) setFavorites(JSON.parse(savedFavs))
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/listings`)
      const data = await res.json()
      
      // Her ilana img kontrolü
      const withImg = data.map(l => ({
        ...l,
        img: l.img && l.img.startsWith('http') 
          ? l.img 
          : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
      }))
      
      setListings(withImg)
      setFilteredListings(withImg)
    } catch (err) {
      console.error('İlanlar yüklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (id) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavs)
    localStorage.setItem('emlak_favs', JSON.stringify(newFavs))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('emlak_user')
    localStorage.removeItem('emlak_token')
  }

  return (
    <div className="app">
      <Header 
        user={user}
        favorites={favorites}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onFavoritesClick={() => setShowFavModal(true)}
      />
      
      <Hero 
        listings={listings}
        setFilteredListings={setFilteredListings}
      />
      
      <Stats 
        listings={listings}
        favorites={favorites}
      />
      
      <Listings
        listings={filteredListings}
        loading={loading}
        favorites={favorites}
        onCardClick={setSelectedListing}
        onFavoriteClick={toggleFavorite}
      />
      
      {selectedListing && (
        <DetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
      
      {showFavModal && (
        <FavoritesModal
          listings={listings}
          favorites={favorites}
          onClose={() => setShowFavModal(false)}
          onCardClick={setSelectedListing}
          onFavoriteClick={toggleFavorite}
        />
      )}
      
      {showAddModal && (
        <AddListingModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchListings}
          user={user}
        />
      )}
      
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(userData) => {
            setUser(userData)
            setShowAuthModal(false)
          }}
        />
      )}
      
      {user && (
        <button 
          className="add-btn"
          onClick={() => setShowAddModal(true)}
          title="İlan Ekle"
        >
          +
        </button>
      )}
    </div>
  )
}

export default App
