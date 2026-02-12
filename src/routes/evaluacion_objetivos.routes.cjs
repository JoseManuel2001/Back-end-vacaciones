const { Router } = require("express");
const objetivosController = require("../controllers/evaluacion_objetivos.controller.cjs").methods;
const { validarOperacionEvaluacion } = require('../middlewares/periodoEvaluacion_activo.middleware.cjs')

const router = Router();

// GET BY EVALUACION
router.get( "/evaluacion/:id_evaluacion",objetivosController.getObjetivosByEvaluacion);

// POST
router.post("/", validarOperacionEvaluacion, objetivosController.addObjetivo);

// PUT
router.put("/:id", validarOperacionEvaluacion, objetivosController.updateObjetivo);

// DELETE
router.delete("/:id", validarOperacionEvaluacion, objetivosController.deleteObjetivo);

module.exports = router;
