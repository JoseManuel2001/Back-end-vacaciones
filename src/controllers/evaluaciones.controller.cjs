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

const getEvaluacionesData = async (req, res) => {
  try {
    const query = `SELECT ev.id_evaluacion,
                    ev.id_empleado AS trabajador,
                    pe.nombre_periodo AS periodo,
                    ev.fecha_creacion,
                    ev.estatus,
                    ev.calificacion_final,
                    ev.ultima_edicion,
                    emp.centro_costos,
                    emp.supervisor AS nomina_supervisor1,
                    emp.supervisor2 AS nomina_supervisor2,
                    emp.nombre,
                    emp2.nombre AS supervisor_nombre,
                    count(ob.id_objetivo) as objetivos
                  FROM vacaciones_sypris.evaluaciones ev
                  JOIN vacaciones_sypris.empleado emp 
                    ON emp.trabajador = ev.id_empleado
                  JOIN vacaciones_sypris.empleado emp2 
                    ON emp.supervisor = emp2.trabajador
                  LEFT JOIN vacaciones_sypris.objetivo_evaluaciones ob 
                    ON ob.id_evaluacion = ev.id_evaluacion
                  JOIN vacaciones_sypris.periodos_evaluacion pe
                    ON pe.id_periodo = ev.periodo
                  GROUP BY
                      ev.id_evaluacion,
                      ev.id_empleado,
                      pe.nombre_periodo,
                      ev.fecha_creacion,
                      ev.estatus,
                      ev.calificacion_final,
                      ev.ultima_edicion,
                      emp.centro_costos,
                      emp.supervisor,
                      emp.supervisor2,
                      emp.nombre,
                      emp2.nombre;`
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getEvaluacionesActivas = async (req, res) => {
  try {
    const query = `SELECT ev.id_evaluacion,
                    ev.id_empleado AS trabajador,
                    pe.nombre_periodo AS periodo,
                    ev.fecha_creacion,
                    ev.estatus,
                    ev.calificacion_final,
                    ev.ultima_edicion,
                    emp.centro_costos,
                    emp.supervisor AS nomina_supervisor1,
                    emp.supervisor2 AS nomina_supervisor2,
                    emp.nombre,
                    emp2.nombre AS supervisor_nombre,
                    count(ob.id_objetivo) as objetivos
                  FROM vacaciones_sypris.evaluaciones ev
                  JOIN vacaciones_sypris.empleado emp 
                    ON emp.trabajador = ev.id_empleado
                  JOIN vacaciones_sypris.empleado emp2 
                    ON emp.supervisor = emp2.trabajador
                  LEFT JOIN vacaciones_sypris.objetivo_evaluaciones ob 
                    ON ob.id_evaluacion = ev.id_evaluacion
                  JOIN vacaciones_sypris.periodos_evaluacion pe
                    ON pe.id_periodo = ev.periodo
                  WHERE ev.estatus != 3
                  GROUP BY
                      ev.id_evaluacion,
                      ev.id_empleado,
                      pe.nombre_periodo,
                      ev.fecha_creacion,
                      ev.estatus,
                      ev.calificacion_final,
                      ev.ultima_edicion,
                      emp.centro_costos,
                      emp.supervisor,
                      emp.supervisor2,
                      emp.nombre,
                      emp2.nombre;`
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
      .input("id_empleado", id_empleado)
      .input("periodo", periodo)
      .input("fecha_creacion", fecha_creacion)
      .input("estatus", estatus)
      .input("calificacion_final", calificacion_final)
      .input("ultima_edicion", ultima_edicion).query(`
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
    getEvaluacionesData,
    getEvaluacionesActivas
  },
};
