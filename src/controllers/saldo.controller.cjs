const { getConnection, sql } = require("../database/database.cjs");

const getSaldo = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.saldo");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneSaldo = async (req, res) => {
   try {
      const { id } = req.params;
      console.log("id:", id);
      const pool = await getConnection();
  
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query(
          "SELECT * FROM vacaciones_sypris.saldo WHERE id = @id"
        );
  
      res.json(result.recordset);
      console.log(result.recordset);
    } catch (error) {
      console.error("Error en getOneSaldo:", error);
      res.status(500).send(error.message);
    }
};

const addSaldo = async (req, res) => {
  try {
    const {
      id,
      ano,
      dias_totales,
      dias_tentativos,
      dias_confirmados,
      nomina,
    } = req.body;

    if (
      id === undefined ||
      ano === undefined ||
      dias_totales === undefined ||
      dias_tentativos === undefined ||
      dias_confirmados === undefined ||
      nomina === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Bad Request. llena bien los datos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("ano", sql.Int, ano)
      .input("dias_totales", sql.Int, dias_totales)
      .input("dias_tentativos", sql.Int, dias_tentativos)
      .input("nomina", sql.NVarChar, nomina)
      .input("dias_confirmados", sql.Int, dias_confirmados)
      .query(`
    INSERT INTO vacaciones_sypris.empleado
    (id, ano, dias_totales, dias_tentativos, nomina, dias_confirmados)
    VALUES
    (@id, @ano, @dias_totales, @dias_tentativos, @nomina, @dias_confirmados)
  `);

    res.json({ message: "Empleado creado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteSaldo = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(
        "DELETE FROM vacaciones_sypris.saldo WHERE id = @id"
      );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateSaldo = async (req, res) => {
  try {
    const { id } = req.params;
    const { ano, dias_totales, nomina, dias_confirmados, dias_tentativos } =
      req.body;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("ano", sql.Int, ano)
      .input("dias_totales", sql.Int, dias_totales)
      .input("dias_tentativos", sql.Int, dias_tentativos)
      .input("nomina", sql.VarChar, nomina)
      .input("dias_confirmados", sql.Int, dias_confirmados)
      .query(`
    UPDATE vacaciones_sypris.saldo
    SET 
      ano = @ano,
      dias_totales = @dias_totales,
      dias_tentativos = @dias_tentativos,
      nomina = @nomina,
      dias_confirmados = @dias_confirmados
    WHERE id = @id
  `);

    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getReporteSaldos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(`SELECT emp.trabajador, emp.nombre, emp.centro_costos, s.ano, s.dias_totales, s.dias_confirmados, s.dias_tentativos
        FROM vacaciones_sypris.empleado AS  emp 
        JOIN vacaciones_sypris.saldo AS s 
        ON emp.trabajador = s.nomina WHERE s.dias_tentativos <> 0 OR s.dias_confirmados <> 0`);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  methods: {
    getSaldo,
    getOneSaldo,
    addSaldo,
    deleteSaldo,
    updateSaldo,
    getReporteSaldos,
  },
};
