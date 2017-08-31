const sql = require('sql-crud');
let crud = new sql('mysql');
let jwt = require('jsonwebtoken');


module.exports = (app, con, transporter) => {

  app.get('/notifications', (req, res) => {
     crud.select(con, {
      select: '*',
      from: 'NOTIFICACIONES',
      where: {
        activoAdmin: 1
      }
     }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
     }); 
  });

  app.get('/notifications/leido', (req, res) => {
     crud.select(con, {
      select: '*',
      from: 'NOTIFICACIONES',
      where: {
        activoAdmin: 1,
        leidoAdmin: 0
      }
     }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
     }); 
  });

  app.post('/notifications', (req, res) => {
        if (req.body.leido) {
          crud.select(con, {
          select: '*',
          from: 'NOTIFICACIONES',
          where: {leido: req.body.leido}
        }, (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }, true);
        } else {
        crud.select(con, {
          select: '*',
          from: 'NOTIFICACIONES'
        }, (err, result) => {
            if (err) {
              res.send(err);
            }
            res.send(result);
          }, true);
        }
  });

  app.get('/notifications/usuario/:id', (req, res) => {
      const id = req.params.id;
      crud.select(con, {
        select: '*',
        from: 'NOTIFICACIONES',
        where: {
          codigoUsuario: id
        }
      }, (err, result) => {
        if (err) {
          res.send(err);
        }
          res.send(result);
      }, true);
  });  

  app.post('/notifications/usuario/:id', (req, res) => {
      const id = req.params.id;
      crud.select(con, {
        select: '*',
        from: 'NOTIFICACIONES',
        where: {
          codigoUsuario: id,
          leido: req.body.leido
        }
      }, (err, result) => {
        if (err) {
          res.send(err);
        }
          res.send(result);
      }, true);
  });

  app.put('/notifications/update', (req, res) => {
    crud.update(con, {
      table: 'NOTIFICACIONES',
      values: req.body,
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.delete('/notifications/delete', (req, res) => {
    crud.delete(con, {
      from: 'NOTIFICACIONES',
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });
};