const usuariosService = require("../services/usuarios.service");
const { usuarioInputSchema, toUsuarioOutput } = require("../dtos/usuario.dto");
const { BadRequestError } = require("../errors/AppError");

async function criar(req, res) {
  const resultado = usuarioInputSchema.safeParse(req.body);
  if (!resultado.success) {
    throw new BadRequestError("Dados inválidos.", resultado.error.flatten().fieldErrors);
  }

  const usuario = await usuariosService.cadastrar(resultado.data);
  return res.status(201).json(toUsuarioOutput(usuario));
}

async function buscarPorId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("id inválido.");
  }

  const usuario = await usuariosService.buscarPorId(id);
  return res.json(toUsuarioOutput(usuario));
}

module.exports = { criar, buscarPorId };
