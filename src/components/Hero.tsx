import { useEffect, useState } from "react";
import { ArrowRight, Play, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import malanjeImage from "@/assets/malanje.webp";

interface HeroProps {
  language: "pt" | "en";
}

const Hero = ({ language }: HeroProps) => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = {
    pt: {
      title: "Descubra Angola",
      subtitle: "A ponte que une cultura, confiança e tecnologia para revelar o futuro do turismo em Angola",
      cta1: "Explorar Serviços",
      cta2: "Conhecer Plataforma",
      ctaPartner: "Seja um Parceiro",
    },
    en: {
      title: "Discover Angola",
      subtitle: "The bridge that unites culture, trust and technology to reveal the future of tourism in Angola",
      cta1: "Explore Services",
      cta2: "Learn More",
      ctaPartner: "Become a Partner",
    },
  };

  const text = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={malanjeImage}
          alt="Quedas de Kalandula, Malanje"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
            {text.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {text.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="gradient-hero text-primary-foreground hover:opacity-90 transition-opacity group gap-2"
              onClick={() => {
                document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {text.cta1}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 gap-2"
              onClick={() => navigate('/partner-register')}
            >
              <Building2 className="h-5 w-5" />
              {text.ctaPartner}
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
