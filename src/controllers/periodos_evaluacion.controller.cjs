const { getConnection, sql } = require("../database/database.cjs");

// GET ALL
const getPeriodos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.periodos_evaluacion");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// GET ONE
const getOnePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "SELECT * FROM vacaciones_sypris.periodos_evaluacion WHERE id_periodo = @id",
      );
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ADD
const addPeriodo = async (req, res) => {
  try {
    const { nombre_periodo, fecha_inicio, fecha_fin, creado_por } = req.body;

    if (!nombre_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("nombre_periodo", sql.VarChar, nombre_periodo)
      .input("fecha_inicio", sql.Date, fecha_inicio)
      .input("fecha_fin", sql.Date, fecha_fin)
      .input("creado_por", sql.VarChar, creado_por).query(`
        INSERT INTO vacaciones_sypris.periodos_evaluacion
        (nombre_periodo, fecha_inicio, fecha_fin, creado_por)
        VALUES (@nombre_periodo, @fecha_inicio, @fecha_fin, @creado_por)
      `);

    res.json({ message: "Periodo creado correctamente" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// UPDATE
const updatePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_periodo, fecha_inicio, fecha_fin, creado_por } = req.body;

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre_periodo", sql.VarChar, nombre_periodo)
      .input("fecha_inicio", sql.Date, fecha_inicio)
      .input("fecha_fin", sql.Date, fecha_fin)
      .input("creado_por", sql.VarChar, creado_por).query(`
        UPDATE vacaciones_sypris.periodos_evaluacion
        SET nombre_periodo = @nombre_periodo,
            fecha_inicio = @fecha_inicio,
            fecha_fin = @fecha_fin,
            creado_por = @creado_por
        WHERE id_periodo = @id
      `);

    res.json({ message: "Periodo actualizado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// DELETE
const deletePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "DELETE FROM vacaciones_sypris.periodos_evaluacion WHERE id_periodo = @id",
      );

    res.json({ message: "Periodo eliminado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getPeriodoActivo = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(`
            SELECT TOP 1
                id_periodo,
                nombre_periodo,
                fecha_inicio,
                fecha_fin
            FROM vacaciones_sypris.periodos_evaluacion
            WHERE CAST(GETDATE() AS DATE) 
                  BETWEEN fecha_inicio AND fecha_fin
            ORDER BY fecha_inicio DESC
        `)

    if (result.recordset.length === 0) {
      return res.json({
        activo: false
      })
    }

    const periodo = result.recordset[0]

    res.json({
      activo: true,
      ...periodo
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = {
  methods: {
    getPeriodos,
    getOnePeriodo,
    addPeriodo,
    updatePeriodo,
    deletePeriodo,
    getPeriodoActivo
  },
};
