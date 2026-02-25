const { Router } = require("express");
const caracteristicaController =
  require("../controllers/caracteristicas.controller.cjs").methods;

const router = Router();

//GET
router.get("/", caracteristicaController.getCaracteristicas);
router.get("/:id", caracteristicaController.getOneCaracteristica);

//POST
router.post("/", caracteristicaController.addCaracteristica);

//PUT
router.put("/:id", caracteristicaController.updateCaracteristica);

//DELETE
router.delete("/:id", caracteristicaController.deleteCaracteristica);

module.exports = router;