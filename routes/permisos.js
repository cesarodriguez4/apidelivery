let sql = require('sql-crud');
let crud = new sql('mysql');

module.exports = (app, con) => {

  app.get('/permisos', (req, res) => {
    crud.select(con, {
      select: '*',
      from: 'PERMISOS'
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    });
  });

  app.post('/permisos', (req, res) => {
    crud.insert(con, {
    	insertInto: 'PERMISOS',
    	values: req.body
    }, (err, row) => {
      if (err) {
      	res.send(err);
      }
      res.send(row);
    }, true);
  });

  app.put('/permisos', (req, res) => {
    crud.update(con, {
    	table: 'PERMISOS',
    	values: req.body,
    	where: { id: req.body.id }
    }, (err, row) => {
      if (err) {
      	res.send(err);
      }
      res.send(row);
    }, true);
  });

  app.delete('/permisos', (req, res) => {
    crud.delete(con, {
    	from: 'PERMISOS',
    	where: { id: req.body.id }
    }, (err, row) => {
      if (err) {
      	res.send(err);
      }
      res.send(row);
    }, true);
  });
}