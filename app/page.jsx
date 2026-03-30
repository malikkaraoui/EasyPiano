import Link from "next/link";
import { ShieldCheck, Banknote, Lock, Clock, Search } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";

export const metadata = {
  title: "EasyPiano - Accordeur de Piano en Suisse | Réservation en ligne",
  description:
    "Trouvez et réservez un accordeur de piano qualifié en Suisse. Prix fixe 150 CHF, booking instantané, pros validés physiquement.",
};

function HeroSearchBar() {
  return (
    <form
      action="/search"
      method="get"
      className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
    >
      <Input
        type="text"
        name="lieu"
        placeholder="Ville ou code postal"
        aria-label="Lieu de recherche"
        className="h-12 flex-1 border-border/50 bg-card/50 text-foreground placeholder:text-muted backdrop-blur-sm"
        autoComplete="off"
      />
      <Input
        type="date"
        name="date"
        aria-label="Date souhaitée"
        className="h-12 sm:w-44 border-border/50 bg-card/50 text-foreground backdrop-blur-sm"
      />
      <Button type="submit" size="lg" className="h-12 gap-2">
        <Search className="h-4 w-4" />
        Rechercher
      </Button>
    </form>
  );
}

function StepCard({ number, title, description, delay }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-background">
          {number}
        </div>
        <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
    </ScrollReveal>
  );
}

function TrustCard({ icon, title, description, delay }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="rounded border border-border/50 bg-card p-6 transition-shadow hover:shadow-lg">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          {icon}
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
    </ScrollReveal>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-7xl">
          On accorde <span className="text-accent">votre piano</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted sm:text-xl">
          Trouvez et réservez un accordeur qualifié en Suisse. Prix fixe,
          booking instantané, pros validés physiquement.
        </p>
        <HeroSearchBar />
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <ScrollReveal>
          <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Comment ça marche ?
          </h2>
        </ScrollReveal>
        <div className="grid gap-12 sm:grid-cols-3">
          <StepCard
            number={1}
            title="Recherchez"
            description="Entrez votre ville et la date souhaitée"
            delay={0.1}
          />
          <StepCard
            number={2}
            title="Réservez"
            description="Choisissez un accordeur et payez en ligne"
            delay={0.2}
          />
          <StepCard
            number={3}
            title="Profitez"
            description="Un pro vient accorder votre piano chez vous"
            delay={0.3}
          />
        </div>
      </section>

      {/* Pourquoi nous faire confiance */}
      <section className="border-t border-border/30 bg-card/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-12 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Pourquoi nous faire confiance ?
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <TrustCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Pros vérifiés"
              description="Chaque accordeur est rencontré et validé physiquement par notre équipe"
              delay={0.1}
            />
            <TrustCard
              icon={<Banknote className="h-5 w-5" />}
              title="Prix fixe 150 CHF"
              description="Tarif transparent, zéro surprise. Commission incluse."
              delay={0.2}
            />
            <TrustCard
              icon={<Lock className="h-5 w-5" />}
              title="Paiement sécurisé"
              description="Paiement en ligne via Stripe, conforme PCI-DSS."
              delay={0.3}
            />
            <TrustCard
              icon={<Clock className="h-5 w-5" />}
              title="Booking instantané"
              description="Réservez en moins de 3 minutes, confirmation immédiate."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* CTA Devenez accordeur */}
      <section className="px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl rounded-lg border border-border/50 bg-card p-8 text-center sm:p-12">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Vous êtes accordeur de piano ?
            </h2>
            <p className="mt-3 text-muted">
              Rejoignez EasyPiano et accédez à de nouveaux clients en Suisse et
              en Europe.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded border border-accent bg-transparent px-8 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background"
            >
              Devenez accordeur
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
