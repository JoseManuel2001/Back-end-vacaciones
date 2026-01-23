const { getConnection, sql } = require("../database/database.cjs");

// GET BY EVALUACION
const getObjetivosByEvaluacion = async (req, res) => {
  try {
    const { id_evaluacion } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_evaluacion", sql.Int, id_evaluacion).query(`
        SELECT * 
        FROM vacaciones_sypris.evaluacion_objetivos
        WHERE id_evaluacion = @id_evaluacion
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ADD
const addObjetivo = async (req, res) => {
  try {
    const {
      id_evaluacion,
      objetivo,
      comentario,
      calificacion,
      evaluador,
      tipo_evaluador,
    } = req.body;

    if (!id_evaluacion || !objetivo || !evaluador || !tipo_evaluador) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .input("objetivo", sql.VarChar, objetivo)
      .input("comentario", sql.VarChar, comentario)
      .input("calificacion", sql.Int, calificacion)
      .input("evaluador", sql.Int, evaluador)
      .input("tipo_evaluador", sql.VarChar, tipo_evaluador).query(`
        INSERT INTO vacaciones_sypris.evaluacion_objetivos
        (id_evaluacion, objetivo, comentario, calificacion, evaluador, tipo_evaluador)
        VALUES (@id_evaluacion, @objetivo, @comentario, @calificacion, @evaluador, @tipo_evaluador)
      `);

    res.json({ message: "Objetivo agregado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// UPDATE
const updateObjetivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario, calificacion } = req.body;

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("comentario", sql.VarChar, comentario)
      .input("calificacion", sql.Int, calificacion).query(`
        UPDATE vacaciones_sypris.evaluacion_objetivos
        SET comentario = @comentario,
            calificacion = @calificacion
        WHERE id_ev_objetivo = @id
      `);

    res.json({ message: "Objetivo actualizado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// DELETE
const deleteObjetivo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "DELETE FROM vacaciones_sypris.evaluacion_objetivos WHERE id_ev_objetivo = @id",
      );

    res.json({ message: "Objetivo eliminado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  methods: {
    getObjetivosByEvaluacion,
    addObjetivo,
    updateObjetivo,
    deleteObjetivo,
  },
};
