function Header({ user, favorites, unreadCount, lang, t, onLoginClick, onLogout, onFavoritesClick, onLangToggle, onMessagesClick }) {
  return (
    <header className="header">
      <div className="nav">
        <div className="logo">Emlak<span>Pro</span></div>
        <div className="nav-actions">
          <button 
            className="lang-btn"
            onClick={onLangToggle}
            title="Dil Değiştir"
          >
            {lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
          </button>
          
          {user && (
            <button 
              className="fav-header-btn"
              onClick={onMessagesClick}
              title="Mesajlar"
            >
              💬
              {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
              )}
            </button>
          )}
          
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
            {user ? '👤 ' + user.username : '👤 ' + t('login')}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
