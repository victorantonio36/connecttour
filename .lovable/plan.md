

## Plano: Corrigir Bug da Tela Branca no Cadastro de Parceiros

### Problema Identificado

O erro encontrado nos logs do console:
```
Error: useBlocker must be used within a data router. 
See https://reactrouter.com/v6/routers/picking-a-router.
```

**Causa**: O hook `useBlocker` foi adicionado ao `PartnerRegister.tsx` na implementacao anterior, mas este hook so funciona com "data routers" (`createBrowserRouter`). O projeto usa `BrowserRouter`, que nao suporta este hook.

### Solucao

Remover o `useBlocker` e manter apenas a protecao via `beforeunload` que ja esta implementada. Esta abordagem:
- Funciona com `BrowserRouter`
- Protege contra refresh/fechar aba do navegador
- Nao requer migracao de toda a arquitetura de rotas

### Alteracoes no Arquivo

**`src/pages/PartnerRegister.tsx`**:

1. **Remover import do `useBlocker`** (linha 2):
   ```typescript
   // ANTES
   import { useNavigate, useBlocker } from 'react-router-dom';
   
   // DEPOIS
   import { useNavigate } from 'react-router-dom';
   ```

2. **Remover o hook `useBlocker`** (linhas 124-127):
   ```typescript
   // REMOVER COMPLETAMENTE
   const blocker = useBlocker(
     ({ currentLocation, nextLocation }) =>
       isDirty && currentLocation.pathname !== nextLocation.pathname
   );
   ```

3. **Remover o useEffect que depende do blocker** (linhas 129-134):
   ```typescript
   // REMOVER COMPLETAMENTE
   useEffect(() => {
     if (blocker.state === 'blocked') {
       setShowExitDialog(true);
       setPendingNavigation(() => () => blocker.proceed());
     }
   }, [blocker]);
   ```

4. **Manter a protecao existente**:
   - O `beforeunload` listener (linhas 111-121) continua funcionando
   - O botao "Voltar" ja tem sua propria logica de confirmacao (linhas 546-554)
   - O dialogo de saida continua funcionando para navegacao interna

### Resultado Esperado

Apos a correcao:
- A pagina de cadastro de parceiros carregara normalmente
- A protecao contra perda de dados via `beforeunload` permanece ativa
- A confirmacao de saida via botao "Voltar" continua funcionando
- O formulario multi-step funciona corretamente
- Persistencia de rascunho em localStorage mantem-se operacional

### Resumo de Alteracoes

| Linha | Acao | Descricao |
|-------|------|-----------|
| 2 | MODIFICAR | Remover `useBlocker` do import |
| 124-127 | REMOVER | Hook `useBlocker` |
| 129-134 | REMOVER | useEffect que depende do blocker |

