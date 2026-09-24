const listasService = require("../services/listas.service");
const { listaInputSchema, toListaOutput } = require("../dtos/lista.dto");
const { listaQuerySchema } = require("../dtos/listaQuery.dto");
const { avaliacaoInputSchema, toAvaliacaoOutput } = require("../dtos/avaliacao.dto");
const { BadRequestError } = require("../errors/AppError");

function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("id inválido.");
  }
  return id;
}

async function criar(req, res) {
  const resultado = listaInputSchema.safeParse(req.body);
  if (!resultado.success) {
    throw new BadRequestError("Dados inválidos.", resultado.error.flatten().fieldErrors);
  }

  const lista = await listasService.criar(resultado.data);
  return res.status(201).json(toListaOutput(lista));
}

async function listar(req, res) {
  const resultado = listaQuerySchema.safeParse(req.query);
  if (!resultado.success) {
    throw new BadRequestError("Parâmetros de busca inválidos.", resultado.error.flatten().fieldErrors);
  }

  const { dados, paginacao } = await listasService.listar(resultado.data);
  return res.json({
    dados: dados.map(toListaOutput),
    paginacao,
  });
}

// Caso de Uso: Avaliar lista (nota de 1 a 5 + comentário; recalcula a nota média)
async function avaliar(req, res) {
  const listaId = parseId(req.params.id);

  const resultado = avaliacaoInputSchema.safeParse(req.body);
  if (!resultado.success) {
    throw new BadRequestError("Dados inválidos.", resultado.error.flatten().fieldErrors);
  }

  const { avaliacao, notaMedia } = await listasService.avaliar(listaId, resultado.data);
  return res.status(201).json({ ...toAvaliacaoOutput(avaliacao), notaMediaAtualizada: notaMedia });
}

// Caso de Uso: Favoritar lista (equivalente a Upvote)
async function favoritar(req, res) {
  const listaId = parseId(req.params.id);
  const lista = await listasService.favoritar(listaId);
  return res.json(toListaOutput(lista));
}

module.exports = { criar, listar, avaliar, favoritar };
