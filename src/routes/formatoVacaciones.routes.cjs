const { Router } = require("express");
const formatoVacaciones =
  require("../controllers/formatoVacaciones.controller.cjs").methods;

const router = Router();

//GET
router.get("/", formatoVacaciones.getFormatoVacaciones);

//POST
router.post("/guardar", formatoVacaciones.guardarVacaciones);


module.exports = router;