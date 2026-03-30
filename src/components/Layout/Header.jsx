"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth";
import { Button } from "@/components/UI/button";

export default function Header() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="piano">
            🎹
          </span>
          <span className="font-heading text-xl font-bold text-foreground">
            EasyPiano
          </span>
        </Link>

        <nav
          className="flex items-center gap-4"
          aria-label="Navigation principale"
        >
          <Link
            href="/search"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:block"
          >
            Trouver un accordeur
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                Mes rendez-vous
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
                    className="h-8 w-8 rounded-full object-cover"
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
              className="inline-flex h-9 items-center rounded border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-card"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
