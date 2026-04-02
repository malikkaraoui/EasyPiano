const interactiveSurfaceBaseClasses =
  "border border-transparent bg-transparent transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

const interactiveSurfaceToneClasses = {
  muted:
    "text-foreground/78 hover:border-accent/35 hover:bg-accent/12 hover:text-foreground hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] active:border-accent/45 active:bg-accent/18 active:text-foreground active:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  accent:
    "border-accent/20 text-accent hover:border-accent/45 hover:bg-accent/14 hover:text-accent-hover hover:shadow-[0_12px_30px_rgba(212,197,160,0.16)] active:border-accent/55 active:bg-accent/20 active:text-accent-hover active:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
};

const interactiveButtonToneClasses = {
  primary:
    "border border-accent/70 bg-accent text-background shadow-[0_14px_32px_rgba(212,197,160,0.18)] hover:-translate-y-px hover:border-accent-hover hover:bg-accent-hover hover:text-background hover:shadow-[0_18px_40px_rgba(212,197,160,0.26)] active:translate-y-px active:border-accent/80 active:bg-[#c8b88d] active:text-background active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.24),0_8px_18px_rgba(212,197,160,0.14)]",
};

export {
  interactiveButtonToneClasses,
  interactiveSurfaceBaseClasses,
  interactiveSurfaceToneClasses,
};
