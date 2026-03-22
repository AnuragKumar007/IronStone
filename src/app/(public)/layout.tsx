// ============================================
// Public Layout — with Navbar for content pages
// ============================================
import Navbar from "@/components/Navbar";

export default function PublicLayout({
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
