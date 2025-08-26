const { Router } = require("express");
const formatoVacaciones =
  require("../controllers/formatoVacaciones.controller.cjs").methods;

const router = Router();

//GET
router.get("/", formatoVacaciones.getFormatoVacaciones);


module.exports = router;