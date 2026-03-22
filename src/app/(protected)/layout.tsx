// ============================================
// Protected Layout — requires authentication
// ============================================
import Navbar from "@/components/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
}
