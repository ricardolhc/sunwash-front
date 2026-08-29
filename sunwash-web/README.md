# SunWash Web

Frontend React/Vite do ecossistema SunWash. Esta versão documenta o fluxo atualizado do `Painel de Operações Técnicas`, a nova paginação do endpoint `/appointments` e a revisão de terminologia comercial para `Manutenção Preventiva`.

## Execução local

1. Inicie o backend `sunwash-back/back` com PostgreSQL configurado.
2. Preencha no backend as variáveis `STRIPE_SECRET_KEY`, `MERCADO_PAGO_ACCESS_TOKEN`, `ADMIN_API_TOKEN`, `AWS_S3_BUCKET`, `AWS_S3_REGION`, `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.
3. Copie `.env-template` para `.env`.
4. Configure no frontend `VITE_STRIPE_PUBLIC_KEY` e `VITE_ADMIN_API_TOKEN`.
5. Rode `npm install`.
6. Rode `npm run dev`.

## Terminologia da interface

- Textos de venda e descrição de serviço agora usam `Manutenção Preventiva e Higienização` quando o contexto é comercial.
- Labels curtas, CTAs e trechos operacionais usam `Manutenção Preventiva`.
- A troca foi aplicada em landing page, formulário de agendamento, painel do cliente, navbar, footer e modais do painel administrativo.

## Painel de Operações Técnicas

### Filtros suportados

O dashboard administrativo passou a enviar filtros diretamente para a API:

- `client`
- `address`
- `startDate`
- `endDate`
- `status`
- `page`
- `limit`

Os estados vivem em `src/presentation/controller/useAdminDashboardController.ts` e são reinicializados para `page = 1` sempre que algum filtro ou `limit` muda.

### Paginação

O rodapé da tabela agora oferece:

- botão `Página anterior`
- botão `Próxima página`
- paginação numérica
- seletor `Itens por página`

O frontend usa o `meta` retornado pela API para:

- exibir `totalItems` no resumo
- habilitar e desabilitar navegação
- manter `currentPage`, `itemsPerPage` e `totalPages` sincronizados com a consulta atual

### Loading

- `isLoading`: primeira carga da listagem
- `isRefreshing`: atualização por troca de filtro, status ou paginação

Durante atualizações, a view mostra feedback visual sem perder o contexto dos resultados anteriores.

## Contrato do endpoint `/appointments`

O `AppointmentGateway.listAll` agora trabalha com resposta paginada:

```json
{
  "data": [
    {
      "id": "app-sun-001",
      "clientName": "Ricardo Carvalho"
    }
  ],
  "meta": {
    "totalItems": 150,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 15,
    "currentPage": 1
  }
}
```

Arquivos principais do contrato:

- `src/application/gateway/AppointmentGateway.ts`
- `src/application/usecase/ListAllAppointmentsUseCase.ts`
- `src/infra/gateway/HttpAppointmentGateway.ts`
- `src/infra/gateway/MemoryAppointmentGateway.ts`

## Estrutura alterada

- `src/presentation/controller/useAdminDashboardController.ts`: estados de filtro, paginação, loading e ações do painel
- `src/presentation/view/AdminDashboard/AdminDashboardView.tsx`: barra de filtros, tabela, feedback de atualização e paginação
- `src/presentation/pages/AdminDashboardPage.tsx`: repasse dos novos props do controller
- `src/infra/gateway/*.test.ts`: cobertura do contrato paginado e do fallback em memória
- `src/presentation/controller/useAdminDashboardController.test.tsx`: cobertura do reset de página ao filtrar

## Verificação

Comandos usados para validar esta alteração:

- `npx jest src/infra/gateway/HttpAppointmentGateway.test.ts src/infra/gateway/MemoryAppointmentGateway.test.ts src/presentation/controller/useAdminDashboardController.test.tsx --runInBand`
- `npm run tsc:check`
- `npm test -- --runInBand`
