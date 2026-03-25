const { getConnection } = require("../database/database.cjs");

const getFormatoVacaciones = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT 
          us.trabajador, 
          us.rol, 
          em.nombre, 
          em.centro_costos,
          em.fecha_ingreso, 
          em.fecha_antiguedad,
          em.estatus,
          em.supervisor,
          us.id_user
        FROM vacaciones_sypris.usuario us
        INNER JOIN vacaciones_sypris.empleado em ON us.trabajador = em.trabajador
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const guardarVacaciones = async (req, res) => {
  const { empleados } = req.body;

  if (!empleados || !Array.isArray(empleados)) {
    return res.status(400).json({ message: "Formato inválido de empleados" });
  }

  const pool = await getConnection();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

      const formatearFecha = (fecha) => {
        const f = new Date(fecha);
        const dia = String(f.getDate()).padStart(2, "0");
        const mes = String(f.getMonth() + 1).padStart(2, "0");
        const anio = f.getFullYear();
        return `${dia}/${mes}/${anio}`;
      };
for (const empleado of empleados) {
  let {
    nomina_empleado,
    dias_solicitados,
    fecha_inicio,
    fecha_termino,
    detalle_dias,
  } = empleado;

  // ✅ convertir detalle_dias
  if (detalle_dias) {
    detalle_dias = detalle_dias
      .split(",")
      .map(fecha => formatearFecha(fecha))
      .join(",");
  }

  await transaction.request()
    .input("nomina_empleado", nomina_empleado)
    .input("dias_solicitados", dias_solicitados)
    .input("fecha_inicio", fecha_inicio)
    .input("fecha_termino", fecha_termino)
    .input("detalle_dias", detalle_dias)
        .query(`
          INSERT INTO vacaciones_sypris.programacion_vacaciones (
            nomina_empleado,
            dias_solicitados,
            fecha_inicio,
            fecha_termino,
            estado_supervisor,
            estatus_rh,
            comentario_supervisor,
            comentario_rh,
            fecha_creacion,
            detalle_dias
          )
          VALUES (
            @nomina_empleado,
            @dias_solicitados,
            @fecha_inicio,
            @fecha_termino,
            1,
            0,
            '',
            '',
            CONVERT(VARCHAR(10), GETDATE(), 103),
            @detalle_dias
          )
        `);

      // 🔥 SELECT saldos (nuevo request)
      const saldosResult = await transaction.request()
        .input("nominaSaldo", nomina_empleado)
        .query(`
          SELECT *
          FROM vacaciones_sypris.saldo
          WHERE nomina = @nominaSaldo
          ORDER BY ano ASC
        `);

      let diasRestantes = Number(dias_solicitados);

      for (const saldo of saldosResult.recordset) {
        const disponibles = saldo.dias_totales - saldo.dias_tentativos;

        if (disponibles > 0 && diasRestantes > 0) {
          const usarDias = Math.min(disponibles, diasRestantes);
          diasRestantes -= usarDias;

          // 🔥 UPDATE (nuevo request SIEMPRE)
          await transaction.request()
            .input("idSaldo", saldo.id)
            .input("dias_tentativos", saldo.dias_tentativos + usarDias)
            .query(`
              UPDATE vacaciones_sypris.saldo
              SET dias_tentativos = @dias_tentativos
              WHERE id = @idSaldo
            `);
        }

        if (diasRestantes <= 0) break;
      }
    }

    await transaction.commit();

    res.json({
      message: "Vacaciones guardadas correctamente",
      total: empleados.length,
    });

  } catch (error) {
    await transaction.rollback();

    console.error(error);

    res.status(500).json({
      message: "Error al guardar vacaciones",
      error: error.message,
    });
  }
};

module.exports = {
  methods: {
    getFormatoVacaciones,
    guardarVacaciones

  },
};
