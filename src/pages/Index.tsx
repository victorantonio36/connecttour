import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Destinations from "@/components/Destinations";
import Footer from "@/components/Footer";

const Index = () => {
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  return (
    <div className="min-h-screen">
      <Navigation language={language} setLanguage={setLanguage} />
      <main>
        <Hero language={language} />
        <Mission language={language} />
        <Destinations language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Index;
