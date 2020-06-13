const mongoose = require('mongoose');
//libreria para valores unicos en mongoDB
const validatorUnique = require('mongoose-unique-validator');

//roles de los usuarios
let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
};

//Esquema de datos de usuarios
let Schema = mongoose.Schema;

let userSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario'] //dispara el mensaje cuando no es true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El email es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

//eliminar el password del JSON para no mostrarlo en pantalla
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

userSchema.plugin(validatorUnique, { message: '{PATH} debe de ser único' });
//exportamos el modulo de usuarios
module.exports = mongoose.model('Usuario', userSchema);