import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      whatsapp: "+244 939 319 554",
      whatsappNumber: "244939319554",
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
      whatsapp: "+244 939 319 554",
      whatsappNumber: "244939319554",
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

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${text.whatsappNumber}`, "_blank");
  };

  return (
    <footer id="contato" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">AC</span>
              </div>
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

              {/* WhatsApp Official Button */}
              <Button
                className="w-full justify-start gap-3 h-auto p-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                onClick={handleWhatsAppClick}
              >
                <svg 
                  className="h-6 w-6" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <div className="text-left">
                  <span className="text-xs opacity-80">WhatsApp</span>
                  <span className="block text-sm font-medium">{text.whatsapp}</span>
                </div>
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
