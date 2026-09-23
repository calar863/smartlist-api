const express = require("express");
const controller = require("../controllers/usuarios.controller");

const router = express.Router();

router.post("/", controller.criar);
router.get("/:id", controller.buscarPorId);

module.exports = router;
