import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  language: "pt" | "en";
  setLanguage: (lang: "pt" | "en") => void;
}

const Navigation = ({ language, setLanguage }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = language === "pt" 
    ? ["Início", "Missão", "Explorar", "Parceiros", "Contato"]
    : ["Home", "Mission", "Explore", "Partners", "Contact"];

  const navLinks = {
    pt: {
      "Início": "#",
      "Missão": "#missao",
      "Explorar": "#explorar",
      "Parceiros": "#parceiros",
      "Contato": "#contato"
    },
    en: {
      "Home": "#",
      "Mission": "#missao",
      "Explore": "#explorar",
      "Partners": "#parceiros",
      "Contact": "#contato"
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Angola ConnecTour</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {language === "pt" ? "Plataforma Nacional de Turismo" : "National Tourism Platform"}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={navLinks[language][item as keyof typeof navLinks.pt]}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "pt" ? "EN" : "PT"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-fade-in">
            {navItems.map((item) => (
              <a
                key={item}
                href={navLinks[language][item as keyof typeof navLinks.pt]}
                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
