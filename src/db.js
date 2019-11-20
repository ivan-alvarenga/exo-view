require('dotenv').config();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME,
});

var query = function (sql, params, callback, failCallback) {
  connection.query(sql, params, function(error, results, fields) {
    console.log(sql, params)
    var fieldsName = fields.map(function(f) {return f.name});
    if(error)
      failCallback(error, fieldsName);
    else
      callback(results, fieldsName);
  });
};

module.exports = {
  mysql: mysql,
  connection: connection,
  query: query,
};