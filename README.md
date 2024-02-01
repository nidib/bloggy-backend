# Bloggy - Backend

REST API para o projeto Bloggy

### Como contribuir

-   Ter instalado o `node@20.9.0` e `docker`
-   Ter um postgres rodando na porta 5432 com um database já criado chamado `bloggy`
-   Executar `cp .env-sample .env` e definir as variáveis de ambiente necessárias no arquivo `.env`
    -   `DATABASE_URL`: Obrigatório. Não deve possuir o nome do database no fim.
    -   `JWT_KEY`: Obrigatório: Key privada para geração do JWT
    -   `TEST_DATABASE_URL`: Obrigatório para testes. Não deve possuir o nome do database no fim.
    -   `TEST_DATABASE_NAME`: Obrigatório. Nome do database para a conexão acima
-   Após definido as variáveis acima no `.env`
-   Instalar as dependências. `npm install`
-   Subir a API. `npm start`

### Endpoints

#### Públicos

-   `/register` - POST - Cria um usuário
-   `/login` - POST - Autentica um usuário

#### Privados

-   `/posts` - GET - Busca os últimos artigos criados paginado. Query params:
    -   order: `asc` ou `desc` - Busca os artigos ordenados por data de criação.
    -   page: Página dos artigos. 10 itens por página
    -   user: id do usuário filtrado
-   `/posts/:id` - GET - Busca um artigo por id
-   `/posts` - POST - Cria um artigo atrelando ao usuário autenticado
-   `/posts/:id` - PUT - Edita um artigo por id
-   `/posts/:id` - DELETE - Deleta um artigo por id
-   `/posts/:id/bookmark` - POST - Favorita um artigo por id com o usuário logado

-   `/user` - GET - Obtém informações do usuário logado
