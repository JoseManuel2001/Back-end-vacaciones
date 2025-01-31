const express = require ('express');
const cors = require('cors');
const morgan = require('morgan');
const TokenUsuario = require('./routes/TokenUsuario.routes.cjs');

const app = express();

//habilitar cors
app.use(cors());

//settings
app.set("port", 1350);

//middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routes

app.use("/vacaciones/TokenUsuario", TokenUsuario);

// Programar tarea para ejecutarse a los 30 minutos de cada hora


module.exports = app;
