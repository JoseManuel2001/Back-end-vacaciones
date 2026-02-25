const { Router } = require("express");
const evaluacionesController = require("../controllers/evaluaciones.controller.cjs").methods;
const { validarOperacionEvaluacion } = require('../middlewares/periodoEvaluacion_activo.middleware.cjs')

const router = Router();

// GET ALL
router.get("/", evaluacionesController.getEvaluaciones);
router.get("/data", evaluacionesController.getEvaluacionesData);
router.get("/activas", evaluacionesController.getEvaluacionesActivas);
router.get("/data/:id", evaluacionesController.getEvaluacionDataporID);

// GET ONE
router.get("/:id", evaluacionesController.getOneEvaluacion);

// POST
router.post("/", validarOperacionEvaluacion, evaluacionesController.addEvaluacion);

// PUT
router.put("/:id", validarOperacionEvaluacion, evaluacionesController.updateEvaluacion);

// DELETE
router.delete("/:id", validarOperacionEvaluacion, evaluacionesController.deleteEvaluacion);

module.exports = router;
