# Task 1 — Gateway, token e sessão

Status: complete

Source worktree: `.worktrees/auth-authorization`

## Implemented items

- Added the `USER | ADMIN` user-role contract, authentication inputs/results, and `AuthGateway`.
- Added `HttpAuthGateway` for `POST /auth/register`, `/login`, `/refresh`, `/logout`, and `GET /me`, all relative to the configured `/api` base URL.
- Added an in-memory access-token module. It does not use browser storage and can notify the active provider when a refresh failure expires the session.
- Configured Axios with credentials, bearer token injection, a single shared refresh for concurrent `401` responses, one retry per failed request, and session clearing on refresh failure.
- Added `AuthProvider`, `useAuth`, login/register/logout actions, refresh-based restoration, and a shared restoration promise that prevents duplicate StrictMode restores.
- Configured Vite to inject `VITE_API_URL`, defaulting to `/api`, so Jest can test the HTTP layer without `import.meta` CommonJS incompatibility.

## Files changed

- `sunwash-web/vite.config.ts`
- `sunwash-web/src/domain/User.ts`
- `sunwash-web/src/application/gateway/AuthGateway.ts`
- `sunwash-web/src/infra/gateway/HttpAuthGateway.ts`
- `sunwash-web/src/infra/gateway/HttpAuthGateway.test.ts`
- `sunwash-web/src/infra/http/authToken.ts`
- `sunwash-web/src/infra/http/authToken.test.ts`
- `sunwash-web/src/infra/http/api.ts`
- `sunwash-web/src/infra/http/api.test.ts`
- `sunwash-web/src/presentation/context/AuthContext.tsx`
- `sunwash-web/src/presentation/context/AuthContext.test.ts`
- `sunwash-web/src/presentation/context/useAuth.ts`

## Verification

- `npm test -- --runInBand`
- `npm run lint`
- `npm run build`
- `git diff --check`

## Notes

- The task report in the worktree documents the RED/GREEN cycle and the final review details.
- The current root docs only need this completed task added; the remaining planned tasks stay in `docs/superpowers/plans/2026-08-27-authentication-authorization.md`.
