const { getConnection, sql } = require("../database/database.cjs");

const getUsuario = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.usuario");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneUsuario = async (req, res) => {
  try {
    const { trabajador } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("trabajador", sql.Int, trabajador)
      .query(`SELECT * FROM vacaciones_sypris.usuario WHERE trabajador = @trabajador`);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addUsuario = async (req, res) => {
  try {
    const {
      password,
      rol,
      user_name,
      trabajador,
    } = req.body;

    if (
      password === undefined ||
      rol === undefined ||
      user_name === undefined ||
      trabajador === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Bad Request. llena bien los datos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("password", sql.NVarChar, password)
      .input("rol", sql.NVarChar, rol)
      .input("user_name", sql.NVarChar, user_name)
      .input("trabajador", sql.NVarChar, trabajador).query(`
    INSERT INTO vacaciones_sypris.usuario
    (password, rol, user_name, trabajador)
    VALUES
    (@password, @rol, @user_name, @trabajador)
  `);

    res.json({ message: "Usuario creado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.query(
      "DELETE FROM usuario WHERE id_user = ?",
      id
    );
    res.json(result);
    connection.release();
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getPassword = async (req, res) => {
  try {
    const { id_user } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_user", sql.Int, id_user)
      .query(
        `SELECT password FROM vacaciones_sypris.usuario WHERE id_user = @id_user`
      );
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_user, password, rol, user_name, no_nomina } = req.body;
    if (
        id_user === undefined ||
        password === undefined ||
        rol === undefined ||
        user_name === undefined ||
        no_nomina === undefined
    ) {
      res.status(400).json({ message: "Bad Request. llena bien los datos" });
    } else {
      const users = {
        id_user,
        password,
        rol,
        user_name,
        no_nomina,
      };
      const connection = await getConnection();
      const result = await connection.query(
        "UPDATE usuario SET ? WHERE id_user = ?",
        [users, id]
      );
      res.json(result);
      connection.release();
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, current_password } = req.body;
    console.log("password:", password, current_password);

    if (!password || !current_password) {
      return res
        .status(400)
        .json({ message: "Bad Request. Falta password o current_password" });
    }

    const pool = await getConnection();

    // 1) Traer la contraseña almacenada
    const { recordset } = await pool.request().input("id", sql.Int, Number(id))
      .query(`
        SELECT [password]
        FROM [vacaciones_sypris].[usuario]
        WHERE id_user = @id
      `);

    if (recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const stored = recordset[0].password ?? "";

    // 2) Validar la actual
    if (stored !== current_password) {
      return res
        .status(400)
        .json({ message: "La contraseña actual no coincide." });
    }

    // (Opcional) evitar que pongan la misma contraseña
    if (password === current_password) {
      return res
        .status(400)
        .json({
          message: "La nueva contraseña no puede ser igual a la actual.",
        });
    }

    // 3) Actualizar
    const result = await pool
      .request()
      .input("id", sql.Int, Number(id))
      .input("password", sql.NVarChar, password).query(`
        UPDATE [vacaciones_sypris].[usuario]
        SET [password] = @password
        WHERE id_user = @id
      `);

    if (!result.rowsAffected || result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json({ message: "Contraseña actualizada." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Error del servidor." });
  }
};



module.exports = {
  methods: {
    getUsuario,
    getOneUsuario,
    addUsuario,
    deleteUsuario,
    updateUsuario,
    updatePassword,
    getPassword,
  },
};
