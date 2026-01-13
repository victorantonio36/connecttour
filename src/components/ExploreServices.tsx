import { useState, useMemo } from "react";
import { Search, Compass, Hotel, Car, Utensils, BookOpen, ArrowRight, SearchX, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { provinces, mockPartners } from "@/data/servicesData";
import { useNavigate } from "react-router-dom";
import { useExplorationTracking } from "@/hooks/useExplorationTracking";

interface ExploreServicesProps {
  language: "pt" | "en";
}

interface ServiceCategory {
  id: string;
  name: { pt: string; en: string };
  description: { pt: string; en: string };
  icon: typeof Compass;
  gradient: string;
  count: number;
}

const ExploreServices = ({ language }: ExploreServicesProps) => {
  const navigate = useNavigate();
  const { trackExploration } = useExplorationTracking();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("Todas as Províncias");
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);

  const handleViewPartners = (categoryId: string) => {
    trackExploration({
      category: categoryId,
      eventType: 'view_partners_click'
    });
    
    const routeMap: Record<string, string> = {
      'tourism': '/explorar/agencias',
      'hotels': '/explorar/hospedagem',
      'culture': '/explorar/experiencias',
      'transport': '/explorar/transporte',
      'guides': '/explorar/agencias'
    };
    
    const route = routeMap[categoryId] || '/explorar/agencias';
    navigate(route);
  };

  const content = {
    pt: {
      title: "Explorar Angola",
      subtitle: "Conectamos você a serviços certificados e experiências autênticas em todo o país",
      searchPlaceholder: "Buscar por nome ou serviço...",
      filterByCategory: "Tipo de Serviço",
      filterByProvince: "Província",
      allCategories: "Todas as Categorias",
      certifiedOnly: "Apenas Certificados",
      viewPartners: "Ver Parceiros",
      partners: "parceiros",
      certified: "Certificado",
      noResults: "Nenhum serviço encontrado. Tente ajustar os filtros.",
      clearFilters: "Limpar Filtros",
      filters: "Filtros",
    },
    en: {
      title: "Explore Angola",
      subtitle: "We connect you to certified services and authentic experiences across the country",
      searchPlaceholder: "Search by name or service...",
      filterByCategory: "Service Type",
      filterByProvince: "Province",
      allCategories: "All Categories",
      certifiedOnly: "Certified Only",
      viewPartners: "View Partners",
      partners: "partners",
      certified: "Certified",
      noResults: "No services found. Try adjusting the filters.",
      clearFilters: "Clear Filters",
      filters: "Filters",
    },
  };

  const text = content[language];

  const categories: ServiceCategory[] = [
    {
      id: "tourism",
      name: {
        pt: "Agências de Turismo",
        en: "Tourism Agencies",
      },
      description: {
        pt: "Operadores certificados que organizam roteiros personalizados e experiências guiadas",
        en: "Certified operators organizing custom itineraries and guided experiences",
      },
      icon: Compass,
      gradient: "from-ocean-blue via-ocean-deep to-ocean-dark",
      count: mockPartners.filter((p) => p.category === "tourism").length,
    },
    {
      id: "hotels",
      name: {
        pt: "Hotéis e Hospedagem",
        en: "Hotels & Accommodation",
      },
      description: {
        pt: "Acomodações verificadas, desde hotéis de luxo a pousadas acolhedoras",
        en: "Verified accommodations, from luxury hotels to cozy guesthouses",
      },
      icon: Hotel,
      gradient: "from-terracotta via-warm-sand to-golden",
      count: mockPartners.filter((p) => p.category === "hotels").length,
    },
    {
      id: "transport",
      name: {
        pt: "Serviços de Táxi e Transfer",
        en: "Taxi & Transfer Services",
      },
      description: {
        pt: "Transporte seguro e confiável para suas viagens pelo país",
        en: "Safe and reliable transportation for your travels across the country",
      },
      icon: Car,
      gradient: "from-emerald via-nature-green to-golden",
      count: mockPartners.filter((p) => p.category === "transport").length,
    },
    {
      id: "culture",
      name: {
        pt: "Experiências Culturais e Gastronómicas",
        en: "Cultural & Gastronomic Experiences",
      },
      description: {
        pt: "Sabores autênticos e vivências culturais que revelam a alma angolana",
        en: "Authentic flavors and cultural experiences revealing Angola's soul",
      },
      icon: Utensils,
      gradient: "from-terracotta via-warm-sand to-golden",
      count: mockPartners.filter((p) => p.category === "culture").length,
    },
    {
      id: "guides",
      name: {
        pt: "Guias Digitais",
        en: "Digital Guides",
      },
      description: {
        pt: "Conteúdo exclusivo e mapas interativos para explorar cada província",
        en: "Exclusive content and interactive maps to explore each province",
      },
      icon: BookOpen,
      gradient: "from-ocean-blue via-ocean-deep to-ocean-dark",
      count: mockPartners.filter((p) => p.category === "guides").length,
    },
  ];

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((cat) => cat.id === selectedCategory);
    }

    // Update count based on filters
    return filtered.map((cat) => {
      let partners = mockPartners.filter((p) => p.category === cat.id);

      if (selectedProvince !== "Todas as Províncias") {
        partners = partners.filter((p) => p.province === selectedProvince);
      }

      if (showCertifiedOnly) {
        partners = partners.filter((p) => p.certified);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        partners = partners.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      return {
        ...cat,
        count: partners.length,
      };
    }).filter((cat) => cat.count > 0);
  }, [selectedCategory, selectedProvince, showCertifiedOnly, searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedProvince("Todas as Províncias");
    setShowCertifiedOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedProvince !== "Todas as Províncias" ||
    showCertifiedOnly;

  return (
    <section id="explorar" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {text.title}
          </h2>
          <p className="text-xl text-muted-foreground">{text.subtitle}</p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-5xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="border-foreground/10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={text.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {text.filterByCategory}
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{text.allCategories}</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name[language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Province Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {text.filterByProvince}
                    </label>
                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Certified Toggle */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground opacity-0 pointer-events-none">
                      Toggle
                    </label>
                    <Button
                      variant={showCertifiedOnly ? "default" : "outline"}
                      className="w-full h-10"
                      onClick={() => setShowCertifiedOnly(!showCertifiedOnly)}
                    >
                      {text.certifiedOnly}
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-accent hover:text-accent/80"
                    >
                      {text.clearFilters}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group relative overflow-hidden hover:shadow-strong transition-all duration-500 animate-scale-in border-foreground/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {category.name[language]}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description[language]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {category.count} {text.partners}
                      </Badge>
                      {mockPartners.filter((p) => p.category === category.id && p.certified)
                        .length > 0 && (
                        <Badge variant="default" className="text-xs">
                          {text.certified}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="text-accent hover:text-accent/80 p-0 h-auto font-semibold group/btn w-full justify-start"
                      onClick={() => handleViewPartners(category.id)}
                    >
                      {text.viewPartners}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <SearchX className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground mb-6">{text.noResults}</p>
            <Button onClick={clearFilters} variant="outline">
              {text.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreServices;
