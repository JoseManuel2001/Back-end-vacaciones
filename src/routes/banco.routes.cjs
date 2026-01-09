const { Router } = require("express");
const bancoController =
  require("../controllers/banco.controller.cjs").methods;

const router = Router();

//GET
router.get("/", bancoController.getBanco);
router.get("/:nomina", bancoController.getOneBanco);

//POST
router.post("/", bancoController.addBanco);

//PUT
router.put("/:nomina", bancoController.updateBanco);

//DELETE
router.delete("/:nomina", bancoController.deleteBanco);

module.exports = router;