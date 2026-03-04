const { Router } = require("express");
const guardarEvaluacion =
  require("../controllers/guardarEvaluacion.controller.cjs").methods;

const router = Router();

//POST
router.post("/", guardarEvaluacion.guardarEvaluacion);

module.exports = router;