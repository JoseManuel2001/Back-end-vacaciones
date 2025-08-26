const { getConnection, sql } = require("../database/database.cjs");

const getTablaGobierno = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.tabla_gobierno");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneTablaGobierno = async (req, res) => {
   try {
      const { id } = req.params;
      console.log("id:", id);
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(
          "SELECT * FROM vacaciones_sypris.tabla_gobierno WHERE id = @id"
        );
  
      res.json(result.recordset);
      console.log(result.recordset);
    } catch (error) {
      console.error("Error en getOneTablaGobierno:", error);
      res.status(500).send(error.message);
    }
};

const addTablaGobierno = async (req, res) => {
  try {
      const {
        id,
        anos_laborados_inicio,
        anos_laborados_fin,
        dias_vacaciones,
      } = req.body;
  
      if (
        id === undefined ||
        anos_laborados_inicio === undefined ||
        anos_laborados_fin === undefined ||
        dias_vacaciones === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Bad Request. llena bien los datos" });
      }
  
      const pool = await getConnection();
      await pool
        .request()
        .input("id", sql.Int, id)
        .input("anos_laborados_inicio", sql.Int, anos_laborados_inicio)
        .input("dias_vacaciones", sql.Int, dias_vacaciones).query(`
      INSERT INTO vacaciones_sypris.tabla_gobierno
      (id, anos_laborados_inicio, anos_laborados_fin, dias_vacaciones)
      VALUES
      (@id, @anos_laborados_inicio, @anos_laborados_fin, @dias_vacaciones)
    `);
  
      res.json({ message: "Empleado creado" });
    } catch (error) {
      res.status(500).send(error.message);
    }
};

const deleteTablaGobierno = async (req, res) => {
   try {
      const { id } = req.params;
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(
          "DELETE FROM vacaciones_sypris.tabla_gobierno WHERE id = @id"
        );
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
};

const updateTablaGobierno = async (req, res) => {
  try {
      const { id } = req.params;
      const { anos_laborados_inicio, anos_laborados_fin, dias_vacaciones } =
        req.body;
  
      if (
        id === undefined ||
        anos_laborados_inicio === undefined ||
        anos_laborados_fin === undefined ||
        dias_vacaciones === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Bad Request. llena bien los datos Ruben" });
      }
  
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("anos_laborados_incio", sql.Int, anos_laborados_inicio)
        .input("anos_laborados_fin", sql.Int, anos_laborados_fin)
        .input("dias_vacaciones", sql.Int, dias_vacaciones).query(`
      UPDATE vacaciones_sypris.tabla_gobierno
      SET 
        anos_laborados_inicio = @anos_laborados_inicio,
        anos_laborados_fin = @anos_laborados_fin,
        dias_vacaciones = @dias_vacaciones
      WHERE id = @id
    `);
  
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
};

module.exports = {
  methods: {
    getTablaGobierno,
    getOneTablaGobierno,
    addTablaGobierno,
    deleteTablaGobierno,
    updateTablaGobierno,
  },
};
