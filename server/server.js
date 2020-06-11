require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Midlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world');

});

app.listen(process.env.PORT, () => {
  console.log('listening on the port', process.env.PORT);
});