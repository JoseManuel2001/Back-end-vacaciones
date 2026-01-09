const { getConnection, sql } = require("../database/database.cjs");

const getBanco = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.banco");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addBanco = async (req, res) => {
  try {
    const { nomina, dias } = req.body;

    if (!nomina || dias === undefined) {
      return res.status(400).json({
        message: "Bad Request. Llena correctamente los datos",
      });
    }

    const pool = await getConnection();

    await pool
      .request()
      .input("nomina", sql.NVarChar, nomina)
      .input("dias", sql.Int, dias).query(`
        INSERT INTO vacaciones_sypris.banco (nomina, dias)
        VALUES (@nomina, @dias)
      `);

    res.status(201).json({
      message: "Banco agregado correctamente",
    });
  } catch (error) {
    console.error("Error en addBanco:", error);
    res.status(500).send(error.message);
  }
};


const deleteBanco = async (req, res) => {
  try {
    const { nomina } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nomina", sql.NVarChar, nomina)
      .query("DELETE FROM vacaciones_sypris.banco WHERE nomina = @nomina");
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneBanco = async (req, res) => {
  try {
    const { nomina } = req.params;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nomina", sql.NVarChar, nomina)
        .query(
            "SELECT * FROM vacaciones_sypris.banco WHERE nomina = @nomina"
        );

    res.json(result.recordset);
    console.log(result.recordset);
  } catch (error) {
    console.error("Error en getOneBanco:", error);
    res.status(500).send(error.message);
  }
};


const updateBanco = async (req, res) => {
  try {
    const { nomina } = req.params;
    const { dias } = req.body;

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("nomina", sql.NVarChar, nomina)
      .input("dias", sql.Int, dias)
      .query(`
        UPDATE vacaciones_sypris.banco
        SET 
          dias = @dias,
          fecha_actualizacion = GETDATE()
        WHERE nomina = @nomina
      `);

    res.json({
      message: "Banco actualizado correctamente",
      rowsAffected: result.rowsAffected
    });

  } catch (error) {
    console.error("Error en updateBanco:", error);
    res.status(500).send(error.message);
  }
};




module.exports = {
  methods: {
    getBanco,
    getOneBanco,
    updateBanco,
    addBanco,
    deleteBanco,
  },
};
