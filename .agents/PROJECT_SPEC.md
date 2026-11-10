# Especificação de Memória e Contexto do Projeto (clinivale-api)

Este documento registra o contexto arquitetural, regras de negócio e o estado atual das implementações para que qualquer assistente de IA ou desenvolvedor consiga continuar o trabalho exatamente de onde parou.

---

## 1. Visão Geral da Arquitetura
- **Stack**: NestJS, TypeORM, PostgreSQL/MySQL, TypeScript, Swagger/OpenAPI.
- **Autenticação**: JWT com guards (`JwtGuard`, `RolesGuard`). O token armazena o usuário e a clínica ativa selecionada (`client_id`).
- **Swagger**: Gerado automaticamente em `openapi.json` e documentado via decorators (`@ApiTags`, `@ApiOperation`, `@ApiQuery`, etc.).

---

## 2. Regras Fundamentais de Negócio

### Multi-tenant / Isolamento por Clínica (`client_id`)
1. **Regra de Acesso**: Toda e qualquer listagem, criação ou alteração de registros no sistema deve ser vinculada à clínica ativa em que o usuário está logado (`user.client.id` / `user.clientId`).
2. **Clínica Master (ID: 1 - Clinivale)**:
   - Apenas usuários associados à clínica Clinivale (ID: 1) possuem permissão para **criar novos clientes (clínicas)** no endpoint `POST /clients/create`.
   - Apenas usuários da clínica 1 podem criar usuários indicando outro `client_id` (para associar o novo usuário a uma clínica terceira). Usuários de clínicas comuns só podem cadastrar usuários na sua própria clínica.
   - Listagem global de clientes no `GET /clients` é permitida apenas para a clínica master; demais clínicas enxergam apenas a sua própria clínica.

### Validação de Roles e Permissões
- Uma role pode ser global (`client_id IS NULL`) ou específica de uma clínica (`client_id = X`).
- O usuário apenas consegue executar métodos de controllers se tiver uma role com essa permissão vinculada à clínica ativa.
- `RolesController.findAll(client_id)` retorna roles da clínica selecionada + roles globais (`IsNull()`).

---

## 3. Estado Atual das Últimas Implementações
- **Seed automático (`seed.service.ts`)**:
  - Ajustado para consulta no TypeORM com `IsNull()` em vez de `null` para evitar erros de compilação TypeScript.
  - Cria/atualiza o cliente master Clinivale, a role `ADMINISTRADOR` com todas as rotas e o usuário `admin@clinivale.com`.
- **Controle de Acesso em Clientes e Usuários**:
  - `ClientService.create` e `ClientController.create`: Validam se o usuário logado pertence à clínica 1 / Clinivale. Dispara `ForbiddenException` caso contrário.
  - `UserService.create` e `UserController.create`: Validam `client_id`. Se uma clínica diferente da logada for informada, apenas usuários da clínica 1 têm permissão.
- **Integração MCP Memory**:
  - Configurado servidor `@modelcontextprotocol/server-memory` em `.agents/mcp_config.json` apontando para `.agents/memory.json`.

