const prisma = require("../prisma");
const { listaInputSchema, toListaOutput } = require("../dtos/lista.dto");

const INCLUDE_RELACOES = {
  usuario: true,
  categorias: true,
  itens: true,
};

async function criar(req, res) {
  const resultado = listaInputSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({
      erro: "Dados inválidos.",
      detalhes: resultado.error.flatten().fieldErrors,
    });
  }

  const { nome, usuarioId, linkReferencia, categoriaIds } = resultado.data;

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado." });
  }

  // Ponto de Extensão: nome de lista duplicado para o mesmo usuário.
  const duplicada = await prisma.lista.findFirst({ where: { usuarioId, nome } });
  if (duplicada) {
    return res.status(409).json({ erro: "Você já possui uma lista com esse nome." });
  }

  if (categoriaIds && categoriaIds.length > 0) {
    const encontradas = await prisma.categoria.count({ where: { id: { in: categoriaIds } } });
    if (encontradas !== categoriaIds.length) {
      return res.status(400).json({ erro: "Uma ou mais categorias informadas não existem." });
    }
  }

  const lista = await prisma.lista.create({
    data: {
      nome,
      linkReferencia: linkReferencia || null,
      usuarioId,
      categorias: categoriaIds ? { connect: categoriaIds.map((id) => ({ id })) } : undefined,
    },
    include: INCLUDE_RELACOES,
  });

  return res.status(201).json(toListaOutput(lista));
}

async function listar(req, res) {
  const listas = await prisma.lista.findMany({
    include: INCLUDE_RELACOES,
    orderBy: { dataCriacao: "desc" },
  });
  return res.json(listas.map(toListaOutput));
}

module.exports = { criar, listar };
