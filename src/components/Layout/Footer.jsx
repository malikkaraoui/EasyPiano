import Link from "next/link";

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
          <Link href="/search">Trouver un accordeur</Link>
          <Link href="/login">Connexion</Link>
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
