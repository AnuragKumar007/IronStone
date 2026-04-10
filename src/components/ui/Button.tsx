// ============================================
// Button — Primary CTA & action component
// ============================================

const variantClasses = {
  primary:
    "bg-gradient-to-br from-red-600 to-red-900 text-white font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(220,38,38,0.4)]",
  secondary:
    "bg-surface-300 border border-zinc-800 text-white font-semibold hover:bg-surface-200 hover:border-zinc-700",
  outline:
    "bg-transparent border border-zinc-700 text-white font-semibold hover:border-red-500 hover:text-red-500",
  ghost:
    "bg-transparent text-gray-400 font-semibold hover:text-white hover:bg-surface-300",
} as const;

const sizeClasses = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-3.5",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <i className="ri-loader-4-line animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
