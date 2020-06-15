const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
const app = express();

app.post('/login', (req, res) => {

  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, user) => {
    //si sucede un error
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    //Si el email fue incorrecto, devuelve como null al user
    if (!user) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrecto'
        }
      });
    }

    //si la contraseña no hace mach con lo que encontro en base de datos
    if (!bcrypt.compareSync(body.password, user.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrecto'
        }
      });
    }

    let token = jwt.sign({
      usuario: user
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    //Si todo sale correcto
    res.json({
      ok: true,
      usuario: user,
      token
    });
  });
});

module.exports = app;