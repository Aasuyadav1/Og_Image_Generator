
import OGImageGenerator from "@/components/ImageGenerator/OGImageGenerator";
import Header from "@/components/Header";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="!w-full">
      <Header />
      <OGImageGenerator />
      <InfoSection />
    
      <Footer />
    </main>
  );
};

export default Index;
