"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth";
import { Button } from "@/components/UI/button";

export default function Header() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="glass-strong sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="piano">
            🎹
          </span>
          <span className="font-heading text-xl font-bold text-foreground transition-colors hover:text-accent">
            EasyPiano
          </span>
        </Link>

        <nav
          className="flex items-center gap-4"
          aria-label="Navigation principale"
        >
          <Link
            href="/search"
            className="group relative hidden text-sm text-muted transition-colors hover:text-foreground sm:block"
          >
            Trouver un accordeur
            <span
              className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full"
              aria-hidden="true"
            />
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="group relative text-sm text-muted transition-colors hover:text-foreground"
              >
                Mes rendez-vous
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-accent transition-colors hover:text-accent-hover"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-border/50"
                  />
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  Déconnexion
                </Button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded border border-accent/30 bg-transparent px-3 text-xs font-medium text-foreground transition-all duration-300 hover:border-accent hover:text-accent"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
