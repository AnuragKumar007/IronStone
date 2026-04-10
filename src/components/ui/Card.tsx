// ============================================
// Card — Container with variant styles
// ============================================

const variantClasses = {
  default: "bg-surface-100 rounded-3xl border border-zinc-800/50",
  featured:
    "bg-surface-200 rounded-3xl border border-red-900/40 shadow-[0_0_40px_rgba(220,38,38,0.1)] gradient-border-effect",
  interactive:
    "bg-surface-100 rounded-3xl border border-zinc-800/50 card-hover hover:border-zinc-700 transition-all duration-300 cursor-pointer",
} as const;

const paddingClasses = {
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-10",
} as const;

export interface CardProps {
  variant?: keyof typeof variantClasses;
  padding?: keyof typeof paddingClasses;
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
