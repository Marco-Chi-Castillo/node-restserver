//CONFIGURACIÓN DEL PRUERTO
process.env.PORT = process.env.PORT || 3000

//ENTORNO DE DESARROLLO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS

let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb + srv://marco:A8adrCU1Q5vX0cvs@cluster0-jmjov.mongodb.net/cafe';
}

process.env.URLDB = urlDB;