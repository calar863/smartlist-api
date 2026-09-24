const { z } = require("zod");

// DTO de entrada: cadastro de lista de compras (equivalente a Project na especificação original)
const listaInputSchema = z.object({
  nome: z.string().trim().min(1, "O nome da lista é obrigatório."),
  usuarioId: z.coerce.number().int().positive("usuarioId é obrigatório e deve ser válido."),
  linkReferencia: z
    .string()
    .trim()
    .url("linkReferencia deve ser uma URL válida.")
    .optional()
    .or(z.literal("")),
  categoriaIds: z.array(z.coerce.number().int().positive()).optional(),
});

function toListaOutput(lista) {
  return {
    id: lista.id,
    nome: lista.nome,
    linkReferencia: lista.linkReferencia || null,
    dataCriacao: lista.dataCriacao,
    notaMedia: lista.notaMedia ?? 0,
    favoritos: lista.favoritos ?? 0,
    usuario: lista.usuario
      ? { id: lista.usuario.id, nome: lista.usuario.nome }
      : { id: lista.usuarioId },
    categorias: (lista.categorias || []).map((c) => ({ id: c.id, nome: c.nome })),
    itens: (lista.itens || []).map((i) => ({
      id: i.id,
      nome: i.nome,
      quantidade: i.quantidade,
      categoria: i.categoria,
      status: i.status,
    })),
  };
}

module.exports = { listaInputSchema, toListaOutput };
