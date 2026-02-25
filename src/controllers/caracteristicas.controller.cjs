const { getConnection, sql } = require("../database/database.cjs");

const getCaracteristicas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.caracteristica");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Característica:", id);
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "SELECT * FROM vacaciones_sypris.caracteristica WHERE id = @id",
      );

    res.json(result.recordset);
    console.log(result.recordset);
  } catch (error) {
    console.error("Error en getOneCaracteristica:", error);
    res.status(500).send(error.message);
  }
};

const addCaracteristica = async (req, res) => {
  try {
    const {
      nombre,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .query(`
        INSERT INTO vacaciones_sypris.caracteristica
        (nombre)
        VALUES (@nombre)
      `);

    res.json({ message: "Característica creada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const deleteCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "DELETE FROM vacaciones_sypris.caracteristica WHERE id = @id",
      );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Característica a actualizar:", id);
    const {
      nombre,
    } = req.body;
    console.log("Datos recibidos para actualizar:", req.body);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", sql.VarChar, nombre).query(`
    UPDATE vacaciones_sypris.caracteristica
    SET 
      nombre = @nombre
    WHERE id = @id
  `);
    res.json({
      message: "Característica actualizada",
      data: req.body,
      result: result,
    });
    console.log(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  methods: {
    getCaracteristicas,
    getOneCaracteristica,
    addCaracteristica,
    updateCaracteristica,
    deleteCaracteristica,
  },
};
