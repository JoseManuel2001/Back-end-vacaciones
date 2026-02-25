const { Router } = require("express");
const calificacionObjetivos =
  require("../controllers/calificacion_objetivos.controller.cjs").methods;

const router = Router();

//GET
router.get("/", calificacionObjetivos.getCalificacionObjetivo);
router.get("/evaluacion/:id", calificacionObjetivos.getOneCalificacionObjetivo);
router.get("/tipo_evaluador/:id", calificacionObjetivos.getCalificacionByid_tipo_evaluador);

//POST
router.post("/", calificacionObjetivos.addCalificacionObjetivo);

//PUT
router.put("/:id", calificacionObjetivos.updateCalificacionObjetivo);

//DELETE
router.delete("/:id", calificacionObjetivos.deleteCalificacionObjetivo);

module.exports = router;
