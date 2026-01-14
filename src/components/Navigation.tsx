import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import angolaLogo from "@/assets/angola-connectour-logo.png";

interface NavigationProps {
  language: "pt" | "en";
  setLanguage: (lang: "pt" | "en") => void;
}

const Navigation = ({ language, setLanguage }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin, isLoading } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const navItems = language === "pt" 
    ? ["Início", "Descobrir", "Explorar", "Comparar", "Contato"]
    : ["Home", "Discover", "Explore", "Compare", "Contact"];

  const navLinks = {
    pt: {
      "Início": "#",
      "Descobrir": "#descobrir",
      "Explorar": "#explorar",
      "Comparar": "#comparar",
      "Contato": "#contato"
    },
    en: {
      "Home": "#",
      "Discover": "#descobrir",
      "Explore": "#explorar",
      "Compare": "#comparar",
      "Contact": "#contato"
    }
  };

  const handleMobileNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href !== "#") {
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/70 backdrop-blur-lg shadow-lg"
            : "bg-gradient-to-r from-primary/70 via-secondary/50 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with mobile background */}
            <div className="flex items-center gap-2">
              <div className="md:hidden bg-background/70 rounded-lg p-2 shadow-md backdrop-blur-sm">
                <img 
                  src={angolaLogo} 
                  alt="Angola ConnecTour" 
                  className={`h-10 w-auto object-contain transition-all duration-500 ${
                    isScrolled
                      ? "drop-shadow-lg brightness-110"
                      : "drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] brightness-105"
                  }`}
                />
              </div>
              <img 
                src={angolaLogo} 
                alt="Angola ConnecTour" 
                className={`hidden md:block h-14 lg:h-16 w-auto object-contain transition-all duration-500 ${
                  isScrolled
                    ? "drop-shadow-lg brightness-110 contrast-125"
                    : "drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] brightness-105"
                }`}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={navLinks[language][item as keyof typeof navLinks.pt]}
                  className="text-sm font-medium text-white hover:text-accent transition-colors drop-shadow-sm"
                >
                  {item}
                </a>
              ))}
              {!isLoading && isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  {language === "pt" ? "Painel Admin" : "Admin Panel"}
                </Link>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
                className="gap-2 text-white hover:bg-white/20 hover:text-white"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{language === "pt" ? "EN" : "PT"}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white hover:bg-white/20"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[9999] bg-primary/95 backdrop-blur-md flex flex-col justify-center items-center space-y-6 transition-all duration-500 ease-in-out ${
          isMobileMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 bg-accent text-primary w-10 h-10 rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center z-[10000]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo in mobile menu */}
        <div className="mb-8">
          <img 
            src={angolaLogo} 
            alt="Angola ConnecTour" 
            className="h-16 w-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Mobile Nav Links */}
        {navItems.map((item, index) => (
          <a
            key={item}
            href={navLinks[language][item as keyof typeof navLinks.pt]}
            onClick={(e) => {
              e.preventDefault();
              handleMobileNavClick(navLinks[language][item as keyof typeof navLinks.pt]);
            }}
            className="text-accent text-xl font-semibold tracking-wide hover:text-secondary transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {item}
          </a>
        ))}

        {/* Admin link in mobile menu */}
        {!isLoading && isAdmin && (
          <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-secondary text-xl font-semibold tracking-wide hover:text-accent transition-colors mt-4 animate-fade-in"
            style={{ animationDelay: `${navItems.length * 100}ms` }}
          >
            <Shield className="h-5 w-5" />
            {language === "pt" ? "Painel Admin" : "Admin Panel"}
          </Link>
        )}

        {/* Language toggle in mobile menu */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setLanguage(language === "pt" ? "en" : "pt");
            setIsMobileMenuOpen(false);
          }}
          className="mt-8 gap-2 border-accent text-accent hover:bg-accent hover:text-primary animate-fade-in"
          style={{ animationDelay: `${(navItems.length + 1) * 100}ms` }}
        >
          <Globe className="h-4 w-4" />
          {language === "pt" ? "English" : "Português"}
        </Button>
      </div>
    </>
  );
};

export default Navigation;
