const { getConnection, sql } = require("../database/database.cjs");

const getProgVac = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.programacion_vacaciones");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneProgVac = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "SELECT * FROM vacaciones_sypris.programacion_vacaciones WHERE id = @id"
      );

    res.json(result.recordset);
    console.log(result.recordset);
  } catch (error) {
    console.error("Error en getOneVacaciones:", error);
    res.status(500).send(error.message);
  }
};

const addProgVac = async (req, res) => {
  try {
    const {
      nomina_empleado,
      dias_solicitados,
      fecha_inicio,
      fecha_termino,
      estado_supervisor,
      comentario_supervisor,
      comentario_rh,
      fecha_creacion,
      estatus_rh,
      nombre_aprobado_rh,
      nombre_aprobado_sup
    } = req.body;

    if (
      nomina_empleado === undefined ||
      dias_solicitados === undefined ||
      fecha_inicio === undefined ||
      fecha_termino === undefined ||
      estado_supervisor === undefined ||
      fecha_creacion === undefined ||
      estatus_rh === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Bad Request. llena bien los datos" });
    }
console.log("Datos recibidos:", {
      nomina_empleado,
      dias_solicitados,
      fecha_inicio,
      fecha_termino,
      estado_supervisor,
      comentario_supervisor,
      comentario_rh,
      fecha_creacion,
      estatus_rh,
    });
    const pool = await getConnection();
    await pool
      .request()
      .input("nomina_empleado", nomina_empleado)
      .input("dias_solicitados", dias_solicitados)
      .input("fecha_inicio", fecha_inicio)
      .input("fecha_termino", fecha_termino)
      .input("estado_supervisor", estado_supervisor)
      .input("comentario_supervisor", comentario_supervisor)
      .input("comentario_rh", comentario_rh)
      .input("fecha_creacion", fecha_creacion)
      .input("nombre_aprobado_rh", nombre_aprobado_rh)
      .input("nombre_aprobado_sup", nombre_aprobado_sup)
      .input("estatus_rh", estatus_rh).query(`
    INSERT INTO vacaciones_sypris.programacion_vacaciones
    (nomina_empleado, dias_solicitados, fecha_inicio, fecha_termino, estado_supervisor, comentario_supervisor, comentario_rh, fecha_creacion, estatus_rh)
    VALUES
    (@nomina_empleado, @dias_solicitados, @fecha_inicio, @fecha_termino, @estado_supervisor, @comentario_supervisor, @comentario_rh, @fecha_creacion, @estatus_rh)
  `);

    res.json({ message: "Vacacion creada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteProgVac = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "DELETE FROM vacaciones_sypris.programacion_vacaciones WHERE id = @id"
      );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProgVac = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nomina_empleado,
      dias_solicitados,
      fecha_inicio,
      fecha_termino,
      estado_supervisor,
      comentario_supervisor,
      comentario_rh,
      fecha_creacion,
      estatus_rh,
      nombre_aprobado_rh,
      nombre_aprobado_sup
    } = req.body;
    console.log("Datos para actualizar:", req.body);

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("nomina_empleado", sql.NVarChar, nomina_empleado)
      .input("dias_solicitados", sql.Int, dias_solicitados)
      .input("fecha_inicio", sql.NVarChar, fecha_inicio)
      .input("fecha_termino", sql.NVarChar, fecha_termino)
      .input("estado_supervisor", sql.NVarChar, estado_supervisor)
      .input("comentario_supervisor", sql.NVarChar, comentario_supervisor)
      .input("comentario_rh", sql.NVarChar, comentario_rh)
      .input("fecha_creacion", sql.NVarChar, fecha_creacion)
      .input("nombre_aprobado_rh", sql.NVarChar, nombre_aprobado_rh)
      .input("nombre_aprobado_sup", sql.NVarChar, nombre_aprobado_sup)
      .input("estatus_rh", sql.NVarChar, estatus_rh).query(`
        UPDATE vacaciones_sypris.programacion_vacaciones
        SET 
          nomina_empleado = @nomina_empleado,
          dias_solicitados = @dias_solicitados,
          fecha_inicio = @fecha_inicio,
          fecha_termino = @fecha_termino,
          estado_supervisor = @estado_supervisor,
          comentario_supervisor = @comentario_supervisor,
          comentario_rh = @comentario_rh,
          fecha_creacion = @fecha_creacion,
          estatus_rh = @estatus_rh,
          nombre_aprobado_rh = @nombre_aprobado_rh,
          nombre_aprobado_sup = @nombre_aprobado_sup
        WHERE id = @id
      `);

    res.json({ message: "Registro actualizado correctamente", result });
    console.log("BODY RECIBIDO:", req.body);
    console.log("ID RECIBIDO:", req.params.id);
  } catch (error) {
    console.error("Error en updateProgVac:", error.message);
    res.status(500).send("Error al actualizar la programación de vacaciones.");
  }
};

const updateProgVacBulk = async (req, res) => {
  try {
    const { registros } = req.body;

    if (!Array.isArray(registros) || registros.length === 0) {
      return res.status(400).json({ message: "No se recibieron registros para actualizar" });
    }

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    try {
      for (const dato of registros) {
        const request = new sql.Request(transaction);

        await request
          .input("id", sql.Int, dato.id)
          .input("nomina_empleado", sql.NVarChar, dato.nomina_empleado)
          .input("dias_solicitados", sql.Int, dato.dias_solicitados)
          .input("fecha_inicio", sql.NVarChar, dato.fecha_inicio)
          .input("fecha_termino", sql.NVarChar, dato.fecha_termino)
          .input("estado_supervisor", sql.NVarChar, dato.estado_supervisor)
          .input("comentario_supervisor", sql.NVarChar, dato.comentario_supervisor)
          .input("comentario_rh", sql.NVarChar, dato.comentario_rh)
          .input("fecha_creacion", sql.NVarChar, dato.fecha_creacion)
          .input("estatus_rh", sql.NVarChar, dato.estatus_rh)
          .input("nombre_aprobado_rh", sql.NVarChar, dato.nombre_aprobado_rh)
          .input("nombre_aprobado_sup", sql.NVarChar, dato.nombre_aprobado_sup)
          .query(`
            UPDATE vacaciones_sypris.programacion_vacaciones
            SET 
              nomina_empleado = @nomina_empleado,
              dias_solicitados = @dias_solicitados,
              fecha_inicio = @fecha_inicio,
              fecha_termino = @fecha_termino,
              estado_supervisor = @estado_supervisor,
              comentario_supervisor = @comentario_supervisor,
              comentario_rh = @comentario_rh,
              fecha_creacion = @fecha_creacion,
              estatus_rh = @estatus_rh,
              nombre_aprobado_rh = @nombre_aprobado_rh,
              nombre_aprobado_sup = @nombre_aprobado_sup
            WHERE id = @id
          `);
      }

      await transaction.commit();

      res.json({
        message: "Registros actualizados correctamente",
        total: registros.length
      });

    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  } catch (error) {
    console.error("Error en updateProgVacBulk:", error.message);
    res.status(500).send("Error al actualizar las programaciones de vacaciones.");
  }
};



module.exports = {
  methods: {
    getProgVac,
    getOneProgVac,
    addProgVac,
    deleteProgVac,
    updateProgVac,
    updateProgVacBulk,
  },
};
