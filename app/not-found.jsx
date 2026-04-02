import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-accent/20">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
        Page introuvable
      </h1>
      <p className="mt-2 text-sm text-muted">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-background shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[0.97]"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
