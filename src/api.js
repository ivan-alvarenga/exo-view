var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;

var db = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/:table', function(req, res) {
  var tableName = '';
  var attrs = '*';
  try {
    tableName = req.params.table;
    if (req.query.attrs) attrs = req.query.attrs;
  } catch (error) {console.log(error)}
  console.log(tableName, attrs)
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.query("SELECT ?? FROM ??", [attrs,req.params.table], function(results, fields) {
    return res.json({
      results: results,
      fields: fields,
    });
  });
});

app.listen(port);
console.log('API rodando em: http://localhost:'+port.toString()+'/');