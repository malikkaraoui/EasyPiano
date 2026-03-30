"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const DialogOverlay = forwardRef(function DialogOverlay(
  { className, open, onClose, ...props },
  ref,
) {
  if (!open) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        className,
      )}
      onClick={onClose}
      {...props}
    />
  );
});

const DialogContent = forwardRef(function DialogContent(
  { className, children, open, onClose, ...props },
  ref,
) {
  if (!open) return null;
  return (
    <>
      <DialogOverlay open={open} onClose={onClose} />
      <div
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 sm:rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </button>
      </div>
    </>
  );
});

const DialogHeader = function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
};

const DialogTitle = forwardRef(function DialogTitle(
  { className, ...props },
  ref,
) {
  return (
    <h2
      ref={ref}
      className={cn(
        "font-heading text-lg leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
});

const DialogDescription = forwardRef(function DialogDescription(
  { className, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cn("text-sm text-muted", className)} {...props} />
  );
});

export {
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
