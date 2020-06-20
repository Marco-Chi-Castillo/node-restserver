const express = require('express');
const { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');

const app = express();

//crear categoria
app.post('/categoria', verificarToken, (req, res) => {
  let body = req.body;
  let usuario = req.usuario;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: usuario._id
  });

  categoria.save((err, categoria) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria
    });

  });

});

//Obtener las categorias
app.get('/categoria', verificarToken, (req, res) => {
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      Categoria.countDocuments((err, total) => {
        res.json({
          ok: true,
          categorias,
          total
        });
      });
    });
});

//Obtener categoria por un ID
app.get('/categoria/:id', verificarToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoria) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria
    });
  });

  //Actualizar Categoria
  app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let updateCategoria = {
      descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, updateCategoria, { new: true, runValidators: true }, (err, categoria) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        categoria
      });
    });
  });


  //Eliminar Categoria
  app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        categoria
      });
    });
  });
});
module.exports = app;