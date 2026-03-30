"use client";

import { useState, useCallback } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground",
        success: "border-success/50 bg-success/10 text-success",
        destructive: "border-destructive/50 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Toast({ className, variant, title, description, onClose, ...props }) {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="grid gap-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
      return id;
    },
    [],
  );

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}

export { Toast, toastVariants, useToast };
