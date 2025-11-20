const { getConnection, sql } = require("../database/database.cjs");
const jwt = require("jsonwebtoken");

const postTokenUsuario = async (req, res) => {
  try {
    const { trabajador, password } = req.body;
    console.log("Datos recibidos:", req.body);

    if (!trabajador || !password) {
      return res.status(400).json({ message: "Bad Request. llena bien los datos" });
    }

    const pool = await getConnection();
    const result = await pool
      .request() 
      .input("trabajador", sql.NVarChar, trabajador)
      .input("password", sql.NVarChar, password)
      .query(`
        SELECT * FROM vacaciones_sypris.usuario 
        WHERE trabajador = @trabajador AND password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = result.recordset[0];
    const id_user = user.id_user;
    console.log("ID de usuario:", id_user);
    const token = jwt.sign({ no_nomina: user.trabajador, nombre: user.nombre, id_user: id_user }, "Stack", {
      expiresIn: "10s",
    });
    console.log("Token generado:", token);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error en postTokenUsuario:", error);
    return res.status(500).send(error.message);
  }
};

module.exports = {
  methods: {
    postTokenUsuario,
  },
};
