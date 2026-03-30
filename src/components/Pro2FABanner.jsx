"use client";

import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/UI/button";

function Pro2FABanner({ has2FA, hasBookings, onSetup2FA }) {
  if (has2FA || !hasBookings) return null;

  return (
    <div
      role="alert"
      className="mb-6 flex items-center justify-between rounded-lg border border-accent/50 bg-accent/10 p-4"
    >
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-accent" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Activez la vérification en 2 étapes
          </p>
          <p className="text-xs text-muted">
            Obligatoire pour accéder aux détails de vos réservations
          </p>
        </div>
      </div>
      <Button size="sm" onClick={onSetup2FA}>
        Activer
      </Button>
    </div>
  );
}

export { Pro2FABanner };
