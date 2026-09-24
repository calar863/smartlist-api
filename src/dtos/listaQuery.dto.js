const { z } = require("zod");

// DTO de entrada: filtros e paginação para GET /api/listas
const listaQuerySchema = z.object({
  categoria: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(10),
});

module.exports = { listaQuerySchema };
