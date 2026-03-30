import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-card", className)}
      {...props}
    />
  );
}

export { Skeleton };
