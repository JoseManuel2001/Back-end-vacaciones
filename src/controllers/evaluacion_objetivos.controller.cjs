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
        FROM vacaciones_sypris.objetivo_evaluaciones
        WHERE id_evaluacion = @id_evaluacion
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getObjetivosCalificadosByEvaluacion = async (req, res) => {
  try {
    const { id_evaluacion } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_evaluacion", sql.Int, id_evaluacion).query(`
        SELECT em.nombre, em.nomina, o.id_objetivo, o.objetivo, o.periodo, co.id_calificacion, co.calificacion, co.comentario, co.evaluador, co.tipo_evaluador, e.nombre AS id_empleado_evaluado
        FROM vacaciones_sypris.objetivo_evaluaciones o
        JOIN vacaciones_sypris.calificaciones_objetivo co ON co.id_objetivo = o.id_objetivo
        JOIN vacaciones_sypris.empleado em ON em.trabajador = o.id_empleado
        JOIN vacaciones_sypris.empleado e ON e.trabajador = o.id_empleado_evaluado
        WHERE o.id_evaluacion = @id_evaluacion
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
        INSERT INTO vacaciones_sypris.objetivo_evaluaciones
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
        UPDATE vacaciones_sypris.objetivo_evaluaciones
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
        "DELETE FROM vacaciones_sypris.objetivo_evaluaciones WHERE id_ev_objetivo = @id",
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
