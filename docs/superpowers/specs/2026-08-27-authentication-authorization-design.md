# Autenticação e apresentação — front-end

## Objetivo

Criar sessão no navegador, telas de conta, rotas protegidas, navegação por papel e textos de status em português.

## Contrato usado da API

- `POST /api/auth/register`, `/login`, `/refresh`, `/logout` e `GET /me`.
- Login, cadastro e refresh retornam `{ accessToken, tokenType, expiresIn, user }`.
- Usuário tem papel `USER` ou `ADMIN`.
- API usa status em inglês. A tela só mostra tradução.

## Sessão

Access token fica somente em memória. Axios usa `withCredentials`, envia Bearer token e faz um refresh compartilhado quando várias chamadas recebem `401`. Cada chamada repete uma vez. Falha no refresh limpa a sessão.

`AuthProvider` expõe `loading`, `authenticated` e `anonymous`; restaura a sessão ao iniciar; oferece cadastro, login e logout. Não usar `localStorage` ou `sessionStorage` para token.

## Telas e rotas

- Criar `/login` e `/cadastro`.
- Visitante em rota protegida vai para login e volta ao destino após autenticar.
- Usuário autenticado não abre login/cadastro.
- `USER`: `/agendar`, `/checkout`, `/painel`.
- `ADMIN`: `/admin`.
- Guards esperam a restauração da sessão antes de redirecionar.

Telas têm logo SunWash, cores atuais, validação, labels acessíveis, erro da API e botão de mostrar senha.

## Navegação e fluxo

- Visitante vê Início, Entrar e Criar conta.
- `USER` vê Início, Agendar, Painel, nome e Sair.
- `ADMIN` vê Início, Painel administrativo, nome e Sair.
- Agendamento usa dados da sessão. Não envia IDs, nome, e-mail ou telefone controlados pelo navegador.
- Pagamento admin não usa token compartilhado em header.

## Status

Usar um mapa central: `PENDING`/Pendente, `CONFIRMED`/Confirmado, `IN_PROGRESS`/Em andamento, `COMPLETED`/Concluído e `CANCELLED`/Cancelado. Valores enviados à API continuam em inglês.

## Testes

Usar Vitest e Testing Library para sessão, refresh único, guards, telas, menu por papel, chamadas autenticadas e labels. Rodar teste, lint e build.
