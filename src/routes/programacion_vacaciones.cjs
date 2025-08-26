const { Router } = require("express");
const programacion_VacController =
  require("../controllers/programacion_vacaciones.controller.cjs").methods;

const router = Router();

//GET
router.get("/", programacion_VacController.getProgVac);
router.get("/:id", programacion_VacController.getOneProgVac);

//POST
router.post("/", programacion_VacController.addProgVac);

//PUT
router.put("/:id", programacion_VacController.updateProgVac);

//DELETE
router.delete("/:id", programacion_VacController.deleteProgVac);

module.exports = router;
