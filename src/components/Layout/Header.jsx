"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth";
import { Button } from "@/components/UI/button";
import { Avatar, AvatarFallback } from "@/components/UI/avatar";
import { InteractiveLink } from "@/components/UI/interactive-link";

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
  const { user, isAdmin, isPro } = useAuth();

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
          <InteractiveLink href="/search" className="hidden sm:inline-flex">
            Trouver un accordeur
          </InteractiveLink>

          {user ? (
            <>
              <InteractiveLink href="/dashboard" className="inline-flex">
                Mes rendez-vous
              </InteractiveLink>
              {isAdmin && (
                <InteractiveLink href="/admin" tone="accent">
                  Admin
                </InteractiveLink>
              )}
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:opacity-90 active:scale-[0.97]"
                >
                  <UserAvatar user={user} />
                </Link>
                {isPro && (
                  <InteractiveLink
                    href="/pro-dashboard"
                    className="inline-flex"
                  >
                    Dashboard pro
                  </InteractiveLink>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  Déconnexion
                </Button>
              </div>
            </>
          ) : (
            <InteractiveLink
              href="/login"
              tone="accent"
              className="min-h-9 px-3 text-xs"
            >
              Connexion
            </InteractiveLink>
          )}
        </nav>
      </div>
    </header>
  );
}
