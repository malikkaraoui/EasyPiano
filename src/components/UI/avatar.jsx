import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Avatar = forwardRef(function Avatar({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
});

const AvatarImage = forwardRef(function AvatarImage(
  { className, src, alt, ...props },
  ref,
) {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt || ""}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});

const AvatarFallback = forwardRef(function AvatarFallback(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-card text-muted",
        className,
      )}
      {...props}
    />
  );
});

export { Avatar, AvatarImage, AvatarFallback };
