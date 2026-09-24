const prisma = require("../prisma");
const { NotFoundError, ConflictError, BadRequestError } = require("../errors/AppError");

const INCLUDE_RELACOES = {
  usuario: true,
  categorias: true,
  itens: true,
};

async function criar({ nome, usuarioId, linkReferencia, categoriaIds }) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) {
    throw new NotFoundError("Usuário não encontrado.");
  }

  // Ponto de Extensão: nome de lista duplicado para o mesmo usuário.
  const duplicada = await prisma.lista.findFirst({ where: { usuarioId, nome } });
  if (duplicada) {
    throw new ConflictError("Você já possui uma lista com esse nome.");
  }

  if (categoriaIds && categoriaIds.length > 0) {
    const encontradas = await prisma.categoria.count({ where: { id: { in: categoriaIds } } });
    if (encontradas !== categoriaIds.length) {
      throw new BadRequestError("Uma ou mais categorias informadas não existem.");
    }
  }

  return prisma.lista.create({
    data: {
      nome,
      linkReferencia: linkReferencia || null,
      usuarioId,
      categorias: categoriaIds ? { connect: categoriaIds.map((id) => ({ id })) } : undefined,
    },
    include: INCLUDE_RELACOES,
  });
}

async function listar({ categoria, page, pageSize }) {
  const where = categoria
    ? { categorias: { some: { nome: { equals: categoria, mode: "insensitive" } } } }
    : {};

  const [total, listas] = await Promise.all([
    prisma.lista.count({ where }),
    prisma.lista.findMany({
      where,
      include: INCLUDE_RELACOES,
      orderBy: { dataCriacao: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    dados: listas,
    paginacao: {
      page,
      pageSize,
      total,
      totalPaginas: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

async function buscarPorId(id) {
  const lista = await prisma.lista.findUnique({ where: { id }, include: INCLUDE_RELACOES });
  if (!lista) {
    throw new NotFoundError("Lista não encontrada.");
  }
  return lista;
}

// Caso de Uso: Avaliar lista (equivalente a Feedback na especificação original)
// Recalcula a nota média da lista a cada nova avaliação.
async function avaliar(listaId, { nota, comentario }) {
  const lista = await prisma.lista.findUnique({ where: { id: listaId } });
  if (!lista) {
    throw new NotFoundError("Lista não encontrada.");
  }

  const avaliacao = await prisma.avaliacao.create({
    data: { listaId, nota, comentario: comentario || null },
  });

  const agregado = await prisma.avaliacao.aggregate({
    where: { listaId },
    _avg: { nota: true },
  });

  const notaMedia = agregado._avg.nota || 0;
  await prisma.lista.update({ where: { id: listaId }, data: { notaMedia } });

  return { avaliacao, notaMedia };
}

// Caso de Uso: Favoritar lista (equivalente a Upvote na especificação original)
async function favoritar(listaId) {
  const lista = await prisma.lista.findUnique({ where: { id: listaId } });
  if (!lista) {
    throw new NotFoundError("Lista não encontrada.");
  }

  return prisma.lista.update({
    where: { id: listaId },
    data: { favoritos: { increment: 1 } },
  });
}

module.exports = { criar, listar, buscarPorId, avaliar, favoritar };
