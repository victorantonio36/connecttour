import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, LogIn, UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string().min(6, 'Mínimo de 6 caracteres').max(72, 'Senha muito longa')
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string().min(6, 'Mínimo de 6 caracteres').max(72, 'Senha muito longa')
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const clearErrors = () => setErrors({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string)?.trim();
    const password = formData.get('password') as string;

    // Validate with Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (error) {
      // Handle specific error messages
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login';
      }
      
      toast({
        title: 'Erro no login',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta.',
      });
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string)?.trim();
    const password = formData.get('password') as string;
    const fullName = (formData.get('fullName') as string)?.trim();

    // Validate with Zod
    const validation = signupSchema.safeParse({ email, password, fullName });
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        data: {
          full_name: validation.data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      // Handle specific error messages
      let errorMessage = error.message;
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está registrado. Tente fazer login.';
      } else if (error.message.includes('Password should')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      }
      
      toast({
        title: 'Erro no registro',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      // Assign partner role if user selected partner signup
      if (isPartner && data.user) {
        const { error: roleError } = await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'partner',
        });

        if (roleError) {
          console.error('Error assigning partner role:', roleError);
        }

        toast({
          title: 'Conta criada!',
          description: 'Redirecionando para o registro de parceiro...',
        });
        navigate('/partner-register');
      } else {
        toast({
          title: 'Conta criada!',
          description: 'Verifique seu email para confirmar a conta.',
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-hero mb-4">
            <span className="text-primary-foreground font-bold text-2xl">AC</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Angola ConnecTour</h1>
          <p className="text-muted-foreground mt-2">Plataforma Nacional de Turismo</p>
        </div>

        <Tabs defaultValue="login" className="w-full" onValueChange={clearErrors}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup">
              <UserPlus className="h-4 w-4 mr-2" />
              Criar Conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo de volta</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        maxLength={255}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        maxLength={72}
                        className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full gradient-hero" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Criar nova conta</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para criar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-fullname"
                        name="fullName"
                        type="text"
                        placeholder="João Silva"
                        required
                        maxLength={100}
                        className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        maxLength={255}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                        maxLength={72}
                        className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    <p className="text-xs text-muted-foreground">
                      Mínimo de 6 caracteres
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border bg-muted/50">
                    <input
                      type="checkbox"
                      id="is-partner"
                      checked={isPartner}
                      onChange={(e) => setIsPartner(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="is-partner" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="h-4 w-4 text-accent" />
                      <span>Sou um parceiro comercial</span>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full gradient-hero" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Ao criar uma conta, você concorda com nossos{' '}
          <a href="#" className="text-accent hover:underline">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="#" className="text-accent hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
