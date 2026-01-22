const { getConnection, sql } = require("../database/database.cjs");

// GET ALL
const getEvaluaciones = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.evaluaciones");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// GET ONE
const getOneEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "SELECT * FROM vacaciones_sypris.evaluaciones WHERE id_evaluacion = @id",
      );
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ADD
const addEvaluacion = async (req, res) => {
  try {
    const {
      id_empleado,
      periodo,
      fecha_creacion,
      estatus,
      calificacion_final,
      ultima_edicion,
    } = req.body;

    if (!id_empleado || !periodo || !fecha_creacion || estatus === undefined) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("id_empleado", sql.Int, id_empleado)
      .input("periodo", sql.Int, periodo)
      .input("fecha_creacion", sql.Date, fecha_creacion)
      .input("estatus", sql.Int, estatus)
      .input("calificacion_final", sql.Int, calificacion_final)
      .input("ultima_edicion", sql.Date, ultima_edicion).query(`
        INSERT INTO vacaciones_sypris.evaluaciones
        (id_empleado, periodo, fecha_creacion, estatus, calificacion_final, ultima_edicion)
        VALUES (@id_empleado, @periodo, @fecha_creacion, @estatus, @calificacion_final, @ultima_edicion)
      `);

    res.json({ message: "Evaluación creada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// UPDATE
const updateEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus, calificacion_final, ultima_edicion } = req.body;

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("estatus", sql.Int, estatus)
      .input("calificacion_final", sql.Int, calificacion_final)
      .input("ultima_edicion", sql.Date, ultima_edicion).query(`
        UPDATE vacaciones_sypris.evaluaciones
        SET estatus = @estatus,
            calificacion_final = @calificacion_final,
            ultima_edicion = @ultima_edicion
        WHERE id_evaluacion = @id
      `);

    res.json({ message: "Evaluación actualizada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// DELETE
const deleteEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "DELETE FROM vacaciones_sypris.evaluaciones WHERE id_evaluacion = @id",
      );

    res.json({ message: "Evaluación eliminada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  methods: {
    getEvaluaciones,
    getOneEvaluacion,
    addEvaluacion,
    updateEvaluacion,
    deleteEvaluacion,
  },
};
