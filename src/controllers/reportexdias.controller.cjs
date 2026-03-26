const { getConnection, sql } = require("../database/database.cjs");

const getReportexdia = async (req, res) => {
  const {tipoEmpleado} = req.params;

  try {
    const pool = await getConnection();

    const query = `
      SELECT 
          emp.trabajador,
          emp.nombre,
          emp.centro_costos,
          emp.tipo,
          pv.detalle_dias AS fecha
      FROM vacaciones_sypris.programacion_vacaciones pv
      INNER JOIN vacaciones_sypris.empleado emp
          ON LTRIM(RTRIM(emp.trabajador)) = LTRIM(RTRIM(pv.nomina_empleado))
          WHERE PV.estatus_rh = '1'
          ${tipoEmpleado == "Todos" ? "" : "AND emp.tipo = @tipoEmpleado"}
      ORDER BY emp.nombre
    `;

    const result = await pool.request()
      .input("tipoEmpleado", tipoEmpleado)
      .query(query);

    return res.status(200).json({
      ok: true,
      total: result.recordset.length,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error en reporte por día:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener el reporte",
      error: error.message,
    });
  }
};

module.exports = {
  methods: {
    getReportexdia,
  },
};
