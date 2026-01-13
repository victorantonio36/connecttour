import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import DiscoverAngola from "@/components/DiscoverAngola";
import ExploreServices from "@/components/ExploreServices";
import SmartComparisonSection from "@/components/comparison/SmartComparisonSection";
import MarketingTeam from "@/components/MarketingTeam";
import Footer from "@/components/Footer";

const Index = () => {
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  return (
    <div className="min-h-screen">
      <Navigation language={language} setLanguage={setLanguage} />
      <main>
        <Hero language={language} />
        <Mission language={language} />
        <DiscoverAngola language={language} />
        <ExploreServices language={language} />
        <SmartComparisonSection language={language} />
        <MarketingTeam language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Index;
