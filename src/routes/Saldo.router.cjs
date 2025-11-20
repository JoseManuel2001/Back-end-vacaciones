const { Router } = require("express");
const saldoController =
  require("../controllers/saldo.controller.cjs").methods;

const router = Router();

//GET
router.get("/", saldoController.getSaldo);
router.get("/:id", saldoController.getOneSaldo);
router.get("/reporte/saldos", saldoController.getReporteSaldos);

//POST
router.post("/", saldoController.addSaldo);

//PUT
router.put("/:id", saldoController.updateSaldo);

//DELETE
router.delete("/:id", saldoController.deleteSaldo);

module.exports = router;