import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, FileText, CreditCard, Check, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Angolan phone validation (9 digits, starting with 9)
const angolanPhoneRegex = /^9[1-9]\d{7}$/;

// Angolan NIF validation (basic format check)
const angolanNIFRegex = /^\d{9,14}$/;

// URL validation (optional field)
const urlSchema = z.string().url('URL inválida').or(z.literal('')).optional();

const partnerSchema = z.object({
  companyName: z.string().trim().min(2, 'Nome da empresa é obrigatório').max(100),
  legalName: z.string().trim().min(2, 'Razão social é obrigatória').max(150),
  taxId: z.string().trim()
    .min(9, 'NIF deve ter pelo menos 9 dígitos')
    .max(14, 'NIF inválido')
    .regex(angolanNIFRegex, 'NIF inválido - deve conter apenas números'),
  email: z.string().trim().email('Email inválido').max(255),
  phone: z.string().trim()
    .min(9, 'Telefone deve ter 9 dígitos')
    .max(15, 'Telefone inválido')
    .refine((val) => {
      const cleaned = val.replace(/\D/g, '');
      return angolanPhoneRegex.test(cleaned) || cleaned.length >= 9;
    }, 'Número de telefone angolano inválido'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  province: z.string().min(1, 'Província é obrigatória'),
  address: z.string().trim().min(5, 'Endereço é obrigatório').max(300),
  website: urlSchema,
  descriptionPt: z.string().trim().min(20, 'Descrição deve ter pelo menos 20 caracteres').max(2000),
  descriptionEn: z.string().trim().min(20, 'Description must have at least 20 characters').max(2000)
});

const DRAFT_STORAGE_KEY = 'partner_form_draft';

const PartnerRegister = () => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
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
  const [isDirty, setIsDirty] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.selectedPlan) setSelectedPlan(parsed.selectedPlan);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        toast({
          title: language === 'pt' ? 'Rascunho recuperado' : 'Draft recovered',
          description: language === 'pt' 
            ? 'Seus dados anteriores foram restaurados' 
            : 'Your previous data has been restored',
        });
      } catch (e) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }
  }, []);

  // Save draft to localStorage when form changes
  useEffect(() => {
    if (isDirty) {
      const draft = { formData, selectedPlan, currentStep };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, selectedPlan, currentStep, isDirty]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);


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
      successMessage: 'Seu cadastro foi recebido e está em análise. Você receberá um email de confirmação em breve.',
      exitDialogTitle: 'Sair do cadastro?',
      exitDialogDescription: 'Você tem alterações não salvas. Se sair agora, seus dados serão salvos como rascunho.',
      exitDialogCancel: 'Continuar editando',
      exitDialogConfirm: 'Sair mesmo assim',
      errorPlanNotFound: 'Plano selecionado não encontrado',
      errorAlreadyRegistered: 'Já existe uma empresa com este NIF ou email',
      errorPermissionDenied: 'Você não tem permissão para cadastrar empresas',
      errorGeneric: 'Ocorreu um erro. Tente novamente.',
      phoneHint: 'Formato: 9XX XXX XXX'
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
      successMessage: 'Your registration has been received and is under review. You will receive a confirmation email soon.',
      exitDialogTitle: 'Leave registration?',
      exitDialogDescription: 'You have unsaved changes. If you leave now, your data will be saved as a draft.',
      exitDialogCancel: 'Continue editing',
      exitDialogConfirm: 'Leave anyway',
      errorPlanNotFound: 'Selected plan not found',
      errorAlreadyRegistered: 'A company with this Tax ID or email already exists',
      errorPermissionDenied: 'You do not have permission to register companies',
      errorGeneric: 'An error occurred. Please try again.',
      phoneHint: 'Format: 9XX XXX XXX'
    }
  };

  const text = content[language];

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: language === 'pt' ? 'Arquivo muito grande' : 'File too large',
          description: language === 'pt' ? 'O logo deve ter no máximo 2MB' : 'Logo must be at most 2MB',
          variant: 'destructive'
        });
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: language === 'pt' ? 'Formato inválido' : 'Invalid format',
          description: language === 'pt' 
            ? 'Use apenas JPG, PNG ou WebP' 
            : 'Use only JPG, PNG or WebP',
          variant: 'destructive'
        });
        return;
      }
      
      setLogoFile(file);
      setIsDirty(true);
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
          
          // Scroll to first error
          const firstErrorField = err.errors[0]?.path[0];
          if (firstErrorField) {
            const element = document.getElementById(firstErrorField as string);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
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
        
        // Validate website if provided
        if (formData.website) {
          urlSchema.parse(formData.website);
        }
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      // 1. Verify authentication
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

      // 2. Verify/assign partner role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'partner')
        .single();

      if (!existingRole) {
        const { error: roleError } = await supabase.from('user_roles').insert({
          user_id: user.id,
          role: 'partner',
        });
        
        if (roleError) {
          console.error('Error assigning partner role:', roleError);
          // Continue anyway - the insert might fail due to RLS but the user might already have the role
        }
      }

      // 3. Get subscription plan ID with better error handling
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id, name')
        .eq('name', selectedPlan)
        .single();

      if (planError || !plan) {
        console.error('Plan lookup failed:', { selectedPlan, planError });
        toast({
          title: text.errorPlanNotFound,
          description: `Plan: ${selectedPlan}`,
          variant: 'destructive'
        });
        return;
      }

      // 4. Upload logo with improved error handling
      let logoUrl: string | null = null;
      if (logoFile) {
        setUploadingLogo(true);
        const fileExt = logoFile.name.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        
        if (!validExtensions.includes(fileExt || '')) {
          toast({
            title: language === 'pt' ? 'Formato inválido' : 'Invalid format',
            variant: 'destructive'
          });
          setUploadingLogo(false);
          return;
        }

        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('partner-logos')
          .upload(fileName, logoFile, { upsert: false });

        setUploadingLogo(false);

        if (uploadError) {
          console.error('Logo upload error:', uploadError);
          // Continue without logo - not a blocking error
          toast({
            title: language === 'pt' ? 'Aviso' : 'Warning',
            description: language === 'pt' 
              ? 'Não foi possível enviar o logo. Você pode adicionar depois.'
              : 'Could not upload logo. You can add it later.',
          });
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('partner-logos')
            .getPublicUrl(fileName);
          logoUrl = publicUrl;
        }
      }

      // 5. Create partner company with sanitized data
      const { error: insertError } = await supabase
        .from('partner_companies')
        .insert({
          owner_id: user.id,
          name: formData.companyName.trim(),
          legal_name: formData.legalName.trim(),
          tax_id: formData.taxId.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim().replace(/\D/g, ''),
          category: formData.category,
          provinces: [formData.province],
          address: formData.address.trim(),
          website: formData.website?.trim() || null,
          description_pt: formData.descriptionPt.trim(),
          description_en: formData.descriptionEn.trim(),
          logo_url: logoUrl,
          subscription_plan_id: plan.id,
          subscription_status: 'pending',
          approved: false,
          certified: false
        });

      if (insertError) throw insertError;

      // 6. Clear localStorage and show success
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setIsDirty(false);

      toast({
        title: text.successTitle,
        description: text.successMessage
      });

      navigate('/');

    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle specific PostgreSQL errors
      if (err.code === '23505') {
        toast({
          title: text.errorAlreadyRegistered,
          variant: 'destructive'
        });
      } else if (err.code === '42501') {
        toast({
          title: text.errorPermissionDenied,
          variant: 'destructive'
        });
      } else {
        toast({
          title: text.errorGeneric,
          description: err.message,
          variant: 'destructive'
        });
      }
    } finally {
      setIsSubmitting(false);
      setUploadingLogo(false);
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
          onClick={() => {
            if (isDirty) {
              setShowExitDialog(true);
              setPendingNavigation(() => () => navigate('/'));
            } else {
              navigate('/');
            }
          }}
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
                    <span className={`text-sm mt-2 text-center ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
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
                    <Label htmlFor="companyName">{text.fields.companyName} *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={errors.companyName ? 'border-destructive' : ''}
                      maxLength={100}
                    />
                    {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalName">{text.fields.legalName} *</Label>
                    <Input
                      id="legalName"
                      value={formData.legalName}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                      className={errors.legalName ? 'border-destructive' : ''}
                      maxLength={150}
                    />
                    {errors.legalName && <p className="text-sm text-destructive">{errors.legalName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId">{text.fields.taxId} *</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value.replace(/\D/g, ''))}
                      className={errors.taxId ? 'border-destructive' : ''}
                      placeholder="000000000"
                      maxLength={14}
                    />
                    {errors.taxId && <p className="text-sm text-destructive">{errors.taxId}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{text.fields.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-destructive' : ''}
                      maxLength={255}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{text.fields.phone} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-destructive' : ''}
                      placeholder="9XX XXX XXX"
                      maxLength={15}
                    />
                    <p className="text-xs text-muted-foreground">{text.phoneHint}</p>
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{text.fields.category} *</Label>
                    <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder={language === 'pt' ? 'Selecione...' : 'Select...'} />
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
                    <Label>{text.fields.province} *</Label>
                    <Select value={formData.province} onValueChange={(v) => handleInputChange('province', v)}>
                      <SelectTrigger className={errors.province ? 'border-destructive' : ''}>
                        <SelectValue placeholder={language === 'pt' ? 'Selecione...' : 'Select...'} />
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
                      placeholder="https://seusite.com"
                      maxLength={200}
                    />
                    {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{text.fields.address} *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={errors.address ? 'border-destructive' : ''}
                    maxLength={300}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="descriptionPt">{text.fields.descriptionPt} *</Label>
                  <Textarea
                    id="descriptionPt"
                    value={formData.descriptionPt}
                    onChange={(e) => handleInputChange('descriptionPt', e.target.value)}
                    rows={4}
                    className={errors.descriptionPt ? 'border-destructive' : ''}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.descriptionPt.length}/2000
                  </p>
                  {errors.descriptionPt && <p className="text-sm text-destructive">{errors.descriptionPt}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">{text.fields.descriptionEn} *</Label>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                    rows={4}
                    className={errors.descriptionEn ? 'border-destructive' : ''}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.descriptionEn.length}/2000
                  </p>
                  {errors.descriptionEn && <p className="text-sm text-destructive">{errors.descriptionEn}</p>}
                </div>

                <div className="space-y-2">
                  <Label>{text.fields.logo}</Label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center border">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                        {uploadingLogo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {text.uploadLogo}
                      </div>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'pt' ? 'JPG, PNG ou WebP. Máx 2MB.' : 'JPG, PNG or WebP. Max 2MB.'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <SubscriptionPlans
                language={language}
                selectedPlan={selectedPlan}
                onSelectPlan={(plan) => {
                  setSelectedPlan(plan);
                  setIsDirty(true);
                }}
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
                <Button onClick={handleSubmit} disabled={isSubmitting || uploadingLogo}>
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

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              {text.exitDialogTitle}
            </DialogTitle>
            <DialogDescription>
              {text.exitDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              {text.exitDialogCancel}
            </Button>
            <Button variant="destructive" onClick={handleExitConfirm}>
              {text.exitDialogConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerRegister;
