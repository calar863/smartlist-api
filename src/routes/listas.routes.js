const express = require("express");
const controller = require("../controllers/listas.controller");

const router = express.Router();

router.post("/", controller.criar);
router.get("/", controller.listar);
router.post("/:id/avaliacoes", controller.avaliar);
router.put("/:id/favoritar", controller.favoritar);

module.exports = router;
