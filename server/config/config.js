//CONFIGURACIÓN DEL PRUERTO
process.env.PORT = process.env.PORT || 3000

//ENTORNO DE DESARROLLO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//FECHA DE CADUCIDAD DEL TOKEN
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED DE AUTENTICACION
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//GOOGLE CLIENT ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '198004930778-cg9c2drsfl0uv5n21ibqems6ckp2qbp1.apps.googleusercontent.com';

//BASE DE DATOS
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;