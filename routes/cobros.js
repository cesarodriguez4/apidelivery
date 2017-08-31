let sql = require('sql-crud');
let crud = new sql('mysql');

module.exports = (app, con) => {

  app.post('/cobros', (req, res) => {
    crud.insert(con, {
      insertInto: 'COBROS',
      values: req.body
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    }, true);
  });

  app.get('/cobros/admin/:state', (req, res) => {
    const estado = req.params.state;
    const query = `SELECT COBROS.id, 
    COBROS.idEstablecimiento,
    COBROS.fecha, COBROS.estado, COBROS.monto, COBROS.nombreBanco, 
    COBROS.montoPagado, COBROS.fechaPago, COBROS.referencia, 
    COBROS.codeEncargado, ESTABLECIMIENTOS.nombre, 
    ESTABLECIMIENTOS.telefono, ESTABLECIMIENTOS.email
    FROM COBROS INNER JOIN 
    ESTABLECIMIENTOS 
    ON COBROS.idEstablecimiento = ESTABLECIMIENTOS.id
    WHERE COBROS.estado = '${estado}'
    `;
    console.log(query);
    con.query(query, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    });
  });

  app.get('/cobros/est/:codeEncargado/:state', (req, res) => {
    const estado = req.params.state;
    const codeEncargado = req.params.codeEncargado;
    const query = `SELECT COBROS.id, 
    COBROS.idEstablecimiento,
    COBROS.fecha, COBROS.estado, COBROS.monto, COBROS.nombreBanco, 
    COBROS.montoPagado, COBROS.fechaPago, COBROS.referencia, 
    COBROS.codeEncargado, ESTABLECIMIENTOS.nombre, 
    ESTABLECIMIENTOS.telefono, ESTABLECIMIENTOS.email
    FROM COBROS INNER JOIN 
    ESTABLECIMIENTOS 
    ON COBROS.idEstablecimiento = ESTABLECIMIENTOS.id
    WHERE COBROS.estado = '${estado}' 
    AND COBROS.codeEncargado = '${codeEncargado}' `;
    console.log(query);
    con.query(query, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    });   
  });
	
	
  app.put('/cobros', (req, res) => {
    crud.update(con, {
      table: 'COBROS',
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

  app.delete('/cobros', (req, res) => {
    crud.delete(con, {
      from: 'COBROS',
      where: {id: req.body.id}
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send(row);
    }, true);
  });
};
