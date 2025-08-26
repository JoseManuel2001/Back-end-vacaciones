const { get } = require("axios");
const { getConnection, sql } = require("../database/database.cjs");

// Obtener todas las afectaciones con detalles del proceso y catálogo
const getSupervisor = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT s.centro_costos, s.supervisor, empl.nombre FROM vacaciones_sypris.supervisor s JOIN vacaciones_sypris.empleado empl ON s.supervisor = empl.trabajador`);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request().input("id", sql.Int, id).query('SELECT * FROM vacaciones_sypris.supervisor WHERE id = @id');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addSupervisor = async (req, res) => {
  try {
    const { centro_costos, supervisor } = req.body;

    if (centro_costos === undefined || supervisor === undefined) {
      return res.status(400).json({ message: "Bad Request. llena bien los datos" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("centro_costos", sql.NVarChar, centro_costos)
      .input("supervisor", sql.NVarChar, supervisor)
      .query(
        "INSERT INTO vacaciones_sypris.supervisor (centro_costos, supervisor) VALUES (@centro_costos, @supervisor)"
      );

    res.json({ message: "Supervisor added successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }

};
module.exports = {
  methods: {
    getSupervisor,
    getOneSupervisor,
    addSupervisor,
  },
};
