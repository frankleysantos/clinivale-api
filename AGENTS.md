# Diretrizes e Instruções Obrigatórias do Projeto (clinivale-api)

Antes de realizar qualquer alteração de código ou responder a requisições, certifique-se de seguir rigorosamente as regras abaixo:

## 1. Sem Execução de Comandos de Terminal / Build
- **NUNCA** execute comandos no terminal (como `npm run build`, `nest build`, `npx vue-tsc`, etc.) a menos que o usuário peça explicitamente.
- O foco do agente deve ser **exclusivamente a alteração direta de código** nos arquivos para evitar desperdício de tempo e consumo excessivo de tokens.

## 2. Isolamento por Clínica Logada (`client_id`)
- **Toda e qualquer listagem, criação ou alteração** no sistema deve obrigatoriamente ser filtrada e vinculada à clínica ativa em que o usuário está logado (`user.client.id` / `user.clientId`).
- Nunca listar dados globais de outros clientes a menos que seja um perfil de super-administrador global sem restrição.

## 3. Validação de Roles por Clínica
- Sempre verificar se o usuário possui função/permissão (`role`) associada à clínica selecionada/logada antes de permitir login ou ações restritas.

## 4. Reutilização de Código e Padrões Existentes
- Reaproveitar `UserEntity`, `RoleEntity`, `ClientEntity`, `PatientEntity` e seus respetivos repositórios.
- Reutilizar injetores e modificadores (ex: validadores de CPF/CNPJ em `src/global/common/validator`).
- Manter o padrão de DTOs do NestJS e Swagger Annotations (`@ApiTags`, `@ApiOperation`, `@ApiQuery`).
