import { Badge } from "@/components/UI/badge";
import { ShieldCheck } from "lucide-react";

function ProBadge({ status, className }) {
  if (status !== "validated") return null;

  return (
    <Badge
      className={className}
      title="Cet accordeur a été rencontré et vérifié par notre équipe"
    >
      <ShieldCheck className="mr-1 h-3 w-3" />
      Validé par EasyPiano
    </Badge>
  );
}

export { ProBadge };
