const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuarios');
const { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion');
const app = express();


//obtener Usuarios
app.get('/usuario', verificarToken, function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({ estado: true })//solo muestra los usuarios activos
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      //si sucede un error
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      //cuenta el total de registros hay en la BD
      Usuario.countDocuments({ estado: true }, (err, conteo) => {
        //si todo fue correcto
        res.json({
          ok: true,
          usuarios,
          total: conteo
        });
      });
    });
});
//Crear usuario
app.post('/usuario', [verificarToken, verificarAdmin_Role], function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, user) => {
    //si sucede un error
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    //si todo fue correcto
    res.json({
      ok: true,
      usuario: user
    });
  });
});

//Actualizar usuario
app.put('/usuario/:id', [verificarToken, verificarAdmin_Role], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'role', 'img', 'estado']); //campos validos a actualizar

  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, user) => {
    //si sucede un error
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    //si todo fue correcto
    res.json({
      ok: true,
      usuario: user
    });
  });
});

app.delete('/usuario/:id', [verificarToken, verificarAdmin_Role], function (req, res) {
  let id = req.params.id;

  let newEstado = {
    estado: false
  }
  //Actualizar solo el estado, solo se elimina de forma logica
  Usuario.findByIdAndUpdate(id, newEstado, { new: true }, (err, userDelete) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    //si el usuario no es encontrado
    if (!userDelete) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El usuario no fue encontrado'
        }
      });
    }

    //si todo fue correcto
    res.json({
      ok: true,
      usuario: userDelete
    });
  });
});

module.exports = app;