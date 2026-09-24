// Especificação OpenAPI 3.0 da SmartList API, servida via Swagger UI em /api-docs.
const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "SmartList API",
    version: "1.0.0",
    description:
      "Backend da plataforma SmartList (Projeto Integrador). Adaptado da especificação " +
      "DevShowcase API (Profile/Project/Technology/Feedback) para o domínio do SmartList " +
      "(Usuario/Lista/Categoria/Item/Avaliacao).",
  },
  paths: {
    "/api/usuarios": {
      post: {
        summary: "Cadastrar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: { nome: "Maria Teste", email: "maria@teste.com", senha: "senha123" },
            },
          },
        },
        responses: {
          201: { description: "Usuário criado" },
          400: { description: "Dados inválidos" },
          409: { description: "E-mail já cadastrado" },
        },
      },
    },
    "/api/usuarios/{id}": {
      get: {
        summary: "Buscar usuário por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Usuário encontrado" },
          404: { description: "Usuário não encontrado" },
        },
      },
    },
    "/api/categorias": {
      post: {
        summary: "Cadastrar categoria",
        requestBody: {
          required: true,
          content: { "application/json": { example: { nome: "Bebidas" } } },
        },
        responses: {
          201: { description: "Categoria criada" },
          400: { description: "Dados inválidos" },
          409: { description: "Categoria já cadastrada" },
        },
      },
      get: {
        summary: "Listar categorias",
        responses: { 200: { description: "Lista de categorias" } },
      },
    },
    "/api/listas": {
      post: {
        summary: "Cadastrar lista de compras",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                nome: "Compras do mes",
                usuarioId: 1,
                linkReferencia: "https://exemplo.com/receita",
                categoriaIds: [1],
              },
            },
          },
        },
        responses: {
          201: { description: "Lista criada" },
          400: { description: "Dados inválidos" },
          404: { description: "Usuário não encontrado" },
          409: { description: "Lista com esse nome já existe para o usuário" },
        },
      },
      get: {
        summary: "Listar listas (com filtro por categoria e paginação)",
        parameters: [
          { name: "categoria", in: "query", required: false, schema: { type: "string" } },
          { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
          { name: "pageSize", in: "query", required: false, schema: { type: "integer", default: 10 } },
        ],
        responses: { 200: { description: "Lista paginada de listas" } },
      },
    },
    "/api/listas/{id}/avaliacoes": {
      post: {
        summary: "Avaliar uma lista (nota de 1 a 5 + comentário)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { example: { nota: 5, comentario: "Lista muito completa!" } },
          },
        },
        responses: {
          201: { description: "Avaliação registrada, nota média recalculada" },
          400: { description: "Nota inválida (deve ser entre 1 e 5)" },
          404: { description: "Lista não encontrada" },
        },
      },
    },
    "/api/listas/{id}/favoritar": {
      put: {
        summary: "Favoritar lista (upvote / incrementa contador de favoritos)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Contador de favoritos incrementado" },
          404: { description: "Lista não encontrada" },
        },
      },
    },
  },
};

module.exports = openapiSpec;
