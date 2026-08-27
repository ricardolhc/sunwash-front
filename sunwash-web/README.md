# SunWash Web

Frontend React integrado a API Spring Boot em `sunwash-back/back`.

## Execucao integrada

1. Inicie PostgreSQL e crie o banco `sunwash`.
2. Configure no backend: `STRIPE_SECRET_KEY`, `MERCADO_PAGO_ACCESS_TOKEN`,
   `ADMIN_API_TOKEN`, `AWS_S3_BUCKET`, `AWS_S3_REGION`, `AWS_ACCESS_KEY_ID` e
   `AWS_SECRET_ACCESS_KEY`.
3. Execute `mvn spring-boot:run` em `sunwash-back/back`.
4. Copie `.env-template` para `.env`, preencha `VITE_STRIPE_PUBLIC_KEY` e
   `VITE_ADMIN_API_TOKEN`, e execute `npm run dev`.

`VITE_USE_HTTP=true` ativa os gateways reais. Use `false` apenas para os mocks
em memoria. Em producao, configure `FRONTEND_ALLOWED_ORIGINS` no backend. O
bucket S3 precisa permitir leitura das imagens enviadas (direta ou por CDN).

## Base tecnica

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
