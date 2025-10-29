import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import miradouroImage from "@/assets/miradouro-lua.jpg";
import grutasImage from "@/assets/grutas-nzenzo.jpg";
import huamboImage from "@/assets/huambo.jpg";
import huilaImage from "@/assets/huila-ambaca.jpg";
import kalandulaImage from "@/assets/kalandula.jpg";

interface DestinationsProps {
  language: "pt" | "en";
}

const Destinations = ({ language }: DestinationsProps) => {
  const content = {
    pt: {
      title: "Destinos em Destaque",
      subtitle: "Explore as maravilhas naturais e culturais de Angola",
      cta: "Explorar",
      destinations: [
        {
          name: "Miradouro da Lua",
          province: "Luanda",
          description: "Paisagem lunar única esculpida pela erosão ao longo de milênios",
          image: miradouroImage,
        },
        {
          name: "Grutas do Nzenzo",
          province: "Uíge",
          description: "Formações rochosas impressionantes e cavernas místicas",
          image: grutasImage,
        },
        {
          name: "Planalto Central",
          province: "Huambo",
          description: "Terras altas com clima temperado e paisagens verdejantes",
          image: huamboImage,
        },
        {
          name: "Serra da Leba",
          province: "Huíla",
          description: "Estrada sinuosa com vistas panorâmicas espetaculares",
          image: huilaImage,
        },
        {
          name: "Quedas de Kalandula",
          province: "Malanje",
          description: "Uma das maiores cascatas de África, majestosa e imponente",
          image: kalandulaImage,
        },
      ],
    },
    en: {
      title: "Featured Destinations",
      subtitle: "Explore the natural and cultural wonders of Angola",
      cta: "Explore",
      destinations: [
        {
          name: "Miradouro da Lua",
          province: "Luanda",
          description: "Unique lunar landscape carved by erosion over millennia",
          image: miradouroImage,
        },
        {
          name: "Grutas do Nzenzo",
          province: "Uíge",
          description: "Impressive rock formations and mystical caves",
          image: grutasImage,
        },
        {
          name: "Central Plateau",
          province: "Huambo",
          description: "Highlands with temperate climate and green landscapes",
          image: huamboImage,
        },
        {
          name: "Serra da Leba",
          province: "Huíla",
          description: "Winding road with spectacular panoramic views",
          image: huilaImage,
        },
        {
          name: "Kalandula Falls",
          province: "Malanje",
          description: "One of Africa's largest waterfalls, majestic and imposing",
          image: kalandulaImage,
        },
      ],
    },
  };

  const text = content[language];

  return (
    <section id="destinos" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {text.title}
          </h2>
          <p className="text-xl text-muted-foreground">{text.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {text.destinations.map((destination, index) => (
            <div
              key={destination.name}
              className="group relative overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-all duration-500 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{destination.province}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {destination.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {destination.description}
                </p>
                <Button
                  variant="ghost"
                  className="text-accent hover:text-accent/80 p-0 h-auto font-semibold group/btn"
                >
                  {text.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
