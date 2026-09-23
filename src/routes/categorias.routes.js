const express = require("express");
const controller = require("../controllers/categorias.controller");

const router = express.Router();

router.post("/", controller.criar);
router.get("/", controller.listar);

module.exports = router;
