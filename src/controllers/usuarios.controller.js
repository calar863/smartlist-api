const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const { usuarioInputSchema, toUsuarioOutput } = require("../dtos/usuario.dto");

async function criar(req, res) {
  const resultado = usuarioInputSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({
      erro: "Dados inválidos.",
      detalhes: resultado.error.flatten().fieldErrors,
    });
  }

  const { nome, email, senha } = resultado.data;

  // Regra de Negócio: o e-mail informado deve ser único no sistema.
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash },
  });

  return res.status(201).json(toUsuarioOutput(usuario));
}

async function buscarPorId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: "id inválido." });
  }

  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado." });
  }

  return res.json(toUsuarioOutput(usuario));
}

module.exports = { criar, buscarPorId };
