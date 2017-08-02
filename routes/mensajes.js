let sql = require('sql-crud');
let crud = new sql('mysql');
module.exports = (app, con) => {
  
	app.post('/messages', (req, res) => {
      crud.insert(con, {
      	insertInto: 'MENSAJES_ADMIN',
      	values: req.body
      }, (err, row) => {
      	if (err) {
      		res.send(err);
      	}
      	res.send(row);
      }, true);
	});

	app.get('/messages/all/:tipo/:id', (req, res) => {
      const id = req.params.id;
      const tipo = req.params.tipo;
      let user = {};
      if (tipo == 1) {
        user = {
        // Admin
          table: 'idAdmin',
          atable:'idUsuario',
          innerTable: 'USUARIOS'
        }
      } else {
        // Usuarios
        user = {
          table: 'idUsuario',
          atable:'idAdmin',
          innerTable: 'ADMINISTRADORES'
        }
      }
      
      
      const query2 = `
      SELECT  MENSAJES_ADMIN.id id,
      MENSAJES_ADMIN.idAdmin idAdmin,
      MENSAJES_ADMIN.idUsuario idUsuario,
      MENSAJES_ADMIN.mensaje mensaje,
      MENSAJES_ADMIN.idEnvia idEnvia,
      MENSAJES_ADMIN.leidoAdmin leidoAdmin,
      MENSAJES_ADMIN.leidoUsuario leidoUsuario,
      MENSAJES_ADMIN.motivo motivo,
      ${user.innerTable}.nombre nombre,
      ${user.innerTable}.apellido apellido,
      ${user.innerTable}.email email 
      FROM MENSAJES_ADMIN INNER 
      JOIN ${user.innerTable} 
      ON ${user.innerTable}.id = MENSAJES_ADMIN.${user.atable} 
      WHERE MENSAJES_ADMIN.${user.table} = '${id}' 
      AND MENSAJES_ADMIN.id IN (SELECT MAX(id) 
      FROM MENSAJES_ADMIN GROUP BY ${user.atable}) 
      ORDER BY MENSAJES_ADMIN.id DESC`;

      console.log(query2);
      con.query(query2, (err, row) => {
        if (err) {
          res.send(err);
        }
        res.send(row);
      });
	});

	app.post('/messages/admin', (req, res) => {
      const idAdmin = req.body.idAdmin;
      const idUsuario = req.body.idUsuario;
       const query = `SELECT MENSAJES_ADMIN.id as id, 
      MENSAJES_ADMIN.idAdmin as idAdmin, 
      MENSAJES_ADMIN.idUsuario as idUsuario,
      MENSAJES_ADMIN.mensaje as mensaje,
      MENSAJES_ADMIN.idEnvia as idEnvia, 
      MENSAJES_ADMIN.leidoAdmin as leidoAdmin,
      MENSAJES_ADMIN.leidoUsuario as leidoUsuario, 
      MENSAJES_ADMIN.motivo as motivo,
      ADMINISTRADORES.nombre as nombreAdmin,
      ADMINISTRADORES.apellido as apellidoAdmin,
      ADMINISTRADORES.email as emailAdmin,
      USUARIOS.nombre as nombreUsuario,
      USUARIOS.apellido as apellidoUsuario,
      USUARIOS.email as emailUsuario 
      FROM \`MENSAJES_ADMIN\`
      INNER JOIN ADMINISTRADORES ON ADMINISTRADORES.id = 
      MENSAJES_ADMIN.idAdmin 
      INNER JOIN USUARIOS ON USUARIOS.id = 
      MENSAJES_ADMIN.idUsuario 
      WHERE MENSAJES_ADMIN.idAdmin = '${idAdmin}'
       AND MENSAJES_ADMIN.idUsuario = '${idUsuario}';`;
       console.log(query);
      con.query(query, (err, row) => {
        if (err) {
          res.send(err);
        }
        res.send(row);
      });
	});

  app.put('/messages', (res, send) => {
    crud.update(con, {
      table: 'MENSAJES_ADMIN',
      values: req.body,
      where: req.body.id 
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    });
  });

	app.delete('/messages', () => {
      crud.delete(con, {
        from: 'MENSAJES_ADMIN',
        where: { id: req.body.id }
      }, true);
	});
}