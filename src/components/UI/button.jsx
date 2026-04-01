import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-background shadow-sm hover:bg-accent-hover hover:shadow-md active:bg-accent active:shadow-none",
        secondary:
          "border border-border bg-transparent text-foreground shadow-sm hover:border-accent/50 hover:bg-card hover:shadow-md active:bg-card/80 active:shadow-none",
        destructive:
          "bg-destructive text-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:bg-destructive/80 active:shadow-none",
        ghost:
          "text-muted hover:bg-card hover:text-foreground active:bg-card/80",
        link: "text-accent underline-offset-4 hover:underline active:text-accent-hover",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = forwardRef(function Button(
  { className, variant, size, ...props },
  ref,
) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

export { Button, buttonVariants };
