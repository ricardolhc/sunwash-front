# Task 2 — Guards e telas de conta

Status: complete

Source plan: `docs/superpowers/plans/2026-08-27-authentication-authorization.md`

## Files

- `main.tsx`
- `App.tsx`
- routes
- `ProtectedRoute`
- `PublicOnlyRoute`
- spinner
- controllers
- views
- pages
- testes

## Checklist

- Testar visitante em rota protegida, `USER` fora do admin e validação de formulário.
- Criar guards que esperam `loading`.
- Criar `/login` e `/cadastro`.
- Criar schemas Zod para e-mail, senha e confirmação.
- Criar telas responsivas com labels, erros e botão de senha visível.
- Após login, voltar ao destino permitido ou ao painel do papel.
- Rodar testes, lint e build.

## Verification

- `npm test -- src/presentation/routes/authRouting.test.tsx --runInBand`
- `npm test -- --runInBand`
- `npm run lint`
- `npm run build`
