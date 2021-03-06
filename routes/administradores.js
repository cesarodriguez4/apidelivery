const sql  = require('sql-crud');
const crud = new sql("mysql");
const jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');
var random = require('randomstring');

module.exports = (app, con) => {
  app.get('/admin', (req, res) => {
    const query = `
    SELECT \`ADMINISTRADORES\`.id, 
    \`ADMINISTRADORES\`.nombre, 
    \`ADMINISTRADORES\`.apellido, 
    \`ADMINISTRADORES\`.cargo, 
    \`ADMINISTRADORES\`.ciudad, 
    \`ADMINISTRADORES\`.estado, 
    \`ADMINISTRADORES\`.email, 
    \`ADMINISTRADORES\`.telefono, 
    \`ADMINISTRADORES\`.activo, 
    \`PERMISOS\`.id as idPermiso,
    \`PERMISOS\`.nombre as nombrePermiso
    FROM \`ADMINISTRADORES\` INNER JOIN
    \`PERMISOS\` ON \`ADMINISTRADORES\`.id_permisos
     = \`PERMISOS\`.id
    `;
    console.log(query);
    con.query(query, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
        return console.log(err);
      }
      return res.send(rows);
    });
  });
  
  app.put('/admin/state', (req, res) => {
    crud.update(con, {
      table  : 'ADMINISTRADORES',
      values : req.body,
      where  : {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.post('/admin/new', (req, res) => {
    //Usuario 1: Establecimiento, 0: usuario comun 
    const saltRounds = 10;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
      req.body.codigo = random.generate(12).toUpperCase();
      req.body.password = hash;
      crud.insert(con, {insertInto: 'ADMINISTRADORES', values: req.body}, (err, result) => {
        if (err) {
          return res.send("Error: "+ err);
        }
        return res.send("Usuario creado con exito.");
      }, true);
    });
  });

  app.post('/admin/login', (req, res) => {
    const q = `
    SELECT ADMINISTRADORES.*,
         PERMISOS.id as idPermisos,
         PERMISOS.permisos as permisosApp,
         PERMISOS.nombre as nombrePermiso
         FROM ADMINISTRADORES    
         INNER JOIN PERMISOS ON 
           ADMINISTRADORES.id_permisos = PERMISOS.id  
         WHERE ADMINISTRADORES.email = '${req.body.email}';`;
    console.log(q);
    con.query(q, (err, results) => {
      if (err) {
        return res.send({error: 'Error inesperado: ' + err});
      } else {
        if (results.length > 0) {
          //Existe el email en la base de datos
          bcrypt.compare(req.body.password, results[0].password, function(error, pass) {
            if (error) {
              return res.send({error: 'Error inesperado: ' + error});
            } else {
              if (pass) {
                //Coinciden, generamos token
                var token = jwt.sign({  data: req.body.email}, app.get('token'), { expiresIn: '24h' });
                return res.send({results, token});
              } else {
                return res.send({error: 'Contraseña y/o correo inválidos.'});
              }
            }
          });
        } else {
          res.send({error: 'Este email no se encuentra registrado.'})
        }
      }
    });
  });

  app.delete('/admin/delete', (req, res) => {
    crud.delete(con, {from: 'ADMINISTRADORES', where: {id: req.body.id}}, (err, result) => {
      if (err) {
        return res.send("Error: "+err);
      }
      return res.send("Usuario eliminado con exito.");
    }, true);
  });
};