const express = require('express');
const app = express();

//configuraciones de rutas
app.use(require('./login'));
app.use(require('./usuarios'));
app.use(require('./categoria'));
app.use(require('./productos'));

module.exports = app;