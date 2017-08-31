const sql  = require('sql-crud');
const crud = new sql("mysql");

module.exports = (app, con) => {
  
  app.get('/promociones', (req, res) => {
    const query = `SELECT PROMOCIONES.id as id,
    PROMOCIONES.nombre as nombre,
    PROMOCIONES.imagen as imagen,
    PROMOCIONES.descripcion as descripcion,
    PROMOCIONES.codigoEstablecimiento as codigoEstablecimiento,
    ESTABLECIMIENTOS.nombre as nombreEstablecimiento
    FROM PROMOCIONES INNER JOIN ESTABLECIMIENTOS ON 
    PROMOCIONES.codigoEstablecimiento = ESTABLECIMIENTOS.id
    `;
    console.log(query);
    con.query(query, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    });
  });

  app.get('/wallpaper', (req, res) => {
    crud.select(con, {
      select: '*',
      from: 'FONDOS'
    }, (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result);
    }, true);
  });


  app.put('/wallpaper', (req, res)=> {
    crud.update(con, {
      table: 'FONDOS',
      values: {href: req.body.href},
      where: {id: 1}
    }, false, true);
    res.send('ok');
  });

  app.post('/promociones', (req, res) => {
    crud.insert(con, {
      insertInto: 'PROMOCIONES',
      values: req.body
    }, (err, row) => {
      if(err) {
        res.send(err);
      }
      res.send(row);
    }, true);
  });

  app.put('/promociones', (req, res)=> {
    crud.update(con, {
      table: 'PROMOCIONES',
      values: req.body,
      where: {id: req.body.id}
    }, false, true);
    res.send('ok');
  });

  app.delete('/promociones', (req, res)=> {
    crud.delete(con, {
      from: 'PROMOCIONES',
      where: {id: req.body.id}
    }, false, true);
    res.send('ok');
  });

}