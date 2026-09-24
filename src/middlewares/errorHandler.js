const { ZodError } = require("zod");
const { Prisma } = require("@prisma/client");
const { AppError } = require("../errors/AppError");

// Manipulador global de erros: formata respostas amigáveis para
// 400 (validação), 404 (não encontrado), 409 (conflito) e 500 (erro inesperado).
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      erro: err.message,
      ...(err.detalhes ? { detalhes: err.detalhes } : {}),
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: "Dados inválidos.",
      detalhes: err.flatten().fieldErrors,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ erro: "Já existe um registro com esses dados." });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ erro: "Registro não encontrado." });
    }
  }

  console.error(err);
  return res.status(500).json({ erro: "Erro interno no servidor." });
}

function notFoundHandler(req, res) {
  res.status(404).json({ erro: "Rota não encontrada." });
}

module.exports = { errorHandler, notFoundHandler };
