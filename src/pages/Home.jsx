import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Trouvez le meilleur{" "}
            <span className="highlight">accordeur de piano</span> près de chez
            vous
          </h1>
          <p className="hero-subtitle">
            EasyPiano met en relation particuliers et professionnels de
            l&apos;accord de piano. Simple, rapide et fiable.
          </p>
          <Link to="/search" className="btn-primary btn-lg">
            Trouver un accordeur
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>Comment ça marche ?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Recherchez</h3>
            <p>Trouvez un accordeur qualifié dans votre ville ou département</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Réservez</h3>
            <p>Choisissez un créneau et réservez en ligne en toute sécurité</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Profitez</h3>
            <p>Un professionnel vient accorder votre piano à domicile</p>
          </div>
        </div>
      </section>

      <section className="trust">
        <h2>Pourquoi EasyPiano ?</h2>
        <div className="trust-grid">
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <h3>Professionnels vérifiés</h3>
            <p>
              Tous nos accordeurs sont sélectionnés et validés par notre équipe
            </p>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⭐</span>
            <h3>Avis clients</h3>
            <p>
              Consultez les avis et notes des autres clients avant de réserver
            </p>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <h3>Paiement sécurisé</h3>
            <p>Paiement en ligne sécurisé via Stripe</p>
          </div>
          <div className="trust-item">
            <span className="trust-icon">📍</span>
            <h3>Partout en France</h3>
            <p>Des accordeurs disponibles dans toute la France</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Votre piano mérite le meilleur</h2>
        <p>
          Réservez dès maintenant votre accord de piano avec un professionnel
          certifié
        </p>
        <Link to="/search" className="btn-primary btn-lg">
          Commencer
        </Link>
      </section>
    </div>
  );
}
