import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, FileText, CreditCard, Check, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const partnerSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  legalName: z.string().min(2, 'Razão social é obrigatória'),
  taxId: z.string().min(5, 'NIF é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Telefone é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  province: z.string().min(1, 'Província é obrigatória'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  website: z.string().optional(),
  descriptionPt: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  descriptionEn: z.string().min(20, 'Description must have at least 20 characters')
});

const PartnerRegister = () => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    legalName: '',
    taxId: '',
    email: '',
    phone: '',
    category: '',
    province: '',
    address: '',
    website: '',
    descriptionPt: '',
    descriptionEn: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const content = {
    pt: {
      title: 'Cadastro de Parceiro',
      subtitle: 'Junte-se à maior rede de turismo de Angola',
      steps: ['Dados da Empresa', 'Serviços', 'Plano'],
      back: 'Voltar',
      next: 'Próximo',
      submit: 'Concluir Cadastro',
      submitting: 'Processando...',
      fields: {
        companyName: 'Nome da Empresa',
        legalName: 'Razão Social',
        taxId: 'NIF',
        email: 'Email',
        phone: 'Telefone',
        category: 'Categoria',
        province: 'Província',
        address: 'Endereço',
        website: 'Website (opcional)',
        descriptionPt: 'Descrição (Português)',
        descriptionEn: 'Description (English)',
        logo: 'Logotipo da Empresa'
      },
      categories: [
        { value: 'agency', label: 'Agência de Turismo' },
        { value: 'hotel', label: 'Hotel / Hospedagem' },
        { value: 'restaurant', label: 'Restaurante' },
        { value: 'transport', label: 'Transporte' },
        { value: 'culture', label: 'Cultura / Experiências' },
        { value: 'other', label: 'Outro' }
      ],
      provinces: [
        'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
        'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
        'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
      ],
      uploadLogo: 'Carregar Logo',
      successTitle: 'Cadastro Enviado!',
      successMessage: 'Seu cadastro foi recebido e está em análise. Você receberá um email de confirmação em breve.'
    },
    en: {
      title: 'Partner Registration',
      subtitle: "Join Angola's largest tourism network",
      steps: ['Company Data', 'Services', 'Plan'],
      back: 'Back',
      next: 'Next',
      submit: 'Complete Registration',
      submitting: 'Processing...',
      fields: {
        companyName: 'Company Name',
        legalName: 'Legal Name',
        taxId: 'Tax ID',
        email: 'Email',
        phone: 'Phone',
        category: 'Category',
        province: 'Province',
        address: 'Address',
        website: 'Website (optional)',
        descriptionPt: 'Description (Portuguese)',
        descriptionEn: 'Description (English)',
        logo: 'Company Logo'
      },
      categories: [
        { value: 'agency', label: 'Tourism Agency' },
        { value: 'hotel', label: 'Hotel / Accommodation' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'transport', label: 'Transport' },
        { value: 'culture', label: 'Culture / Experiences' },
        { value: 'other', label: 'Other' }
      ],
      provinces: [
        'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
        'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
        'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
      ],
      uploadLogo: 'Upload Logo',
      successTitle: 'Registration Submitted!',
      successMessage: 'Your registration has been received and is under review. You will receive a confirmation email soon.'
    }
  };

  const text = content[language];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O logo deve ter no máximo 2MB',
          variant: 'destructive'
        });
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      try {
        partnerSchema.pick({
          companyName: true,
          legalName: true,
          taxId: true,
          email: true,
          phone: true,
          category: true,
          province: true,
          address: true
        }).parse(formData);
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          err.errors.forEach(e => {
            if (e.path[0]) {
              newErrors[e.path[0] as string] = e.message;
            }
          });
          setErrors(newErrors);
        }
        return false;
      }
    }
    if (step === 2) {
      try {
        partnerSchema.pick({
          descriptionPt: true,
          descriptionEn: true
        }).parse(formData);
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          err.errors.forEach(e => {
            if (e.path[0]) {
              newErrors[e.path[0] as string] = e.message;
            }
          });
          setErrors(newErrors);
        }
        return false;
      }
    }
    if (step === 3) {
      if (!selectedPlan) {
        toast({
          title: language === 'pt' ? 'Selecione um plano' : 'Select a plan',
          variant: 'destructive'
        });
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: language === 'pt' ? 'Faça login primeiro' : 'Please login first',
          description: language === 'pt' 
            ? 'Você precisa estar logado para se cadastrar como parceiro' 
            : 'You need to be logged in to register as a partner',
          variant: 'destructive'
        });
        navigate('/auth');
        return;
      }

      // Get subscription plan ID
      const { data: plans } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', selectedPlan)
        .single();

      const planId = plans?.id;

      // Upload logo if exists
      let logoUrl = null;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('partner-logos')
          .upload(fileName, logoFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('partner-logos')
            .getPublicUrl(fileName);
          logoUrl = publicUrl;
        }
      }

      // Create partner company
      const { error } = await supabase
        .from('partner_companies')
        .insert({
          owner_id: user.id,
          name: formData.companyName,
          legal_name: formData.legalName,
          tax_id: formData.taxId,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          provinces: [formData.province],
          address: formData.address,
          website: formData.website || null,
          description_pt: formData.descriptionPt,
          description_en: formData.descriptionEn,
          logo_url: logoUrl,
          subscription_plan_id: planId,
          approved: false,
          certified: false
        });

      if (error) throw error;

      toast({
        title: text.successTitle,
        description: text.successMessage
      });

      navigate('/');

    } catch (err) {
      console.error('Registration error:', err);
      toast({
        title: language === 'pt' ? 'Erro no cadastro' : 'Registration error',
        description: language === 'pt' 
          ? 'Ocorreu um erro ao processar seu cadastro. Tente novamente.' 
          : 'An error occurred processing your registration. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: Building2, label: text.steps[0] },
    { icon: FileText, label: text.steps[1] },
    { icon: CreditCard, label: text.steps[2] }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation language={language} setLanguage={setLanguage} />
      
      <main className="container mx-auto px-4 py-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {text.back}
        </Button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{text.title}</h1>
          <p className="text-xl text-muted-foreground">{text.subtitle}</p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index + 1;
              const isCompleted = currentStep > index + 1;
              
              return (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? 'bg-primary text-primary-foreground' 
                        : isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span className={`text-sm mt-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].label}</CardTitle>
            <CardDescription>
              {language === 'pt' 
                ? `Passo ${currentStep} de ${steps.length}`
                : `Step ${currentStep} of ${steps.length}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Company Data */}
            {currentStep === 1 && (
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{text.fields.companyName}</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={errors.companyName ? 'border-destructive' : ''}
                    />
                    {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalName">{text.fields.legalName}</Label>
                    <Input
                      id="legalName"
                      value={formData.legalName}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                      className={errors.legalName ? 'border-destructive' : ''}
                    />
                    {errors.legalName && <p className="text-sm text-destructive">{errors.legalName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId">{text.fields.taxId}</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      className={errors.taxId ? 'border-destructive' : ''}
                    />
                    {errors.taxId && <p className="text-sm text-destructive">{errors.taxId}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{text.fields.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{text.fields.phone}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{text.fields.category}</Label>
                    <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {text.categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{text.fields.province}</Label>
                    <Select value={formData.province} onValueChange={(v) => handleInputChange('province', v)}>
                      <SelectTrigger className={errors.province ? 'border-destructive' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {text.provinces.map((prov) => (
                          <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.province && <p className="text-sm text-destructive">{errors.province}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">{text.fields.website}</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{text.fields.address}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={errors.address ? 'border-destructive' : ''}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="descriptionPt">{text.fields.descriptionPt}</Label>
                  <Textarea
                    id="descriptionPt"
                    value={formData.descriptionPt}
                    onChange={(e) => handleInputChange('descriptionPt', e.target.value)}
                    rows={4}
                    className={errors.descriptionPt ? 'border-destructive' : ''}
                  />
                  {errors.descriptionPt && <p className="text-sm text-destructive">{errors.descriptionPt}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">{text.fields.descriptionEn}</Label>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                    rows={4}
                    className={errors.descriptionEn ? 'border-destructive' : ''}
                  />
                  {errors.descriptionEn && <p className="text-sm text-destructive">{errors.descriptionEn}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{text.fields.logo}</Label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-lg object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                        <Upload className="h-4 w-4" />
                        {text.uploadLogo}
                      </div>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <SubscriptionPlans
                language={language}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {text.back}
                </Button>
              ) : (
                <div />
              )}
              
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  {text.next}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {text.submitting}
                    </>
                  ) : (
                    <>
                      {text.submit}
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default PartnerRegister;
