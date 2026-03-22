// ============================================
// Auth Layout — minimal, no navbar/smooth scroll
// ============================================
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
