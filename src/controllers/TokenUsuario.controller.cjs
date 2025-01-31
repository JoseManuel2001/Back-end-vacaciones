const { getConnection } = require("../database/database.cjs");
const jwt = require("jsonwebtoken");

const postTokenUsuario = async (req, res) => {
  const { user_name, password } = req.body;
  const consulta = "SELECT * FROM usuario WHERE user_name = ? AND password = ?";

  try {
    const connection = await getConnection(); // Obtiene una conexión del pool
    const [rows] = await connection.query(consulta, [user_name, password]);
    connection.release(); // Libera la conexión de vuelta al pool

    if (rows.length > 0) {
      const token = jwt.sign({ user_name }, "Stack", { expiresIn: "3m" });
      return res.status(200).json({ token });
    } else {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  methods: {
    postTokenUsuario,
  },
};
