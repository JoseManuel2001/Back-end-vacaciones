const { getConnection, sql } = require("../database/database.cjs");

const getCalificacionCaracteristicas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .query("SELECT * FROM vacaciones_sypris.calificacion_caracteristica;");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneCalificacionCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Calificación Característica:", id);
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT 
        cc.id_calificacion,
        cc.id_caracteristica,
        cc.id_evaluacion,
        cc.id_empleado,
        cc.calificacion,
        cc.evaluador,
        cc.tipo_evaluador,
        cc.fecha_evaluacion,
        c.nombre
        FROM vacaciones_sypris.calificacion_caracteristica cc
        INNER JOIN vacaciones_sypris.caracteristica c ON cc.id_caracteristica = c.id_caracteristica
        WHERE cc.id_evaluacion = @id`);

    res.json(result.recordset);
    console.log(result.recordset);
  } catch (error) {
    console.error("Error en getOneCalificacionCaracteristica:", error);
    res.status(500).send(error.message);
  }
};

const addCalificacionCaracteristica = async (req, res) => {
  try {
    const { id_caracteristica, id_evaluacion, id_empleado, calificacion, evaluador, tipo_evaluador, fecha_evaluacion } = req.body;

    if (!id_caracteristica || !id_evaluacion || !id_empleado || !calificacion || !evaluador || !tipo_evaluador || !fecha_evaluacion) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const pool = await getConnection();
    await pool.request()
      .input("id_caracteristica", sql.Int, id_caracteristica)
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .input("id_empleado", sql.Int, id_empleado)
      .input("calificacion", sql.Int, calificacion)
      .input("evaluador", sql.NVarChar, evaluador)
      .input("tipo_evaluador", sql.NVarChar, tipo_evaluador)
      .input("fecha_evaluacion", sql.Date, fecha_evaluacion)
      .query(`
        INSERT INTO vacaciones_sypris.calificacion_caracteristica
        (id_caracteristica, id_evaluacion, id_empleado, calificacion, evaluador, tipo_evaluador, fecha_evaluacion)
        VALUES (@id_caracteristica, @id_evaluacion, @id_empleado, @calificacion, @evaluador, @tipo_evaluador, @fecha_evaluacion)
      `);

    res.json({ message: "Calificación Característica creada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteCalificacionCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM vacaciones_sypris.calificacion_caracteristica WHERE id = @id");
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateCalificacionCaracteristica = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Calificación Característica a actualizar:", id);
    const { id_caracteristica, id_evaluacion, id_empleado, calificacion, evaluador, tipo_evaluador, fecha_evaluacion } = req.body;
    console.log("Datos recibidos para actualizar:", req.body);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("id_caracteristica", sql.Int, id_caracteristica)
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .input("id_empleado", sql.Int, id_empleado)
      .input("calificacion", sql.Int, calificacion)
      .input("evaluador", sql.NVarChar, evaluador)
      .input("tipo_evaluador", sql.NVarChar, tipo_evaluador)
      .input("fecha_evaluacion", sql.Date, fecha_evaluacion)
      .query(`
    UPDATE vacaciones_sypris.calificacion_caracteristica
    SET 
      id_caracteristica = @id_caracteristica,
      id_evaluacion = @id_evaluacion,
      id_empleado = @id_empleado,
      calificacion = @calificacion,
      evaluador = @evaluador,
      tipo_evaluador = @tipo_evaluador,
      fecha_evaluacion = @fecha_evaluacion
    WHERE id = @id
  `);
    res.json({
      message: "Calificación Característica actualizada",
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
    getCalificacionCaracteristicas,
    getOneCalificacionCaracteristica,
    addCalificacionCaracteristica,
    updateCalificacionCaracteristica,
    deleteCalificacionCaracteristica,
  },
};
