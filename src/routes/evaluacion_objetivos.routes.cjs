const { Router } = require("express");
const objetivosController =
  require("../controllers/evaluacion_objetivos.controller.cjs").methods;

const router = Router();

// GET BY EVALUACION
router.get(
  "/evaluacion/:id_evaluacion",
  objetivosController.getObjetivosByEvaluacion,
);

// POST
router.post("/", objetivosController.addObjetivo);

// PUT
router.put("/:id", objetivosController.updateObjetivo);

// DELETE
router.delete("/:id", objetivosController.deleteObjetivo);

module.exports = router;
