const categoriasService = require("../services/categorias.service");
const { categoriaInputSchema, toCategoriaOutput } = require("../dtos/categoria.dto");
const { BadRequestError } = require("../errors/AppError");

async function criar(req, res) {
  const resultado = categoriaInputSchema.safeParse(req.body);
  if (!resultado.success) {
    throw new BadRequestError("Dados inválidos.", resultado.error.flatten().fieldErrors);
  }

  const categoria = await categoriasService.cadastrar(resultado.data);
  return res.status(201).json(toCategoriaOutput(categoria));
}

async function listar(req, res) {
  const categorias = await categoriasService.listar();
  return res.json(categorias.map(toCategoriaOutput));
}

module.exports = { criar, listar };
