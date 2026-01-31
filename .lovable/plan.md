
## Plano: Sistema de Cadastro de Parceiros Robusto e Funcional

### Problemas Identificados

#### 1. Bug Critico: Incompatibilidade de Nome do Plano
O componente `SubscriptionPlans.tsx` usa `id: 'essential'` (ingles), mas a base de dados tem `name: 'essencial'` (portugues). Isso causa falha na busca do plano durante o cadastro.

#### 2. Problemas de Seguranca e Validacao
- Falta validacao com Zod na pagina de autenticacao (`Auth.tsx`)
- Inputs sensiveis sem protecao adequada
- Falta de feedback detalhado para erros especificos

#### 3. Fluxo de Atribuicao de Role
O fluxo atual de atribuicao da role 'partner' pode falhar silenciosamente devido a RLS policies

#### 4. Falta de Persistencia de Estado
- Perda de dados se o usuario navegar acidentalmente
- Sem confirmacao antes de sair da pagina

#### 5. UX/Responsividade
- Falta de indicadores de carregamento em pontos criticos
- Necessidade de melhor feedback visual durante o processo

---

### Solucao Proposta

#### Fase 1: Correcao de Bugs Criticos

**1.1 Corrigir IDs dos Planos** (`src/components/SubscriptionPlans.tsx`)
```typescript
const plans = [
  { id: 'essencial', ...text.plans.essential, popular: false },  // Corrigido
  { id: 'elite', ...text.plans.elite, popular: true }
];
```

**1.2 Melhorar Busca do Plano** (`src/pages/PartnerRegister.tsx`)
- Adicionar fallback e logging para debug
- Validar existencia do plano antes de prosseguir

#### Fase 2: Seguranca e Validacao

**2.1 Adicionar Validacao Zod ao Auth** (`src/pages/Auth.tsx`)
```typescript
const loginSchema = z.object({
  email: z.string().trim().email('Email invalido').max(255),
  password: z.string().min(6, 'Minimo 6 caracteres').max(72)
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Nome obrigatorio').max(100),
  email: z.string().trim().email('Email invalido').max(255),
  password: z.string().min(6, 'Minimo 6 caracteres').max(72)
});
```

**2.2 Melhorar Validacao no PartnerRegister**
- Adicionar validacao de telefone angolano
- Validacao de NIF angolano
- Sanitizacao de URLs

#### Fase 3: Fluxo Robusto de Registro

**3.1 Melhorar Atribuicao de Role de Parceiro**
- Usar transacao ou verificacao pos-insert
- Adicionar retry logic em caso de falha
- Feedback claro se a role nao for atribuida

**3.2 Persistencia Local do Formulario**
- Salvar progresso em localStorage
- Restaurar ao recarregar a pagina
- Limpar ao concluir com sucesso

**3.3 Confirmacao de Saida**
- useBeforeUnload para evitar perda de dados
- Modal de confirmacao se dados nao salvos

#### Fase 4: Performance e Responsividade

**4.1 Otimizacoes de Carregamento**
- Skeleton loading nos planos de subscricao
- Prefetch de dados dos planos
- Debounce em inputs pesados

**4.2 Melhorias de Responsividade**
- Grid adaptativo para mobile
- Touch-friendly em selects e buttons
- Scroll suave entre etapas

**4.3 Estados de Loading Granulares**
```typescript
const [loadingStates, setLoadingStates] = useState({
  uploadingLogo: false,
  fetchingPlans: false,
  submitting: false
});
```

---

### Arquivos a Modificar

| Arquivo | Alteracao | Prioridade |
|---------|-----------|------------|
| `src/components/SubscriptionPlans.tsx` | Corrigir ID 'essential' para 'essencial' | CRITICA |
| `src/pages/PartnerRegister.tsx` | Melhorar busca de planos, persistencia local, validacao | ALTA |
| `src/pages/Auth.tsx` | Adicionar validacao Zod, melhorar error handling | ALTA |

---

### Secao Tecnica

#### Correcao do Bug do Plano (Critico)

**Problema atual** (linha 99-101 de `SubscriptionPlans.tsx`):
```typescript
const plans = [
  { id: 'essential', ...text.plans.essential, popular: false },  // ERRADO
  { id: 'elite', ...text.plans.elite, popular: true }
];
```

**Solucao**:
```typescript
const plans = [
  { id: 'essencial', ...text.plans.essential, popular: false },  // CORRETO - corresponde ao DB
  { id: 'elite', ...text.plans.elite, popular: true }
];
```

#### Melhorias no handleSubmit (PartnerRegister.tsx)

```typescript
const handleSubmit = async () => {
  if (!validateStep(3)) return;
  setIsSubmitting(true);

  try {
    // 1. Verificar autenticacao
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Faca login primeiro', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    // 2. Verificar role de parceiro
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'partner')
      .single();

    if (!userRoles) {
      // Tentar criar a role se nao existir
      await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'partner'
      });
    }

    // 3. Buscar plano com fallback
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('id, name')
      .eq('name', selectedPlan)
      .single();

    if (planError || !plan) {
      console.error('Plan not found:', selectedPlan, planError);
      toast({ 
        title: 'Erro no plano', 
        description: 'Plano selecionado nao encontrado.',
        variant: 'destructive' 
      });
      return;
    }

    // 4. Upload do logo com tratamento de erro
    let logoUrl = null;
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      
      if (!validExtensions.includes(fileExt || '')) {
        toast({ title: 'Formato invalido', variant: 'destructive' });
        return;
      }

      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('partner-logos')
        .upload(fileName, logoFile, { upsert: false });

      if (uploadError) {
        console.error('Logo upload error:', uploadError);
        // Continuar sem logo
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('partner-logos')
          .getPublicUrl(fileName);
        logoUrl = publicUrl;
      }
    }

    // 5. Criar empresa parceira
    const { error: insertError } = await supabase
      .from('partner_companies')
      .insert({
        owner_id: user.id,
        name: formData.companyName.trim(),
        legal_name: formData.legalName.trim(),
        tax_id: formData.taxId.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
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

    // 6. Limpar localStorage e notificar sucesso
    localStorage.removeItem('partner_form_draft');
    
    toast({
      title: text.successTitle,
      description: text.successMessage
    });

    navigate('/');

  } catch (err: any) {
    console.error('Registration error:', err);
    
    // Tratamento de erros especificos
    if (err.code === '23505') {
      toast({
        title: 'Empresa ja cadastrada',
        description: 'Ja existe uma empresa com este NIF ou email.',
        variant: 'destructive'
      });
    } else if (err.code === '42501') {
      toast({
        title: 'Permissao negada',
        description: 'Voce nao tem permissao para cadastrar empresas.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive'
      });
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

#### Persistencia Local com useEffect

```typescript
// Carregar rascunho ao montar
useEffect(() => {
  const draft = localStorage.getItem('partner_form_draft');
  if (draft) {
    try {
      const parsed = JSON.parse(draft);
      setFormData(parsed.formData);
      setSelectedPlan(parsed.selectedPlan);
      setCurrentStep(parsed.currentStep || 1);
    } catch (e) {
      localStorage.removeItem('partner_form_draft');
    }
  }
}, []);

// Salvar rascunho ao alterar
useEffect(() => {
  const draft = { formData, selectedPlan, currentStep };
  localStorage.setItem('partner_form_draft', JSON.stringify(draft));
}, [formData, selectedPlan, currentStep]);
```

---

### Resultado Esperado

Apos a implementacao:
1. Sistema de cadastro 100% funcional com planos carregando corretamente
2. Validacao robusta em todos os inputs
3. Persistencia de progresso para evitar perda de dados
4. Feedback claro e detalhado para o usuario
5. Performance otimizada com loading states granulares
6. Responsividade cirurgica em todos os dispositivos
7. Tratamento de erros especificos com mensagens uteis
