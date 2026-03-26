const { Router } = require("express");
const reportexdiaController =
  require("../controllers/reportexdias.controller.cjs").methods;

const router = Router();

//GET
router.get("/reportes", reportexdiaController.getReportexdia);
router.get("/reportes/:tipoEmpleado", reportexdiaController.getReportexdia);

module.exports = router;