
## Plano: Remover Botao WhatsApp Antigo e Suavizar Animacao

### Alteracoes Necessarias

#### 1. Remover Botao WhatsApp do Footer

**Arquivo: `src/components/Footer.tsx`**

Remover o bloco do botao WhatsApp (linhas 120-136):
```typescript
{/* WhatsApp Official Button */}
<Button
  className="w-full justify-center gap-3 h-12 bg-[#25D366] ..."
  onClick={handleWhatsAppClick}
  ...
>
  ...
</Button>
```

Tambem remover a funcao `handleWhatsAppClick` (linhas 59-61) e os dados relacionados ao WhatsApp no objeto `content` (linhas 16-17 e 34-35) que nao serao mais utilizados.

#### 2. Suavizar Animacao do Botao Flutuante

**Arquivo: `src/components/FloatingWhatsApp.tsx`**

Substituir `animate-pulse` por uma animacao customizada mais sutil usando `shadow-pulse`:

**Antes** (linha 53):
```typescript
"animate-pulse hover:animate-none"
```

**Depois**:
```typescript
"animate-[shadow-pulse_2s_ease-in-out_infinite] hover:animate-none"
```

E adicionar o estilo inline para a animacao de sombra pulsante sutil que nao pisca o botao inteiro, apenas a sombra:

```typescript
style={{
  animation: isVisible ? 'shadow-pulse 2s ease-in-out infinite' : 'none'
}}
```

Com CSS customizado via classe:
- Sombra que pulsa suavemente (0.5 -> 1 -> 0.5 opacidade)
- Sem mudanca de cor ou tamanho do botao
- Efeito discreto mas visivel

---

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/Footer.tsx` | Remover botao WhatsApp e codigo relacionado |
| `src/components/FloatingWhatsApp.tsx` | Substituir animate-pulse por animacao de sombra sutil |

### Resultado Esperado

1. Apenas o botao WhatsApp flutuante presente na pagina
2. Animacao suave de sombra pulsante (nao piscando intensamente)
3. Footer mais limpo mantendo email, telefone e endereco
