const { Router } = require("express");
const evaluacionesController =
  require("../controllers/evaluaciones.controller.cjs").methods;

const router = Router();

// GET ALL
router.get("/", evaluacionesController.getEvaluaciones);

// GET ONE
router.get("/:id", evaluacionesController.getOneEvaluacion);

// POST
router.post("/", evaluacionesController.addEvaluacion);

// PUT
router.put("/:id", evaluacionesController.updateEvaluacion);

// DELETE
router.delete("/:id", evaluacionesController.deleteEvaluacion);

module.exports = router;
