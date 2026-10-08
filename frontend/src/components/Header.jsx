function Header({ user, favorites, onLoginClick, onLogout, onFavoritesClick }) {
  return (
    <header className="header">
      <div className="nav">
        <div className="logo">Emlak<span>Pro</span></div>
        <div className="nav-actions">
          <button 
            className="fav-header-btn"
            onClick={onFavoritesClick}
            title="Favoriler"
          >
            ❤️
            {favorites.length > 0 && (
              <span className="badge">{favorites.length}</span>
            )}
          </button>
          <button 
            className={`user-btn ${user ? 'logged-in' : ''}`}
            onClick={user ? onLogout : onLoginClick}
            title={user ? user.username : 'Giriş Yap'}
          >
            {user ? '👤 ' + user.username : '👤 Giriş'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
