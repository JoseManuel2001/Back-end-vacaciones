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

module.exports = {
  methods: {
    getFormatoVacaciones,
  },
};
