import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="logo-icon">🎹</span>
          <span>EasyPiano</span>
          <p className="footer-tagline">
            La plateforme de mise en relation pour l&apos;accord de piano
          </p>
        </div>

        <div className="footer-links">
          <Link to="/search">Trouver un accordeur</Link>
          <Link to="/login">Connexion</Link>
        </div>

        <div className="footer-legal">
          <p>
            &copy; {new Date().getFullYear()} EasyPiano. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
