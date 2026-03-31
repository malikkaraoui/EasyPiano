import Link from "next/link";
import { ShieldCheck, Banknote, Lock, Clock } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  HeroReveal,
  HeroSearchReveal,
  ScrollIndicator,
} from "@/components/animations/HeroReveal";
import { HeroSearchBar } from "@/components/HeroSearchBar";

export const metadata = {
  title: "EasyPiano - Accordeur de Piano en Suisse | Réservation en ligne",
  description:
    "Trouvez et réservez un accordeur de piano qualifié en Suisse. Prix fixe 150 CHF, booking instantané, pros validés physiquement.",
};

function StepCard({ number, title, description, delay }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="group relative flex flex-col items-center text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-background text-lg font-bold text-accent transition-all duration-300 glow-gold-hover group-hover:bg-accent group-hover:text-background">
          {number}
        </div>
        <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
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
      <div className="group rounded-xl border border-glow p-6 glass transition-all duration-300 hover:-translate-y-1">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent/20">
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
      <section className="spotlight-strong relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <HeroReveal>
          <h1 className="font-heading text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
            On accorde <span className="text-accent">votre piano</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">
            Trouvez et réservez un accordeur qualifié en Suisse. Prix fixe,
            booking instantané, pros validés physiquement.
          </p>
          <HeroSearchReveal>
            <HeroSearchBar />
          </HeroSearchReveal>
          <ScrollIndicator />
        </HeroReveal>
        <div
          className="piano-keys absolute bottom-0 left-0 right-0"
          aria-hidden="true"
        />
      </section>

      {/* Comment ça marche */}
      <section className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <ScrollReveal>
          <h2 className="mb-16 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Comment ça marche ?
          </h2>
        </ScrollReveal>
        {/* Golden connector line */}
        <div
          className="absolute left-1/2 top-[55%] hidden h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent sm:block"
          aria-hidden="true"
        />
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
      <section className="spotlight relative border-t border-border/30 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-16 text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
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
      <section className="relative px-4 py-24 sm:px-6">
        <div
          className="mx-auto mb-12 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
          aria-hidden="true"
        />
        <ScrollReveal>
          <div className="mx-auto max-w-2xl rounded-xl border border-glow p-8 text-center glass sm:p-12">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Vous êtes accordeur de piano ?
            </h2>
            <p className="mt-3 text-muted">
              Rejoignez EasyPiano et accédez à de nouveaux clients en Suisse et
              en Europe.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded border border-accent bg-transparent px-8 text-sm font-medium text-accent transition-all duration-300 glow-gold-hover hover:bg-accent hover:text-background"
            >
              Devenez accordeur
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
