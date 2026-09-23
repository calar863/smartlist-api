const prisma = require("../prisma");
const { categoriaInputSchema, toCategoriaOutput } = require("../dtos/categoria.dto");

async function criar(req, res) {
  const resultado = categoriaInputSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({
      erro: "Dados inválidos.",
      detalhes: resultado.error.flatten().fieldErrors,
    });
  }

  const { nome } = resultado.data;

  const existente = await prisma.categoria.findUnique({ where: { nome } });
  if (existente) {
    return res.status(409).json({ erro: "Esta categoria já está cadastrada." });
  }

  const categoria = await prisma.categoria.create({ data: { nome } });
  return res.status(201).json(toCategoriaOutput(categoria));
}

async function listar(req, res) {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });
  return res.json(categorias.map(toCategoriaOutput));
}

module.exports = { criar, listar };
