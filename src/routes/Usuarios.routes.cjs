const { Router } = require("express");
const usuarioController =
  require("../controllers/usuarios.controller.cjs").methods;

const router = Router();

//GET
router.get("/", usuarioController.getUsuario);
router.get("/:trabajador", usuarioController.getOneUsuario);
router.get("/password/:id_user", usuarioController.getPassword);

//POST
router.post("/", usuarioController.addUsuario);

//PUT
router.put("/:id", usuarioController.updateUsuario);
router.put("/password/:id", usuarioController.updatePassword);

//DELETE
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;