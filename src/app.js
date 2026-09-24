const express = require("express");
const swaggerUi = require("swagger-ui-express");

const openapiSpec = require("./openapi");
const usuariosRoutes = require("./routes/usuarios.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const listasRoutes = require("./routes/listas.routes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ nome: "SmartList API", status: "ok", docs: "/api-docs" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/listas", listasRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
