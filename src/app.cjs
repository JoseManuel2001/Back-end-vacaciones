const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const TokenUsuario = require('./routes/TokenUsuario.routes.cjs');
const EmpleadoRoutes = require('./routes/Empleado.routes.cjs');
const formatoVacaciones = require('./routes/formatoVacaciones.routes.cjs'); 1
const Supervisor = require('./routes/Supervisor.routes.cjs');
const programacion_Vacaciones = require('./routes/programacion_vacaciones.cjs');
const Saldo = require('./routes/Saldo.router.cjs');
const tablaGobierno = require('./routes/tablaGobierno.routes.cjs');
const usuario = require('./routes/Usuarios.routes.cjs');
const banco = require('./routes/banco.routes.cjs');
const periodos = require('./routes/periodos_evaluacion.routes.cjs');
const evaluaciones = require('./routes/evaluaciones.routes.cjs');
const objetivos = require('./routes/evaluacion_objetivos.routes.cjs');
const reportexdias = require('./routes/reportexdias.routes.cjs');
const caracteristicas = require('./routes/caracteristicas.routes.cjs');
const calificacion_caracteristicas = require('./routes/calificacion_caracteristicas.routes.cjs');
const calificacion_objetivos = require('./routes/calificacion_objetivos.routes.cjs');

const app = express();

//habilitar cors
app.use(
  cors({
    origin: "*",
  })
);

//settings
app.set("port", 1341);

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
app.use("/eva_desempeno/periodos", periodos);
app.use("/eva_desempeno/evaluaciones", evaluaciones);
app.use("/eva_desempeno/objetivos", objetivos);
app.use("/vacaciones/reportexdias", reportexdias);
app.use("/eva_desempeno/caracteristicas", caracteristicas);
app.use("/eva_desempeno/calificacion_caracteristicas", calificacion_caracteristicas);
app.use("/eva_desempeno/calificacion_objetivos", calificacion_objetivos);

module.exports = app;
