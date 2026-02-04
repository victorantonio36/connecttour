import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import angolaLogo from "@/assets/angola-connectour-logo.png";

interface FooterProps {
  language: "pt" | "en";
}

const Footer = ({ language }: FooterProps) => {
  const content = {
    pt: {
      slogan: "A ponte que une cultura, confiança e tecnologia",
      contact: "Contato",
      email: "angolaconecttour@gmail.com",
      phone: "+244 939 319 554",
      address: "Luanda, Angola",
      rights: "Todos os direitos reservados",
      links: {
        about: "Sobre Nós",
        destinations: "Destinos",
        partners: "Parceiros",
        becomePartner: "Seja um Parceiro",
        terms: "Termos de Uso",
        privacy: "Privacidade",
      },
    },
    en: {
      slogan: "The bridge that unites culture, trust and technology",
      contact: "Contact",
      email: "angolaconecttour@gmail.com",
      phone: "+244 939 319 554",
      address: "Luanda, Angola",
      rights: "All rights reserved",
      links: {
        about: "About Us",
        destinations: "Destinations",
        partners: "Partners",
        becomePartner: "Become a Partner",
        terms: "Terms of Use",
        privacy: "Privacy",
      },
    },
  };

  const text = content[language];

  const handleEmailClick = () => {
    window.location.href = `mailto:${text.email}`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${text.phone.replace(/\s/g, "")}`;
  };

  return (
    <footer id="contato" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={angolaLogo} 
                alt="Angola ConnecTour" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold text-foreground">Angola ConnecTour</h3>
                <p className="text-sm text-muted-foreground">{text.slogan}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-foreground">{text.links.about}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#sobre" className="text-muted-foreground hover:text-primary transition-colors">
                  {text.links.about}
                </a>
              </li>
              <li>
                <a href="#destinos" className="text-muted-foreground hover:text-primary transition-colors">
                  {text.links.destinations}
                </a>
              </li>
              <li>
                <a href="#parceiros" className="text-muted-foreground hover:text-primary transition-colors">
                  {text.links.partners}
                </a>
              </li>
              <li>
                <a href="/partner-register" className="text-accent hover:text-accent/80 transition-colors font-medium">
                  {text.links.becomePartner}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-foreground">{text.contact}</h4>
            <div className="space-y-3">
              {/* Email */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-2 text-muted-foreground hover:text-primary"
                onClick={handleEmailClick}
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">{text.email}</span>
              </Button>

              {/* Phone */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-2 text-muted-foreground hover:text-primary"
                onClick={handlePhoneClick}
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">{text.phone}</span>
              </Button>

              {/* Address */}
              <div className="flex items-start gap-3 p-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">{text.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Angola ConnecTour. {text.rights}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                {text.links.terms}
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                {text.links.privacy}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
