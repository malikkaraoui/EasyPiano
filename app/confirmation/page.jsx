"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/UI/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

function generateICS({ date, slot, proName }) {
  const slotStart = slot === "morning" ? "09:00" : "14:00";
  const slotEnd = slot === "morning" ? "12:00" : "17:00";
  const dtStart = `${date.replace(/-/g, "")}T${slotStart.replace(":", "")}00`;
  const dtEnd = `${date.replace(/-/g, "")}T${slotEnd.replace(":", "")}00`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EasyPiano//Booking//FR",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Accordage piano — ${proName || "EasyPiano"}`,
    "DESCRIPTION:Votre accordeur viendra accorder votre piano.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "easypiano-rdv.ics";
  link.click();
  URL.revokeObjectURL(url);
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <ScrollReveal>
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-success" strokeWidth={1.5} />
        </div>

        <h1 className="mt-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Bravo !
        </h1>
        <p className="mt-3 font-heading text-lg text-accent">
          Votre piano va enfin chanter comme à ses premiers jours
        </p>
        <p className="mt-4 text-sm text-muted">
          Votre réservation est confirmée. Vous recevrez un email de
          confirmation sous quelques minutes.
        </p>

        {sessionId && (
          <p className="mt-2 text-xs text-muted/60">
            Référence : {sessionId.slice(0, 20)}...
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() =>
              generateICS({
                date: new Date().toISOString().split("T")[0],
                slot: "morning",
                proName: "Votre accordeur",
              })
            }
          >
            <Calendar className="h-4 w-4" />
            Ajouter à mon agenda
          </Button>

          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-background shadow-sm transition-all duration-200 hover:bg-accent-hover hover:shadow-md active:scale-[0.97]"
          >
            Mes rendez-vous
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 rounded-xl border border-border/30 bg-card/50 p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Et maintenant ?
          </h2>
          <ul className="mt-4 space-y-3 text-left text-sm text-muted">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                1
              </span>
              <span>
                Vous recevrez un email de confirmation avec les détails
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                2
              </span>
              <span>
                Un rappel vous sera envoyé 2 jours puis 2h avant le RDV
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                3
              </span>
              <span>
                L&apos;accordeur viendra à l&apos;adresse indiquée pour accorder
                votre piano
              </span>
            </li>
          </ul>
        </div>
      </ScrollReveal>
    </div>
  );
}
