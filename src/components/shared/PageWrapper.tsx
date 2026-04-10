// ============================================
// PageWrapper — Clears fixed navbar + min height
// ============================================

export default function PageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`pt-24 min-h-screen ${className}`}>
      {children}
    </main>
  );
}
