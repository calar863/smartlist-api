const express = require("express");

const usuariosRoutes = require("./routes/usuarios.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const listasRoutes = require("./routes/listas.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ nome: "SmartList API", status: "ok" });
});

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/listas", listasRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

module.exports = app;
