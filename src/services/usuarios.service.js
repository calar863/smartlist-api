const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const { ConflictError, NotFoundError } = require("../errors/AppError");

async function cadastrar({ nome, email, senha }) {
  // Regra de Negócio: o e-mail informado deve ser único no sistema.
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    throw new ConflictError("Este e-mail já está cadastrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  return prisma.usuario.create({ data: { nome, email, senha: senhaHash } });
}

async function buscarPorId(id) {
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) {
    throw new NotFoundError("Usuário não encontrado.");
  }
  return usuario;
}

module.exports = { cadastrar, buscarPorId };
