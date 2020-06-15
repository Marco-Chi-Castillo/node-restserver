const express = require('express');
const app = express();

//configuraciones de rutas
app.use(require('./login'));
app.use(require('./usuarios'));

module.exports = app;