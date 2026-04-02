import { forwardRef } from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const interactiveLinkVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-transparent bg-transparent font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]",
  {
    variants: {
      tone: {
        muted:
          "text-muted hover:border-border/80 hover:bg-card hover:text-foreground hover:shadow-sm active:border-border/60 active:bg-card/80 active:text-foreground active:shadow-none",
        accent:
          "text-accent hover:border-accent/30 hover:bg-accent/10 hover:text-accent-hover hover:shadow-sm active:border-accent/20 active:bg-accent/5 active:text-accent active:shadow-none",
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
