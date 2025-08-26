const { Router } = require("express");
const tabla_gobiernoController =
  require("../controllers/tablaGobierno.controller.cjs").methods;

const router = Router();

//GET
router.get("/", tabla_gobiernoController.getTablaGobierno);
router.get("/:id", tabla_gobiernoController.getOneTablaGobierno);

//POST
router.post("/", tabla_gobiernoController.addTablaGobierno);

//PUT
router.put("/:id", tabla_gobiernoController.updateTablaGobierno);

//DELETE
router.delete("/:id", tabla_gobiernoController.deleteTablaGobierno);                                                                                                                                                                                                                                             

module.exports = router;