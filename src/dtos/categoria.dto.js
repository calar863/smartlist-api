const { z } = require("zod");

// DTO de entrada: cadastro de categoria (equivalente a Technology na especificação original)
const categoriaInputSchema = z.object({
  nome: z.string().trim().min(1, "O nome da categoria é obrigatório."),
});

function toCategoriaOutput(categoria) {
  return {
    id: categoria.id,
    nome: categoria.nome,
  };
}

module.exports = { categoriaInputSchema, toCategoriaOutput };
