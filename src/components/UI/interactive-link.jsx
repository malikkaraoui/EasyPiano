import { forwardRef } from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import {
  interactiveSurfaceBaseClasses,
  interactiveSurfaceToneClasses,
} from "@/components/UI/interactive-surface";
import { cn } from "@/lib/utils";

const interactiveLinkVariants = cva(
  cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg font-medium cursor-pointer",
    interactiveSurfaceBaseClasses,
  ),
  {
    variants: {
      tone: {
        muted: interactiveSurfaceToneClasses.muted,
        accent: interactiveSurfaceToneClasses.accent,
      },
      size: {
        nav: "px-3 py-2 text-sm",
        footer: "px-2 py-1.5 text-sm",
        compact: "px-1.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      tone: "muted",
      size: "nav",
    },
  },
);

function shouldRenderAnchor(href) {
  return (
    typeof href === "string" && /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)
  );
}

const InteractiveLink = forwardRef(function InteractiveLink(
  { href, tone, size, className, children, ...props },
  ref,
) {
  const classes = cn(interactiveLinkVariants({ tone, size }), className);

  if (shouldRenderAnchor(href)) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} className={classes} {...props}>
      {children}
    </Link>
  );
});

export { InteractiveLink, interactiveLinkVariants };
