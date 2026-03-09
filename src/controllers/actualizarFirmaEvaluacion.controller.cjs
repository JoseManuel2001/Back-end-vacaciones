const { get } = require("axios");
const { getConnection, sql } = require("../database/database.cjs");

const firmarEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    await pool.request().input("id", sql.Int, id).query(`
        UPDATE vacaciones_sypris.evaluaciones
        SET fecha_firma = GETDATE()
        WHERE id_evaluacion = @id
      `);
    res.json({ message: "Evaluación firmada" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  methods: {
    firmarEvaluacion,
  }
};
