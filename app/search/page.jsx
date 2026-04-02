import { Suspense } from "react";
import Search from "@views/Search";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted">
          Chargement des accordeurs...
        </div>
      }
    >
      <Search />
    </Suspense>
  );
}
