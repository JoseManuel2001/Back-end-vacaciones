const express = require ('express');
const cors = require('cors');
const morgan = require('morgan');
const TokenUsuario = require('./routes/TokenUsuario.routes.cjs');
const EmpleadoRoutes = require('./routes/Empleado.routes.cjs');
const formatoVacaciones = require('./routes/formatoVacaciones.routes.cjs');1
const Supervisor = require('./routes/Supervisor.routes.cjs');
const programacion_Vacaciones = require('./routes/programacion_vacaciones.cjs');
const Saldo = require('./routes/Saldo.router.cjs');
const tablaGobierno = require('./routes/tablaGobierno.routes.cjs');
const usuario = require('./routes/Usuarios.routes.cjs');
const banco = require('./routes/banco.routes.cjs');
const app = express();

//habilitar cors
 app.use(
   cors({
     origin: "*",
     methods: ["GET", "POST", "PUT", "DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
   })
 );

//settings
app.set("port", 1350);

//middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routes

app.use("/vacaciones/TokenUsuario", TokenUsuario);
app.use("/vacaciones/Empleado", EmpleadoRoutes);
app.use("/vacaciones/formatoVacaciones", formatoVacaciones);
app.use("/vacaciones/Supervisor", Supervisor);
app.use("/vacaciones/Saldo", Saldo);
app.use("/vacaciones/programacion_vacaciones", programacion_Vacaciones)
app.use("/vacaciones/tablaGobierno", tablaGobierno);
app.use("/vacaciones/usuario", usuario);
app.use("/vacaciones/banco", banco);

// Programar tarea para ejecutarse a los 30 minutos de cada hora


module.exports = app;
