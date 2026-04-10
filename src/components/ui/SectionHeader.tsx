// ============================================
// SectionHeader — Consistent section heading
// ============================================

export interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  gradient?: boolean;
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = "center",
  gradient = false,
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? "text-center" : ""} ${className}`}>
      {label && (
        <span className="inline-flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-4 text-white text-xs font-semibold tracking-widest uppercase">
          {label}
        </span>
      )}
      <h2
        className={`text-3xl md:text-5xl font-bold leading-tight ${gradient ? "gradient-text" : "text-white"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-gray-400 max-w-2xl mt-4 text-lg ${isCenter ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
