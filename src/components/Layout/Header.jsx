"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth";
import { Button } from "@/components/UI/button";
import { Avatar, AvatarFallback } from "@/components/UI/avatar";

function getAvatarFallbackLabel(user) {
  const source = user?.displayName || user?.email || "EasyPiano";

  return (
    source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "EP"
  );
}

function normalizeAvatarUrl(photoURL) {
  if (!photoURL) {
    return "";
  }

  try {
    const url = new URL(photoURL);

    if (url.hostname.endsWith("googleusercontent.com")) {
      url.searchParams.set("sz", "128");
    }

    return url.toString();
  } catch {
    return photoURL;
  }
}

function UserAvatar({ user }) {
  const [hasImageError, setHasImageError] = useState(false);
  const avatarSrc = useMemo(
    () => normalizeAvatarUrl(user?.photoURL),
    [user?.photoURL],
  );
  const fallbackLabel = useMemo(() => getAvatarFallbackLabel(user), [user]);

  return (
    <Avatar
      key={avatarSrc || fallbackLabel}
      className="h-8 w-8 ring-1 ring-border/50"
    >
      {avatarSrc && !hasImageError ? (
        <img
          src={avatarSrc}
          alt={user?.displayName || "Avatar"}
          className="h-full w-full rounded-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <AvatarFallback className="bg-secondary text-[11px] font-semibold text-foreground">
          {fallbackLabel}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

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
                <UserAvatar user={user} />
                <Button variant="ghost" size="sm" onClick={logout}>
                  Déconnexion
                </Button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded border border-accent/30 bg-transparent px-3 text-xs font-medium text-foreground transition-all duration-200 hover:border-accent hover:bg-accent hover:text-background hover:shadow-[0_0_15px_rgba(212,197,160,0.2)] active:scale-95 active:shadow-none"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
