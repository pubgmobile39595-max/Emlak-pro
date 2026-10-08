import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Listings from './components/Listings'
import MapView from './components/MapView'
import MessagesModal from './components/MessagesModal'
import DetailModal from './components/DetailModal'
import AddListingModal from './components/AddListingModal'
import AuthModal from './components/AuthModal'
import FavoritesModal from './components/FavoritesModal'
import SavedSearchesModal from './components/SavedSearchesModal'
import { incrementView } from './hooks/useViewCounter'
import { useLanguage } from './hooks/useLanguage'
import { useNotifications } from './hooks/useNotifications'
import './App.css'

const API_URL = 'http://localhost:3000'

function App() {
  const { lang, t, toggleLang } = useLanguage()
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showFavModal, setShowFavModal] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  
  const { unreadCount } = useNotifications(user)

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
      setListings(data)
      setFilteredListings(data)
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

  const handleCardClick = (listing) => {
    setSelectedListing(listing)
    incrementView(listing.id)
    setListings(prev => prev.map(l => 
      l.id === listing.id ? { ...l, views: (l.views || 0) + 1 } : l
    ))
    setFilteredListings(prev => prev.map(l => 
      l.id === listing.id ? { ...l, views: (l.views || 0) + 1 } : l
    ))
  }

  const handleCardClickById = (id) => {
    const listing = listings.find(l => l.id === id)
    if (listing) handleCardClick(listing)
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
        unreadCount={unreadCount}
        lang={lang}
        t={t}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onFavoritesClick={() => setShowFavModal(true)}
        onMessagesClick={() => setShowMessages(true)}
        onLangToggle={toggleLang}
      />
      
      <Hero 
        listings={listings}
        setFilteredListings={setFilteredListings}
        t={t}
        onOpenSavedSearches={() => setShowSavedSearches(true)}
      />
      
      <Stats 
        listings={listings}
        favorites={favorites}
        t={t}
      />
      
      <MapView onCardClick={handleCardClickById} />
      
      <Listings
        listings={filteredListings}
        loading={loading}
        favorites={favorites}
        t={t}
        onCardClick={handleCardClick}
        onFavoriteClick={toggleFavorite}
      />
      
      {selectedListing && (
        <DetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
      
      {showMessages && user && (
        <MessagesModal
          user={user}
          onClose={() => setShowMessages(false)}
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
      
      {showSavedSearches && (
        <SavedSearchesModal
          onClose={() => setShowSavedSearches(false)}
          onLoadSearch={(filters) => {
            let filtered = [...listings]
            if (filters.search) {
              const q = filters.search.toLowerCase()
              filtered = filtered.filter(l => 
                l.title.toLowerCase().includes(q) ||
                l.location.toLowerCase().includes(q)
              )
            }
            if (filters.type) {
              filtered = filtered.filter(l => l.type === filters.type)
            }
            setFilteredListings(filtered)
          }}
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
