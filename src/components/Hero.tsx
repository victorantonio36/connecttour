import { useEffect, useState } from "react";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedHeroBackground from "./AnimatedHeroBackground";
import angolaConnectourLogo from "@/assets/angola-connectour-logo.png";
interface HeroProps {
  language: "pt" | "en";
}
const Hero = ({
  language
}: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Preload logo
    const img = new Image();
    img.src = angolaConnectourLogo;
    img.onload = () => setIsLoaded(true);

    // Fallback in case image doesn't load
    const timeout = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timeout);
  }, []);
  const content = {
    pt: {
      title: "Descubra Angola",
      subtitle: "A ponte que une cultura, confiança e tecnologia para revelar o futuro do turismo em Angola",
      cta1: "Explorar Serviços",
      cta2: "Conhecer Plataforma",
      ctaPartner: "Seja um Parceiro"
    },
    en: {
      title: "Discover Angola",
      subtitle: "The bridge that unites culture, trust and technology to reveal the future of tourism in Angola",
      cta1: "Explore Services",
      cta2: "Learn More",
      ctaPartner: "Become a Partner"
    }
  };
  const text = content[language];
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Premium Background */}
      <AnimatedHeroBackground />

      {/* Content Container */}
      <div className={`container relative z-10 mx-auto px-4 pt-32 pb-20 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Official Logo */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="relative">
              
              {/* Subtle glow behind logo */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-30" style={{
              background: "radial-gradient(circle, rgba(227, 206, 170, 0.5) 0%, transparent 70%)"
            }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white text-balance leading-tight animate-fade-in-up" style={{
          textShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
          animationDelay: "200ms"
        }}>
            {text.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-balance animate-fade-in-up" style={{
          textShadow: "0 2px 15px rgba(0, 0, 0, 0.2)",
          animationDelay: "400ms"
        }}>
            {text.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up" style={{
          animationDelay: "600ms"
        }}>
            <Button size="lg" className="bg-connectour-golden hover:bg-connectour-golden/90 text-connectour-deep border-0 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(227,206,170,0.4)] group gap-2" onClick={() => {
            document.getElementById("explorar")?.scrollIntoView({
              behavior: "smooth"
            });
          }}>
              {text.cta1}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-105 gap-2" onClick={() => navigate('/partner-register')}>
              <Building2 className="h-5 w-5" />
              {text.ctaPartner}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>;
};
export default Hero;