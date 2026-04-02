import { Suspense } from "react";
import ConfirmationContent from "./ConfirmationContent";

export const dynamic = "force-dynamic";

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted">
          Chargement...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
