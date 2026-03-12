const { Router } = require("express");
const evaluacionesController = require("../controllers/evaluaciones.controller.cjs").methods;
const validarEvaluacionesMiddleware = require('../middlewares/periodoEvaluacion_activo.middleware.cjs').methods;

const router = Router();

// GET ALL
router.get("/", evaluacionesController.getEvaluaciones);
router.get("/data", evaluacionesController.getEvaluacionesData);
router.get("/activas/:periodo", evaluacionesController.getEvaluacionesActivas);
router.get("/data/:id", evaluacionesController.getEvaluacionDataporID);


// GET ONE
router.get("/:id", evaluacionesController.getOneEvaluacion);

// POST
router.post("/", validarEvaluacionesMiddleware.validarOperacionEvaluacion, evaluacionesController.addEvaluacion);

// PUT
router.put("/:id", validarEvaluacionesMiddleware.validarOperacionEvaluacion, evaluacionesController.updateEvaluacion);
router.put("/firmar/:id", validarEvaluacionesMiddleware.validarOperacionEvaluacion, evaluacionesController.firmarEvaluacion);

// DELETE
router.delete("/:id", validarEvaluacionesMiddleware.validarOperacionEvaluacion, evaluacionesController.deleteEvaluacion);

module.exports = router;
