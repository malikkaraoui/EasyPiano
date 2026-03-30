import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="piano">
                🎹
              </span>
              <span className="font-heading text-lg font-bold">EasyPiano</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Trouvez et réservez un accordeur de piano qualifié en Suisse.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Trouver un accordeur
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-accent transition-colors hover:text-accent-hover"
                >
                  Devenez accordeur
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-muted">contact@easypiano.ch</li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} EasyPiano. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
