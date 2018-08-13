var config = require('./config');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: config.HOST,
  user: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});
module.exports = {
	con: con
}