# SmartList API

Backend da plataforma SmartList (Projeto Integrador). Esta é a entrega final:
regras de negócio na camada de serviço, tratamento global de erros,
documentação interativa (Swagger/OpenAPI) e deploy em produção com banco
PostgreSQL na nuvem.

Esta entrega parte de uma especificação genérica de "DevShowcase API"
(Profile/Project/Technology/Feedback) adaptada para o domínio real do
SmartList, mantendo a mesma estrutura técnica exigida:

| Especificação original | SmartList API |
|---|---|
| `Profile` (Perfil do Desenvolvedor) | `Usuario` |
| `Project` (Projeto) | `Lista` (lista de compras) |
| `Technology` (Tecnologia) | `Categoria` |
| `Feedback` (Opinião, nota + comentário) | `Avaliacao` (nota de 1 a 5 + comentário sobre uma lista) |
| `Upvote` (curtida em um projeto) | Favoritar lista (contador de favoritos) |
| Filtro por tecnologia | Filtro por categoria |

## Tecnologias

- Node.js + Express 5
- Prisma ORM + PostgreSQL (banco relacional em produção, provisionado no Supabase)
- Zod (validação de DTOs de entrada)
- bcryptjs (hash de senha)
- swagger-ui-express (documentação interativa da API)
- Deploy contínuo no Render, a partir do repositório GitHub

## Arquitetura

```
src/
  routes/        -> define as rotas HTTP e aponta para os controllers
  controllers/    -> "magros": validam entrada (DTO) e devolvem a resposta HTTP
  services/       -> regras de negócio (validações de domínio, cálculos, orquestração do Prisma)
  dtos/           -> schemas Zod de entrada/saída
  errors/         -> classes de erro de domínio (AppError, NotFoundError, ConflictError, BadRequestError)
  middlewares/    -> manipulador global de erros
  openapi.js      -> especificação OpenAPI servida em /api-docs
```

Os controllers não tratam erro diretamente: eles lançam (`throw`) um erro de
domínio ou deixam o Prisma lançar o seu, e o **manipulador global de erros**
(`src/middlewares/errorHandler.js`) formata a resposta final (400, 404, 409 ou
500), incluindo erros de validação do Zod e erros conhecidos do Prisma
(registro duplicado, registro não encontrado).

## Modelagem relacional

```
Usuario 1 ────── N Lista
Lista   N ────── N Categoria
Lista   1 ────── N Item
Lista   1 ────── N Avaliacao
```

- **Usuario**: id, nome, email (único), senha (hash), criadoEm
- **Categoria**: id, nome (único)
- **Lista**: id, nome, linkReferencia (opcional, URL), dataCriacao, notaMedia,
  favoritos, usuarioId, categorias (N:N), itens (1:N), avaliacoes (1:N)
- **Item**: id, nome, quantidade, categoria (texto livre), status, listaId
- **Avaliacao**: id, nota (1 a 5), comentario (opcional), criadoEm, listaId

O schema completo está em [`prisma/schema.prisma`](prisma/schema.prisma).

## Como rodar o projeto localmente

Pré-requisito: Node.js 18+ e um banco PostgreSQL (local, Docker ou uma
instância do Supabase — veja a seção de deploy abaixo).

```bash
npm install
cp .env.example .env
# edite o .env com a sua DATABASE_URL do Postgres
npx prisma migrate dev
npm run dev
```

A API sobe em `http://localhost:3000`. A documentação interativa fica em
`http://localhost:3000/api-docs`.

## Endpoints implementados

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/usuarios` | Cadastro de usuário (validação de e-mail único e senha forte) |
| GET | `/api/usuarios/:id` | Buscar usuário por id |
| POST | `/api/categorias` | Cadastro de categoria (validação de nome único) |
| GET | `/api/categorias` | Listagem de todas as categorias |
| POST | `/api/listas` | Cadastro de lista de compras (validação de nome e URL de referência) |
| GET | `/api/listas` | Listagem de listas, com filtro `?categoria=` e paginação `?page=&pageSize=` |
| POST | `/api/listas/:id/avaliacoes` | Avaliar uma lista (nota de 1 a 5 + comentário); recalcula a nota média |
| PUT | `/api/listas/:id/favoritar` | Favoritar lista (upvote), incrementa o contador de favoritos |

### Exemplos de requisição

**POST /api/listas/:id/avaliacoes**
```json
{ "nota": 5, "comentario": "Lista muito completa!" }
```

**PUT /api/listas/:id/favoritar** — sem corpo.

**GET /api/listas?categoria=Bebidas&page=1&pageSize=10**

Uma coleção pronta do Postman está em
[`postman_collection.json`](postman_collection.json) — inclui todos os
endpoints, além de dois exemplos de erro (`[ERRO 404]` e `[ERRO 400]`) para
demonstrar o tratamento global de exceções.

## Tratamento de erros

Erros de validação (Zod), erros de negócio (`NotFoundError`,
`ConflictError`, `BadRequestError`) e erros conhecidos do Prisma são
capturados pelo manipulador global e retornam sempre no formato:

```json
{ "erro": "Mensagem amigável", "detalhes": { "campo": ["motivo"] } }
```

## Documentação interativa (Swagger)

Disponível em `/api-docs` (local: `http://localhost:3000/api-docs`, em
produção: `<URL_DO_DEPLOY>/api-docs`).

## Deploy em produção

### 1. Banco de dados — Supabase (PostgreSQL)

1. Crie uma conta em [supabase.com](https://supabase.com).
2. **New project** → escolha um nome, senha do banco e região.
3. Em **Project Settings → Database → Connection string**, copie a URI no
   modo **Connection pooling** (recomendada para apps serverless/PaaS).
4. Essa é a sua `DATABASE_URL`.

### 2. Deploy da API — Render

1. Crie uma conta em [render.com](https://render.com) e conecte sua conta do
   GitHub.
2. **New → Web Service** → selecione o repositório `smartlist-api`.
3. Configurações:
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
4. Em **Environment**, adicione a variável `DATABASE_URL` com o valor copiado
   do Supabase.
5. Clique em **Create Web Service**. O Render builda e sobe automaticamente a
   cada push no branch `main` (deploy contínuo).

Este repositório também inclui um [`render.yaml`](render.yaml) — no Render,
use **New → Blueprint** apontando para o repositório para que essas
configurações sejam aplicadas automaticamente (só a `DATABASE_URL` precisa
ser preenchida manualmente).

## Próximos passos

- Autenticação via token (JWT) nos endpoints protegidos.
- Endpoints de Item (adicionar/remover/concluir item em uma lista).
- Integração do front-end (repositório `smartlist`) com esta API, substituindo
  o `localStorage` por chamadas HTTP.
