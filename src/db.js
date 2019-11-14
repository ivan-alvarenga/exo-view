var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'user',
  password : 'senha',
  database : 'exoview'
});

var query = function (sql, params, callback, failCallback) {
  connection.query(sql, params, function(error, results, fields) {
    var fieldsName = fields.map(function(f) {return f.name});
    if(error)
      failCallback(error, fieldsName);
    else
      callback(results, fieldsName);
  });
};

module.exports = {
  connection: connection,
  query: query,
};