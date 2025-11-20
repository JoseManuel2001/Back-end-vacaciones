const { getConnection, sql } = require("../database/database.cjs");

const getEmpleado = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query("SELECT * FROM vacaciones_sypris.empleado");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getOneEmpleado = async (req, res) => {
  try {
    const { trabajador } = req.params;
    console.log("Trabajador:", trabajador);
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("trabajador", sql.NVarChar, trabajador)
      .query(
        "SELECT * FROM vacaciones_sypris.empleado WHERE trabajador = @trabajador"
      );

    res.json(result.recordset);
    console.log(result.recordset);
  } catch (error) {
    console.error("Error en getOneEmpleado:", error);
    res.status(500).send(error.message);
  }
};

const addEmpleado = async (req, res) => {
  try {
    const {
      trabajador,
      fecha_ingreso,
      nombre,
      fecha_antiguedad,
      centro_costos,
      estatus,
      supervisor,
      tipo,
    } = req.body;

    if (
      trabajador === undefined ||
      fecha_ingreso === undefined ||
      nombre === undefined ||
      fecha_antiguedad === undefined ||
      centro_costos === undefined ||
      estatus === undefined ||
      tipo === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Bad Request. llena bien los datos" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("trabajador", sql.NVarChar, trabajador)
      .input("fecha_ingreso", sql.NVarChar, fecha_ingreso)
      .input("nombre", sql.NVarChar, nombre)
      .input("fecha_antiguedad", sql.NVarChar, fecha_antiguedad)
      .input("centro_costos", sql.NVarChar, centro_costos)
      .input("estatus", sql.Int, estatus)
      .input("supervisor", sql.NVarChar, supervisor)
      .input("tipo", sql.NVarChar, tipo)
      .query(`
    INSERT INTO vacaciones_sypris.empleado
    (trabajador, fecha_ingreso, nombre, fecha_antiguedad, centro_costos, estatus, supervisor, tipo)
    VALUES
    (@trabajador, @fecha_ingreso, @nombre, @fecha_antiguedad, @centro_costos, @estatus, @supervisor, @tipo)
  `);

    res.json({ message: "Empleado creado" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteEmpleado = async (req, res) => {
  try {
    const { trabajador } = req.params;
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("trabajador", sql.NVarChar, trabajador)
      .query(
        "DELETE FROM vacaciones_sypris.empleados WHERE trabajador = @trabajador"
      );
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Trabajador a actualizar:", id);
    const { fecha_antiguedad, nombre, centro_costos, estatus, supervisor, tipo, correo } =
      req.body;
      console.log("Datos recibidos para actualizar:", req.body);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("fecha_antiguedad", sql.VarChar, fecha_antiguedad)
      .input("nombre", sql.VarChar, nombre)
      .input("centro_costos", sql.VarChar, centro_costos)
      .input("estatus", sql.Int, estatus)
      .input("supervisor", sql.VarChar, supervisor)
      .input("tipo", sql.VarChar, tipo)
      .input("correo", sql.VarChar, correo)
      .query(`
    UPDATE vacaciones_sypris.empleado
    SET 
      fecha_antiguedad = @fecha_antiguedad,
      nombre = @nombre,
      centro_costos = @centro_costos,
      estatus = @estatus,
      supervisor = @supervisor,
      tipo = @tipo,
      correo = @correo
    WHERE trabajador = @id
  `);
    res.json({
      message: "Empleado actualizado",
      data: req.body,
      result: result
    });
    console.log(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  methods: {
    getEmpleado,
    getOneEmpleado,
    addEmpleado,
    deleteEmpleado,
    updateEmpleado,
  },
};
