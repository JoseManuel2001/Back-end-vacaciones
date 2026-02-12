const { Router } = require("express");
const empleadoController =
  require("../controllers/empleado.controller.cjs").methods;

const router = Router();

//GET
router.get("/", empleadoController.getEmpleado);
router.get("/:trabajador", empleadoController.getOneEmpleado);

//POST
router.post("/", empleadoController.addEmpleado);

//PUT
router.put("/:id", empleadoController.updateEmpleado);

//DELETE
router.delete("/:id", empleadoController.deleteEmpleado);

module.exports = router;
