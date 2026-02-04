

## Plano: Remover Botao WhatsApp Antigo e Suavizar Animacao

### Alteracoes Necessarias

#### 1. Remover Botao WhatsApp do Footer

**Arquivo: `src/components/Footer.tsx`**

- Remover linhas 16-17 (whatsapp e whatsappNumber do objeto pt)
- Remover linhas 34-35 (whatsapp e whatsappNumber do objeto en)
- Remover linhas 59-61 (funcao handleWhatsAppClick)
- Remover linhas 120-136 (botao WhatsApp inteiro)

#### 2. Suavizar Animacao do Botao Flutuante

**Arquivo: `src/components/FloatingWhatsApp.tsx`**

Substituir `animate-pulse` (linha 53) por uma animacao de sombra pulsante mais sutil:

```typescript
// ANTES
"animate-pulse hover:animate-none"

// DEPOIS - sombra que pulsa suavemente
```

Adicionar keyframe customizado no tailwind.config.ts para animacao de sombra:
```typescript
"shadow-pulse": {
  "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.4)" },
  "50%": { boxShadow: "0 0 0 12px rgba(37, 211, 102, 0)" }
}
```

---

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/Footer.tsx` | Remover botao WhatsApp e codigo relacionado |
| `src/components/FloatingWhatsApp.tsx` | Substituir animate-pulse por animacao de sombra sutil |
| `tailwind.config.ts` | Adicionar keyframe shadow-pulse |

### Resultado Esperado

1. Apenas o botao WhatsApp flutuante presente na pagina
2. Animacao suave de sombra pulsante (anel verde que expande e desaparece)
3. Footer mais limpo mantendo apenas email, telefone e endereco

