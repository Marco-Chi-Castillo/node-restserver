const jwt = require('jsonwebtoken');
const { json } = require('body-parser');


//Verificación de lo tokens
let verificarToken = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decode) => {

    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    req.usuario = decode.usuario;
    next();

  });
}

//Verificación de lo tokens
let verificarTokenImg = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decode) => {

    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    req.usuario = decode.usuario;
    next();

  });

}


//Verificacion de roles 
let verificarAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
};

module.exports = { verificarToken, verificarAdmin_Role, verificarTokenImg }