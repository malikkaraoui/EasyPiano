import Link from "next/link";
import { PianoKeys } from "@/components/PianoKeys";

export default function Footer() {
  return (
    <footer className="relative bg-background">
      <PianoKeys />
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
                  className="inline-block rounded px-1.5 py-0.5 text-sm text-muted transition-all duration-200 hover:bg-card hover:text-foreground active:scale-[0.97] active:bg-card/80"
                >
                  Trouver un accordeur
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="inline-block rounded px-1.5 py-0.5 text-sm text-muted transition-all duration-200 hover:bg-card hover:text-foreground active:scale-[0.97] active:bg-card/80"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="inline-block rounded px-1.5 py-0.5 text-sm text-accent transition-all duration-200 hover:bg-accent/10 hover:text-accent-hover active:scale-[0.97] active:bg-accent/5"
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
                  className="inline-block rounded px-1.5 py-0.5 text-sm text-muted transition-all duration-200 hover:bg-card hover:text-foreground active:scale-[0.97] active:bg-card/80"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 text-center">
          <p className="font-heading text-xs uppercase tracking-widest text-muted/60">
            &copy; {new Date().getFullYear()} EasyPiano. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
