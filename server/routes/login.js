const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//librerias de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraición de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/google', async (req, res) => {

  let token = req.body.idtoken;
  let googleUser = await verify(token)
    .catch(e => {
      res.status(403).json({
        ok: false,
        err: e
      });
    });

  Usuario.findOne({ email: googleUser.email }, (err, user) => {
    //si sucede un error
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    //si el usuario existe en base de datos
    if (user) {
      if (user.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe de usar su autenticación normal'
          }
        });
      } else {
        let token = jwt.sign({
          usuario: user
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
          ok: true,
          usuario: user,
          token
        });
      }
      //si el usuario no existe en base de datos
    } else {
      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';


      usuario.save((err, user) => {
        //si sucede un error
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        let token = jwt.sign({
          usuario: user
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
          ok: true,
          usuario: user,
          token
        });
      });

    }

  });

});


module.exports = app;