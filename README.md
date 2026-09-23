# SmartList API

Backend da plataforma SmartList (Projeto Integrador), com persistência de
dados relacional. Esta etapa implementa a fundação arquitetural da API:
entidades, relacionamentos, DTOs com validação e os endpoints REST
principais.

Esta entrega parte de uma especificação genérica de "DevShowcase API"
(Profile/Project/Technology/Feedback) adaptada para o domínio real do
SmartList, mantendo a mesma estrutura técnica exigida:

| Especificação original | SmartList API |
|---|---|
| `Profile` (Perfil do Desenvolvedor) | `Usuario` |
| `Project` (Projeto) | `Lista` (lista de compras) |
| `Technology` (Tecnologia) | `Categoria` |
| `Feedback` (Opinião) | `Item` |

## Tecnologias

- Node.js + Express 5
- Prisma ORM + SQLite (banco relacional em arquivo, sem servidor externo)
- Zod (validação de DTOs de entrada)
- bcryptjs (hash de senha)

## Modelagem relacional

```
Usuario 1 ────── N Lista
Lista   N ────── N Categoria
Lista   1 ────── N Item
```

- **Usuario**: id, nome, email (único), senha (hash), criadoEm
- **Categoria**: id, nome (único)
- **Lista**: id, nome, linkReferencia (opcional, URL), dataCriacao, usuarioId,
  categorias (N:N), itens (1:N)
- **Item**: id, nome, quantidade, categoria (texto livre), status, listaId

O schema completo está em [`prisma/schema.prisma`](prisma/schema.prisma).

## Como rodar o projeto

Pré-requisito: Node.js 18+.

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

A API sobe em `http://localhost:3000`.

## Endpoints implementados

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/usuarios` | Cadastro de usuário (validação de e-mail único e senha forte) |
| GET | `/api/usuarios/:id` | Buscar usuário por id |
| POST | `/api/categorias` | Cadastro de categoria (validação de nome único) |
| GET | `/api/categorias` | Listagem de todas as categorias |
| POST | `/api/listas` | Cadastro de lista de compras (validação de nome e URL de referência) |
| GET | `/api/listas` | Listagem de listas (com usuário, categorias e itens) |

### Exemplos de requisição

**POST /api/usuarios**
```json
{ "nome": "Maria Teste", "email": "maria@teste.com", "senha": "senha123" }
```

**POST /api/categorias**
```json
{ "nome": "Bebidas" }
```

**POST /api/listas**
```json
{
  "nome": "Compras do mes",
  "usuarioId": 1,
  "linkReferencia": "https://exemplo.com/receita",
  "categoriaIds": [1]
}
```

Uma coleção pronta do Postman está em
[`postman_collection.json`](postman_collection.json) — importe no Postman
para testar os 6 endpoints rapidamente.

## Regras de validação (DTOs de entrada)

- Usuário: nome obrigatório; e-mail válido e único; senha com no mínimo 8
  caracteres, contendo letras e números.
- Categoria: nome obrigatório e único.
- Lista: nome obrigatório; não pode duplicar para o mesmo usuário;
  `linkReferencia`, se informado, precisa ser uma URL válida; `usuarioId`
  precisa existir.

## Próximos passos

- Endpoints de Item (adicionar/remover/concluir item em uma lista).
- Autenticação via token (JWT) nos endpoints protegidos.
- Integração do front-end (repositório `smartlist`) com esta API, substituindo
  o `localStorage` por chamadas HTTP.
