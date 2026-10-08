import { useState, useEffect } from 'react'
import { getSavedSearches, deleteSearch } from '../hooks/useSavedSearches'

function SavedSearchesModal({ onClose, onLoadSearch }) {
  const [searches, setSearches] = useState([])

  useEffect(() => {
    setSearches(getSavedSearches())
  }, [])

  const handleDelete = (id) => {
    if (!confirm('Bu aramayı silmek istediğine emin misin?')) return
    const updated = deleteSearch(id)
    setSearches(updated)
  }

  const handleLoad = (search) => {
    onLoadSearch(search.filters)
    onClose()
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <h2>📋 Kayıtlı Aramalarım</h2>

          {searches.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '30px' }}>
              Henüz kayıtlı arama yok.
            </p>
          ) : (
            <div className="saved-searches-list">
              {searches.map(search => (
                <div key={search.id} className="saved-search-item">
                  <div 
                    className="saved-search-info"
                    onClick={() => handleLoad(search)}
                  >
                    <h4>🔍 {search.name}</h4>
                    <p>{new Date(search.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <button 
                    className="saved-search-delete"
                    onClick={() => handleDelete(search.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>Kapat</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedSearchesModal
