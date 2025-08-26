const { Router } = require("express");
const supervisorController =
  require("../controllers/supervisor.controller.cjs").methods;

const router = Router();

//GET
router.get("/", supervisorController.getSupervisor);

//POST

//PUT

//DELETE

module.exports = router;