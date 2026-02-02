
## Plano: Botao WhatsApp Flutuante e Substituicao do Simbolo AC

### Alteracoes Necessarias

#### 1. Criar Componente FloatingWhatsApp

**Novo arquivo: `src/components/FloatingWhatsApp.tsx`**

Botao flutuante com as seguintes caracteristicas:
- Posicao fixa no canto inferior direito
- Animacao de pulso para atrair atencao
- Aparece apos scroll (para nao cobrir conteudo hero)
- Design profissional com icone oficial do WhatsApp
- Tooltip ao hover
- Responsivo (menor em mobile)

```text
+-------------------+
|                   |
|                   |
|                   |
|                   |
|            [WA] <-+-- Botao flutuante
+-------------------+
    Posicao: bottom-6 right-6
```

#### 2. Substituir Simbolo AC no Footer

**Arquivo: `src/components/Footer.tsx`**

Substituir o bloco:
```typescript
<div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
  <span className="text-primary-foreground font-bold text-xl">AC</span>
</div>
```

Por:
```typescript
<img 
  src={angolaLogo} 
  alt="Angola ConnecTour" 
  className="h-12 w-auto object-contain"
/>
```

#### 3. Integrar FloatingWhatsApp no Index

**Arquivo: `src/pages/Index.tsx`**

Adicionar o componente FloatingWhatsApp dentro do layout principal para que apareca em todas as paginas.

---

### Especificacoes Tecnicas do Botao Flutuante

| Propriedade | Valor |
|-------------|-------|
| Posicao | `fixed bottom-6 right-6` |
| z-index | `z-50` |
| Tamanho Desktop | `w-14 h-14` |
| Tamanho Mobile | `w-12 h-12` |
| Cor de Fundo | `#25D366` (verde WhatsApp) |
| Hover | `#128C7E` + scale(1.1) |
| Animacao | Pulso sutil + bounce na entrada |
| Visibilidade | Aparece apos 300px de scroll |

### Arquivos a Modificar/Criar

| Arquivo | Acao | Descricao |
|---------|------|-----------|
| `src/components/FloatingWhatsApp.tsx` | CRIAR | Novo componente de botao flutuante |
| `src/components/Footer.tsx` | MODIFICAR | Substituir "AC" pela logo oficial |
| `src/pages/Index.tsx` | MODIFICAR | Adicionar FloatingWhatsApp |

### Resultado Esperado

1. Botao WhatsApp flutuante visivel em todas as paginas, no canto inferior direito
2. Animacao de pulso que atrai atencao sem ser intrusiva
3. Logo oficial da ConnecTour no footer substituindo o simbolo "AC"
4. Experiencia consistente em desktop e mobile
