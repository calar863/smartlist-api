class AppError extends Error {
  constructor(statusCode, message, detalhes) {
    super(message);
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}

class BadRequestError extends AppError {
  constructor(message = "Dados inválidos.", detalhes) {
    super(400, message, detalhes);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado.") {
    super(404, message);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflito de dados.") {
    super(409, message);
  }
}

module.exports = { AppError, BadRequestError, NotFoundError, ConflictError };
