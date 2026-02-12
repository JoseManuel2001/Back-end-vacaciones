const { Router } = require("express");
const periodosController = require("../controllers/periodos_evaluacion.controller.cjs").methods;

const router = Router();

// GET ALL
router.get("/", periodosController.getPeriodos);
router.get("/activo", periodosController.getPeriodoActivo)

// GET ONE
router.get("/:id", periodosController.getOnePeriodo);

// POST
router.post("/", periodosController.addPeriodo);

// PUT
router.put("/:id", periodosController.updatePeriodo);

// DELETE
router.delete("/:id", periodosController.deletePeriodo);

module.exports = router;
