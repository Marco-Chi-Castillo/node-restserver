const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuarios');
const Producto = require('../models/productos');
const app = express();


//middlewares
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se selecciono ningún archivo'
      }
    });
  }

  //validar tipos
  let tiposValidos = ['usuario', 'producto'];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'Los tipos validos son ' + tiposValidos.join(', '),
      tipo
    });

  }

  let archivo = req.files.archivo;

  //obtenemos la extension del archivo
  let nombreArchivo = archivo.name.split('.');
  let extension = nombreArchivo[nombreArchivo.length - 1];

  //Extensiones permitidas
  let ExtensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  //validamos si la imagen tiene esa extension
  if (ExtensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'Las extensiones validas son ' + ExtensionesValidas.join(', '),
      ext: extension
    });
  }

  //Renombrar el archivo
  let nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`

  //subimos la imagen
  archivo.mv(`uploads/${tipo}/${nameFile}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });

    if (tipo === 'usuario') {
      imagenUsuario(id, res, nameFile);
    } else {
      imagenProducto(id, res, nameFile);
    }
  });
});

function imagenUsuario(id, res, nombreArchivo) {

  Usuario.findById(id, (err, user) => {

    if (err) {
      borrarArchivo(nombreArchivo, 'usuario'); //eliminar si hay un error
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!user) {
      borrarArchivo(nombreArchivo, 'usuario');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El usuario no existe'
        }
      });
    }

    borrarArchivo(user.img, 'usuario');

    user.img = nombreArchivo;

    user.save((err, saveUser) => {
      res.json({
        ok: true,
        usuario: saveUser,
        img: nombreArchivo
      });

    });
  });
}

function imagenProducto(id, res, nombreArchivo) {

  Producto.findById(id, (err, producto) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'producto');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!producto) {
      borrarArchivo(nombreArchivo, 'producto');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no fue encontrado'
        }
      });
    }

    borrarArchivo(producto.img, 'producto');
    producto.img = nombreArchivo;

    producto.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      });
    });
  });
}

function borrarArchivo(nombreImg, tipo) {
  let pathURL = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
  if (fs.existsSync(pathURL)) {
    fs.unlinkSync(pathURL);
  }
}

module.exports = app;