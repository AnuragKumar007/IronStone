// ============================================
// Public Layout — with Navbar for content pages
// ============================================
import Navbar from "@/components/shared/Navbar";
import PageWrapper from "@/components/shared/PageWrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
    </div>
  );
}
