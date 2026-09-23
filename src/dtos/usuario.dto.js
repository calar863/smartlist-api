const { z } = require("zod");

// DTO de entrada: cadastro de usuário (Caso de Uso: Cadastrar usuário)
const usuarioInputSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório."),
  email: z.string().trim().email("Informe um e-mail válido."),
  senha: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres.")
    .regex(/[a-zA-Z]/, "A senha deve conter letras.")
    .regex(/[0-9]/, "A senha deve conter números."),
});

// DTO de saída: nunca expõe o hash da senha.
function toUsuarioOutput(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    criadoEm: usuario.criadoEm,
  };
}

module.exports = { usuarioInputSchema, toUsuarioOutput };
