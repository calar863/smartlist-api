const prisma = require("../prisma");
const { ConflictError } = require("../errors/AppError");

async function cadastrar({ nome }) {
  const existente = await prisma.categoria.findUnique({ where: { nome } });
  if (existente) {
    throw new ConflictError("Esta categoria já está cadastrada.");
  }
  return prisma.categoria.create({ data: { nome } });
}

async function listar() {
  return prisma.categoria.findMany({ orderBy: { nome: "asc" } });
}

module.exports = { cadastrar, listar };
