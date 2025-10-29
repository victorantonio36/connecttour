import { Target, Eye, Heart, TrendingUp } from "lucide-react";

interface MissionProps {
  language: "pt" | "en";
}

const Mission = ({ language }: MissionProps) => {
  const content = {
    pt: {
      title: "Nossa Identidade",
      mission: {
        title: "Missão",
        text: "Conectar viajantes a experiências autênticas e operadores certificados, promovendo um turismo sustentável, confiável e inovador em Angola.",
      },
      vision: {
        title: "Visão",
        text: "Ser a plataforma de referência para o turismo digital em Angola, reconhecida pela excelência, transparência e impacto no desenvolvimento do setor.",
      },
      values: {
        title: "Valores",
        text: "Cultura, Confiança, Tecnologia, Sustentabilidade e Excelência guiam cada decisão e ação da nossa plataforma.",
      },
      objectives: {
        title: "Objetivos Estratégicos",
        text: "Certificar parceiros, digitalizar experiências turísticas e posicionar Angola como destino turístico de classe mundial.",
      },
    },
    en: {
      title: "Our Identity",
      mission: {
        title: "Mission",
        text: "Connect travelers to authentic experiences and certified operators, promoting sustainable, reliable and innovative tourism in Angola.",
      },
      vision: {
        title: "Vision",
        text: "To be the reference platform for digital tourism in Angola, recognized for excellence, transparency and impact on sector development.",
      },
      values: {
        title: "Values",
        text: "Culture, Trust, Technology, Sustainability and Excellence guide every decision and action of our platform.",
      },
      objectives: {
        title: "Strategic Objectives",
        text: "Certify partners, digitize tourist experiences and position Angola as a world-class tourist destination.",
      },
    },
  };

  const text = content[language];

  const items = [
    { icon: Target, ...text.mission, gradient: "gradient-hero" },
    { icon: Eye, ...text.vision, gradient: "gradient-nature" },
    { icon: Heart, ...text.values, gradient: "gradient-warm" },
    { icon: TrendingUp, ...text.objectives, gradient: "gradient-hero" },
  ];

  return (
    <section id="sobre" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {text.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Mission;
