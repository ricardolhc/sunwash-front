# Task 3 — Navegação e fluxos autenticados

Status: pending

Source plan: `docs/superpowers/plans/2026-08-27-authentication-authorization.md`

## Files

- `Navbar`
- `Footer`
- storage
- gateways de agendamento/pagamento
- controllers
- views
- testes

## Checklist

- Testar menu de visitante, `USER` e `ADMIN`.
- Testar `GET /appointments/me` sem query, criação sem identidade e captura sem `X-Admin-Token`.
- Criar uma matriz de links usada em desktop e mobile.
- Remover estado falso de usuário/admin do storage.
- Usar `listMine()` e sessão para agendamento e painel.
- Mostrar contato da sessão como leitura; não enviar contato editável.
- Rodar testes, lint e build.
