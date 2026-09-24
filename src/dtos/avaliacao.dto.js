const { z } = require("zod");

// DTO de entrada: avaliar uma lista (equivalente a Feedback na especificação original)
const avaliacaoInputSchema = z.object({
  nota: z.coerce
    .number()
    .int("A nota deve ser um número inteiro.")
    .min(1, "A nota deve ser entre 1 e 5.")
    .max(5, "A nota deve ser entre 1 e 5."),
  comentario: z.string().trim().max(500, "O comentário deve ter no máximo 500 caracteres.").optional(),
});

function toAvaliacaoOutput(avaliacao) {
  return {
    id: avaliacao.id,
    nota: avaliacao.nota,
    comentario: avaliacao.comentario || null,
    criadoEm: avaliacao.criadoEm,
    listaId: avaliacao.listaId,
  };
}

module.exports = { avaliacaoInputSchema, toAvaliacaoOutput };
