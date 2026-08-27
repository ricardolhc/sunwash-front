# Front-end authentication implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development`. Use the checkboxes.

**Goal:** Entregar sessão, telas e fluxos autenticados no navegador.

**Architecture:** React guarda o access token em memória. Axios anexa o token e renova uma vez. Guards e menus usam o papel da sessão.

**Tech Stack:** React 19, TypeScript, React Router, Axios, React Hook Form, Zod, Tailwind, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-27-authentication-authorization-design.md`

## Regras globais

- Token não vai para storage do navegador.
- Papéis: `USER` e `ADMIN`.
- API recebe status em inglês.

### Task 1: Gateway, token e sessão

**Files:** `package.json`, `vite.config.ts`, `src/domain/User.ts`, `AuthGateway`, `HttpAuthGateway`, `authToken.ts`, `api.ts`, `AuthContext.tsx`, `useAuth.ts` e testes.

- [ ] Testar gateway, token em memória, refresh único e restauração.
- [ ] Rodar testes. Confirmar falha.
- [ ] Criar tipos `User`, `AuthResult`, inputs e `AuthGateway`.
- [ ] Criar adaptador HTTP para as cinco rotas de auth.
- [ ] Configurar Axios: cookie, Bearer, refresh único e uma repetição.
- [ ] Criar provider com login, cadastro, logout e restauração segura no StrictMode.
- [ ] Rodar testes, `npm run lint` e `npm run build`.

### Task 2: Guards e telas de conta

**Files:** `main.tsx`, `App.tsx`, routes, `ProtectedRoute`, `PublicOnlyRoute`, spinner, controllers, views, pages e testes.

- [ ] Testar visitante em rota protegida, `USER` fora do admin e validação de formulário.
- [ ] Criar guards que esperam `loading`.
- [ ] Criar `/login` e `/cadastro`.
- [ ] Criar schemas Zod para e-mail, senha e confirmação.
- [ ] Criar telas responsivas com labels, erros e botão de senha visível.
- [ ] Após login, voltar ao destino permitido ou ao painel do papel.
- [ ] Rodar testes, lint e build.

### Task 3: Navegação e fluxos autenticados

**Files:** `Navbar`, `Footer`, storage, gateways de agendamento/pagamento, controllers, views e testes.

- [ ] Testar menu de visitante, `USER` e `ADMIN`.
- [ ] Testar `GET /appointments/me` sem query, criação sem identidade e captura sem `X-Admin-Token`.
- [ ] Criar uma matriz de links usada em desktop e mobile.
- [ ] Remover estado falso de usuário/admin do storage.
- [ ] Usar `listMine()` e sessão para agendamento e painel.
- [ ] Mostrar contato da sessão como leitura; não enviar contato editável.
- [ ] Rodar testes, lint e build.

### Task 4: Status em português

**Files:** `appointmentStatus.ts`, views de admin/cliente, controller e testes.

- [ ] Testar as cinco traduções e valor inglês enviado à API.
- [ ] Criar mapa central e função `appointmentStatusLabel`.
- [ ] Usar mapa em filtros, select, badges e timeline.
- [ ] Rodar testes, lint e build.

### Task 5: Verificar e documentar o front

- [ ] Rodar `npm test`, `npm run lint` e `npm run build`.
- [ ] Subir o front contra API local.
- [ ] Verificar visitante, cadastro, refresh, `USER`, `ADMIN`, tradução e logout.
- [ ] Atualizar `README.md` e `.env-template` com `VITE_API_URL`, ordem de execução e credenciais dev.
- [ ] Rodar `git diff --check` e `git status --short`.
