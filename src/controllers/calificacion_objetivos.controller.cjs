const { getConnection, sql } = require("../database/database.cjs");

const getCalificacionObjetivo = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.calificacion_objetivo;");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneCalificacionObjetivo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Calificación Objetivo:", id);
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(
      `SELECT 
        co.id_calificacion,
        co.id_objetivo,
        co.calificacion,
        co.comentario,
        co.evaluador,
        co.tipo_evaluador,
        o.objetivo,
        o.id_evaluacion
        FROM vacaciones_sypris.calificacion_objetivo co
        INNER JOIN vacaciones_sypris.objetivo_evaluaciones o ON co.id_objetivo = o.id_objetivo
        WHERE o.id_evaluacion = @id`);

    res.json(result.recordset);
    console.log(result.recordset);
  } catch (error) {
    console.error("Error en getOneCalificacionObjetivo:", error);
    res.status(500).send(error.message);
  }
};

const getCalificacionByid_tipo_evaluador = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Calificación Objetivo por tipo de evaluador:", id);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.NVarChar, id)
      .query(`SELECT 
        co.id_calificacion,
        co.id_objetivo,
        co.calificacion,
        co.comentario,
        co.evaluador,
        co.tipo_evaluador,
        o.objetivo,
        o.id_evaluacion
        FROM vacaciones_sypris.calificacion_objetivo co
        INNER JOIN vacaciones_sypris.objetivo_evaluaciones o ON co.id_objetivo = o.id_objetivo
        WHERE co.tipo_evaluador = @id`);
    res.json(result.recordset);
    console.log(result.recordset);
  } catch (error) {
    console.error("Error en getCalificacionByid_tipo_evaluador:", error);
    res.status(500).send(error.message);
  }
};

const addCalificacionObjetivo = async (req, res) => {
  try {
    const {
      id_calificacion,
      id_objetivo,
      id_evaluacion,
      calificacion,
      comentario,
      evaluador,
      tipo_evaluador,
    } = req.body;

    if (
      !id_objetivo ||
      !id_evaluacion ||
      !calificacion ||
      !comentario ||
      !evaluador ||
      !tipo_evaluador
    ) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("id_calificacion", sql.Int, id_calificacion)
      .input("id_objetivo", sql.Int, id_objetivo)
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .input("calificacion", sql.Int, calificacion)
      .input("comentario", sql.NVarChar, comentario)
      .input("evaluador", sql.NVarChar, evaluador)
      .input("tipo_evaluador", sql.NVarChar, tipo_evaluador).query(`
        INSERT INTO vacaciones_sypris.calificacion_objetivo
        (id_calificacion, id_objetivo, id_evaluacion, calificacion, comentario, evaluador, tipo_evaluador)
        VALUES (@id_calificacion, @id_objetivo, @id_evaluacion, @calificacion, @comentario, @evaluador, @tipo_evaluador)
      `);

    res.json({ message: "Calificación Objetivo creada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteCalificacionObjetivo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "DELETE FROM vacaciones_sypris.calificacion_objetivo WHERE id_calificacion = @id",
      );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateCalificacionObjetivo = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Calificación Objetivo a actualizar:", id);
    const {
      id_objetivo,
      id_evaluacion,
      id_empleado,
      calificacion,
      comentario,
      evaluador,
      tipo_evaluador,
    } = req.body;
    console.log("Datos recibidos para actualizar:", req.body);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_calificacion", sql.Int, id)
      .input("id_objetivo", sql.Int, id_objetivo)
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .input("id_empleado", sql.Int, id_empleado)
      .input("calificacion", sql.Int, calificacion)
      .input("comentario", sql.NVarChar, comentario)
      .input("evaluador", sql.NVarChar, evaluador)
      .input("tipo_evaluador", sql.NVarChar, tipo_evaluador)
      .input("fecha_evaluacion", sql.Date, fecha_evaluacion).query(`
    UPDATE vacaciones_sypris.calificacion_objetivo
    SET 
      id_objetivo = @id_objetivo,
      id_evaluacion = @id_evaluacion,
      id_empleado = @id_empleado,
      calificacion = @calificacion,
      comentario = @comentario,
      evaluador = @evaluador,
      tipo_evaluador = @tipo_evaluador
    WHERE id_calificacion = @id_calificacion
  `);
    res.json({
      message: "Calificación Objetivo actualizada",
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
    getCalificacionObjetivo,
    getOneCalificacionObjetivo,
    getCalificacionByid_tipo_evaluador,
    addCalificacionObjetivo,
    updateCalificacionObjetivo,
    deleteCalificacionObjetivo,
  },
};
