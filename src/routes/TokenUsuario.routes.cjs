const { Router } = require("express");
const TokenUsuarioController =
  require("../controllers/TokenUsuario.controller.cjs").methods;

const router = Router();

//GET


//POST
router.post("/", TokenUsuarioController.postTokenUsuario);

//PUT


//DELETE


module.exports = router;
