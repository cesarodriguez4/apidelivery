let sql = require('sql-crud');
let crud = new sql('mysql');

module.exports = (app, con) => {

  app.post('/horarios', (req, res) => {
    crud.insert(con, {
      insertInto: 'HORARIOS',
      values: req.body,
      where: {idEstablecimiento: req.body.idEstablecimiento}
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    }, true);
  });

  app.get('/horarios/:id', (req, res) => {
    const idEstablecimiento = req.params.id;
    crud.select(con, {
      select: '*',
      from: 'HORARIOS',
      where: {idEstablecimiento}
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    }, true);
  });
	
  app.put('/horarios', (req, res) => {
    crud.update(con, {
      table: 'HORARIOS',
      values: req.body,
      where: {id: req.body.id}
    }, (err, row) => {
      if (err) {
        res.send(err);
      } else {
        res.send(row);
      }
    });
  });

  app.delete('/horarios', (req, res) => {
    crud.delete(con, {
      from: 'HORARIOS',
      where: {id: req.body.id}
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    }, true);
  });
};