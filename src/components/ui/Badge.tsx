// ============================================
// Badge — Status & category indicator pill
// ============================================

const variantClasses = {
  success: "bg-green-500/10 text-green-500",
  warning: "bg-amber-500/10 text-amber-500",
  danger: "bg-red-500/10 text-red-500",
  info: "bg-blue-500/10 text-blue-500",
  neutral: "bg-zinc-500/10 text-zinc-400",
} as const;

const sizeClasses = {
  sm: "text-xs px-2.5 py-0.5",
  md: "text-sm px-3 py-1",
} as const;

export interface BadgeProps {
  variant: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant,
  size = "sm",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
