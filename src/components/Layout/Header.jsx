import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth";

export default function Header() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎹</span>
          <span className="logo-text">EasyPiano</span>
        </Link>

        <nav className="nav">
          <Link to="/search" className="nav-link">
            Trouver un accordeur
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Mes rendez-vous
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link nav-admin">
                  Admin
                </Link>
              )}
              <div className="nav-user">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="nav-avatar"
                />
                <button onClick={logout} className="btn-logout">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-login">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
