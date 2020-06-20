const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');
const Producto = require('../models/productos');
const { json } = require('body-parser');

const app = express();


//buscar producto
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
  let termino = req.params.termino
  let regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productos
      })
    });

});



//Crear Producto
app.post('/producto', verificarToken, (req, res) => {
  let body = req.body;
  let usuario = req.usuario;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precio,
    descripcion: body.descripcion,
    disponible: true,
    categoria: body.idCategoria,
    usuario: usuario._id
  });

  producto.save((err, producto) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      producto
    });
  });
});


//Obtener Productos
app.get('/producto', verificarToken, (req, res) => {
  Producto.find({ disponible: true })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      Producto.countDocuments((err, total) => {
        res.json({
          ok: true,
          productos,
          total
        })
      });
    })
});

//Obtener producto Id
app.get('/producto/:id', verificarToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!producto) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'No se encontro el producto'
          }
        });
      }

      res.json({
        ok: true,
        producto
      });
    });
});

//Actualizar producto
app.put('/producto/:id', verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, producto) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no fue encontrado'
        }
      });
    }

    producto.nombre = body.nombre,
      producto.precioUni = body.precio,
      producto.descripcion = body.descripcion,
      producto.categoria = body.idCategoria,
      producto.disponible = body.disponible



    producto.save((err, productoActualizado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoActualizado
      });
    });
  });
});

//Eliminar un producto
app.delete('/producto/:id', verificarToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id, (err, producto) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no fue encontrado'
        }
      });
    }

    producto.disponible = false;

    producto.save((err, productoBorrado) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        message: 'Producto Borrado'
      });
    });
  });
});

module.exports = app;