const { getConnection, sql } = require("../database/database.cjs");
const jwt = require("jsonwebtoken");

const postTokenUsuario = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    console.log("Datos recibidos:", req.body);

    if (!user_name || !password) {
      return res.status(400).json({ message: "Bad Request. llena bien los datos" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("user_name", sql.NVarChar, user_name)
      .input("password", sql.NVarChar, password)
      .query(`
        SELECT * FROM vacaciones_sypris.usuario 
        WHERE user_name = @user_name AND password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = result.recordset[0];
    const id_user = user.id_user;
    console.log("ID de usuario:", id_user);
    const token = jwt.sign({ user_name: user.user_name, no_nomina: user.trabajador, id_user: id_user }, "Stack", {
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
