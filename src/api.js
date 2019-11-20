require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.API_PORT;

var router = express.Router();
var db = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// listar planetas
app.use('/api/planetas', function(req, res) {
  var search = '%%';
  try {
    if (req.query.search) search = '%'+req.query.search+'%';
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT * FROM Planet WHERE pl_name like " + db.mysql.escape(search) + " ORDER BY pl_name", function(err, results, fields) {
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// listar planetas com informarcao das massas
app.use('/api/planetas_massas', function(req, res) {
  var search = '%%';
  try {
    if (req.query.search) search = '%'+req.query.search+'%';
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT * FROM Planet JOIN pl_mass ON pl_mass.id_planet_FK = Planet.id_planet WHERE pl_name like " + db.mysql.escape(search) + " ORDER BY pl_name", function(err, results, fields) {
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// listar planetas com informarcao da descoberta
app.use('/api/planetas_descobertas', function(req, res) {
  var search = '%%';
  try {
    if (req.query.search) search = '%'+req.query.search+'%';
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT * FROM Planet LEFT JOIN Discovery ON Discovery.id_discovery = Planet.id_discovery WHERE pl_name like " + db.mysql.escape(search) + " ORDER BY pl_name", function(err, results, fields) {
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// listar planetas com estrelas com idade maior que `st_age`
app.use('/api/planetas_estrela_mais_velha_que', function(req, res) {
  var st_age = 0;
  try {
    if (req.query.st_age) st_age = req.query.st_age;
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT pl_name FROM Planet LEFT JOIN has ON has.id_planet = Planet.id_planet JOIN Star ON Star.id_star = has.id_star WHERE Star.st_age > ? GROUP BY pl_name ORDER BY pl_name", [st_age], function(err, results, fields) {
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// listar planetas e sua host star
app.use('/api/planetas_estrelas_host', function(req, res) {
  var search = '%%';
  try {
    if (req.query.search) search = '%'+req.query.search+'%';
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT pl_name, Star.id_star FROM Planet LEFT JOIN has ON has.id_planet = Planet.id_planet JOIN Star ON Star.id_star = has.id_star AND has.is_host_star IS TRUE WHERE pl_name like " + db.mysql.escape(search) + " ORDER BY pl_name", function(err, results, fields) {
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// listar planetas descobertos pelos telescopios `pl_telescope`
app.use('/api/planetas_telescopios', function(req, res) {
  var pl_telescope = [];
  try {
    if (req.query.pl_telescope && req.query.pl_telescope.length) pl_telescope = req.query.pl_telescope;
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT pl_name FROM Planet JOIN Discovery ON Discovery.id_discovery = Planet.id_discovery WHERE " + (pl_telescope.length ? "pl_telescope IN ?" : "1=1") + " ORDER BY pl_name", function(err, results, fields) {
    if (err) {
      console.error(err);
      return {};
    }
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// listar numero de planetas por sistema
app.use('/api/planetas_sistema', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT System.id_system, COUNT(DISTINCT Planet.id_planet) AS count FROM System LEFT JOIN Planet ON Planet.id_system = Planet.id_system GROUP BY System.id_system", function(err, results, fields) {
    if (err) {
      console.error(err);
      return {};
    }
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// Idade media das estrelas de um planeta
app.use('/api/estrelas_idade_media', function(req, res) {
  var id_planet = '%%';
  try {
    if (req.query.id_planet) id_planet = req.query.id_planet;
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT AVG(st_age) FROM Star JOIN has ON has.id_star = Star.id_star WHERE id_planet = ? GROUP BY id_planet", [id_planet], function(err, results, fields) {
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

// Estrela mais antiga de cada planeta
app.use('/api/estrela_mais_antiga', function(req, res) {
  var search = '%%';
  try {
    if (req.query.search) search = '%'+req.query.search+'%';
  } catch (error) {console.log(error)}
  res.setHeader('Access-Control-Allow-Origin', '*');
  return db.connection.query("SELECT st_age, MAX(id_star) AS id_star, MAX(pl_name) AS pl_name FROM (SELECT MAX(st_age) AS max_age, pl_name FROM Star LEFT JOIN has ON has.id_star = Star.id_star JOIN Planet ON Planet.id_planet = has.id_planet GROUP BY pl_name) r JOIN Star ON Star.st_age = r.max_age WHERE pl_name like " + db.mysql.escape(search) + " GROUP BY st_age", function(err, results, fields) {
    return res.json({
      results: results,
      fields: fields.map(function(f) {return f.name}),
    });
  });
});

app.listen(port);
console.log('API rodando em: http://localhost:'+port.toString()+'/');