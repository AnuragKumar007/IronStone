// Home Page
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkoutPlansSection from "@/components/WorkoutPlansSection";
import DefineGoalsSection from "@/components/DefineGoalsSection";
import DifficultSection from "@/components/DifficultSection";
import StyleSection from "@/components/StyleSection";
import MembershipSection from "@/components/MembershipSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import FloatingImagesSection from "@/components/FloatingImagesSection";
import DownloadAppSection from "@/components/DownloadAppSection";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen font-sans">
      {/* <LoadingScreen /> */}
      <Navbar />
      <HeroSection />
      <FloatingImagesSection />
      <WorkoutPlansSection />
      <DefineGoalsSection />
      {/* <DifficultSection />
      <StyleSection /> */}
      <MembershipSection />
      <ReviewsCarousel />
      <DownloadAppSection />
      <Footer />
    </main>
  );
}
