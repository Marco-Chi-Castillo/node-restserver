require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

//Midlewares
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use(require('./routes/index'));

//Configuracion de MongoDB para la cadenas de conexión de MongoDB y evitar advertencias en consola.
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.URLDB, (err, res) => {
  if (err) throw err;
  console.log('Database is connect ');
});

app.listen(process.env.PORT, () => {
  console.log('listening on the port', process.env.PORT);
});