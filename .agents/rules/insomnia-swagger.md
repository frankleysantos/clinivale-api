# Regra de Manutenção de APIs e Coleção do Insomnia

Sempre que uma nova API, controller ou endpoint for adicionado, modificado ou removido neste projeto:
1. Certifique-se de que os decorators do Swagger (`@ApiTags`, `@ApiOperation`, etc.) ou os DTOs estejam devidamente configurados para reflexão no NestJS Swagger.
2. A aplicação gera automaticamente o arquivo `openapi.json` ao ser inicializada através do `SwaggerModule` configurado em `src/main.ts`.
3. Atualize ou verifique também o arquivo `insomnia_collection.json` se houver novos corpos de requisição de exemplo para os usuários utilizarem no Insomnia.
