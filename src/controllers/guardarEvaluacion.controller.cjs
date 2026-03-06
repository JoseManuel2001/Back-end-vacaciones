const { getConnection, sql } = require("../database/database.cjs");

const guardarEvaluacion = async (req, res) => {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);

  try {
    const {
      id_evaluacion,
      estatus,
      calificacion_final,
      comentario_general,
      objetivos,
      calificacion_caracteristicas,
      objetivos_eliminados,
    } = req.body;

    if (!id_evaluacion || estatus === undefined) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    await transaction.begin();

    // 🔹 1️⃣ Actualizar evaluación
    await new sql.Request(transaction)
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .input("estatus", sql.Int, estatus)
      .input("calificacion_final", sql.Int, calificacion_final)
      .input("ultima_edicion", sql.DateTime, new Date())
      .input("comentario_general", sql.NVarChar(50), comentario_general)
      .query(`
        UPDATE vacaciones_sypris.evaluaciones
        SET estatus = @estatus,
            calificacion_final = @calificacion_final,
            ultima_edicion = @ultima_edicion,
            comentario_general = @comentario_general
        WHERE id_evaluacion = @id_evaluacion
      `);

    // 🔹 2️⃣ UPSERT objetivo (sin usar id_objetivo)
   if (objetivos?.length) {
  for (const obj of objetivos) {

    // 🔹 Insertar o actualizar objetivo y obtener ID real
    const resultObjetivo = await new sql.Request(transaction)
      .input("id_objetivo", sql.Int, obj.id_objetivo || 0)
      .input("id_evaluacion", sql.Int, id_evaluacion)
      .input("objetivo", sql.VarChar(250), obj.objetivo)
      .input("id_empleado", sql.NVarChar(50), obj.id_empleado)
      .query(`
        DECLARE @nuevoId TABLE (id_objetivo INT);

        MERGE vacaciones_sypris.objetivo_evaluaciones AS target
        USING (SELECT @id_objetivo AS id_objetivo) AS source
        ON target.id_objetivo = source.id_objetivo

        WHEN MATCHED THEN
          UPDATE SET objetivo = @objetivo

        WHEN NOT MATCHED THEN
          INSERT (id_evaluacion, objetivo, id_empleado)
          VALUES (@id_evaluacion, @objetivo, @id_empleado)

        OUTPUT INSERTED.id_objetivo INTO @nuevoId;

        SELECT id_objetivo FROM @nuevoId;
      `);

    const idObjetivoReal = resultObjetivo.recordset[0].id_objetivo;

    // 🔹 Si viene calificación dentro del objetivo
    if (obj.calificacion) {
      await new sql.Request(transaction)
        .input("id_calificacion", sql.Int, obj.calificacion.id_calificacion || 0)
        .input("id_objetivo", sql.Int, idObjetivoReal)
        .input("calificacion", sql.Int, obj.calificacion.calificacion)
        .input("comentario", sql.VarChar(100), obj.calificacion.comentario)
        .input("evaluador", sql.VarChar(100), obj.calificacion.evaluador)
        .input("tipo_evaluador", sql.VarChar(30), obj.calificacion.tipo_evaluador)
        .query(`
          MERGE vacaciones_sypris.calificacion_objetivo AS target
          USING (SELECT @id_calificacion AS id_calificacion) AS source
          ON target.id_calificacion = source.id_calificacion

          WHEN MATCHED THEN
            UPDATE SET
              calificacion = @calificacion,
              comentario = @comentario,
              evaluador = @evaluador,
              tipo_evaluador = @tipo_evaluador

          WHEN NOT MATCHED THEN
            INSERT (
              id_objetivo,
              calificacion,
              comentario,
              evaluador,
              tipo_evaluador
            )
            VALUES (
              @id_objetivo,
              @calificacion,
              @comentario,
              @evaluador,
              @tipo_evaluador
            );
        `);
    }
  }
}

    // 🔹 3️⃣ UPSERT calificación características
    if (calificacion_caracteristicas?.length) {
      for (const carac of calificacion_caracteristicas) {
        await new sql.Request(transaction)
        .input("id_calificacion", sql.Int, carac.id_calificacion)
          .input("id_caracteristica", sql.Int, carac.id_caracteristica)
          .input("id_evaluacion", sql.Int, id_evaluacion)
          .input("id_empleado", sql.NVarChar(50), carac.id_empleado)
          .input("calificacion", sql.Int, carac.calificacion)
          .input("evaluador", sql.VarChar(50), carac.evaluador)
          .input("tipo_evaluador", sql.VarChar(50), carac.tipo_evaluador)
          .query(`
            MERGE vacaciones_sypris.calificacion_caracteristica AS target
            USING (
              SELECT 
                @id_calificacion AS id_calificacion
            ) AS source
            ON target.id_calificacion = source.id_calificacion

            WHEN MATCHED THEN
              UPDATE SET
                id_empleado = @id_empleado,
                calificacion = @calificacion,
                evaluador = @evaluador,
                tipo_evaluador = @tipo_evaluador

            WHEN NOT MATCHED THEN
              INSERT (
                id_caracteristica,
                id_evaluacion,
                id_empleado,
                calificacion,
                evaluador,
                tipo_evaluador
              )
              VALUES (
                @id_caracteristica,
                @id_evaluacion,
                @id_empleado,
                @calificacion,
                @evaluador,
                @tipo_evaluador
              );
          `);
      }
    }

    // 🔹 4️⃣ Eliminar objetivos eliminados
    if (objetivos_eliminados?.length) {
      for (const id of objetivos_eliminados) {
        await new sql.Request(transaction)
          .input("id_objetivo", sql.Int, id)
          .query(`
            DELETE FROM vacaciones_sypris.objetivo_evaluaciones
            WHERE id_objetivo = @id_objetivo
          `);
      }
    }

    await transaction.commit();

    res.json({ message: "Evaluación guardada correctamente" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  methods: { guardarEvaluacion },
};
