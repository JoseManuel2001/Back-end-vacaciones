const { Router } = require("express");
const calificacionCaracteristicas =
  require("../controllers/calificacion_caracteristicas.controller.cjs").methods;

const router = Router();

//GET
router.get("/", calificacionCaracteristicas.getCalificacionCaracteristicas);
router.get("/:id", calificacionCaracteristicas.getOneCalificacionCaracteristica);
router.get("/id_evaluacion/:id", calificacionCaracteristicas.getCalificacionCractxid);
router.get("/calificaciones/all/:periodo", calificacionCaracteristicas.getCalificacionesByPeriod);

//POST
router.post("/", calificacionCaracteristicas.addCalificacionCaracteristica);

//PUT
router.put("/:id", calificacionCaracteristicas.updateCalificacionCaracteristica);

//DELETE
router.delete("/:id", calificacionCaracteristicas.deleteCalificacionCaracteristica);

module.exports = router;