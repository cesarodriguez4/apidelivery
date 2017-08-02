const sql  = require('sql-crud');
const crud = new sql("mysql");

var random = require('randomstring');

module.exports = (app, con) => {

  app.get('/establecimientos', (req, res) => {
    crud.select(con, {
    	select: '*',
    	from: 'ESTABLECIMIENTOS'
    	}, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
        return console.log(err);
      }
      return res.send(rows);
    }, true);
  });

  app.get('/establecimientos/mails', (req, res) => {
    crud.select(con, {
      select: 'id, email, nombre',
      from: 'ESTABLECIMIENTOS'
    }, (err, row) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
      }
      res.send(row);
    });
  });

    app.get('/establecimientos/byidHorario/:idHorario', (req, res) => {
    crud.select(con, {
      select: '*',
      from: 'ESTABLECIMIENTOS',
      where: {idHorario: req.params.idHorario}
      }, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
        return console.log(err);
      }
      return res.send(rows);
    }, true);
  });

  app.get('/establecimientos/byCode/:code', (req, res) => {
    crud.select(con, {
      select: '*',
      from: 'ESTABLECIMIENTOS',
      where: {id: req.params.code}
      }, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
        return console.log(err);
      }
      return res.send(rows);
    }, true);
  });

  app.post('/establecimientos/byUser', (req, res) => {
    crud.select(con, {
      select: '*',
      from: 'ESTABLECIMIENTOS',
      where:{codigo: req.body.codigo}
    }, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
        return console.log(err);
      }
      return res.send(rows);
    }, true);
  });

  app.post('/establecimientos', (req, res) => {
    crud.select(con, {
      select: '*',
      from: 'ESTABLECIMIENTOS',
      where:{categoria: req.body.categoria, activo: 1}
    }, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
        return console.log(err);
      }
      return res.send(rows);
    }, true);
  });

  app.post('/establecimientos/new', (req, res) => {
  	console.log(req.body);
    req.body.ruta = req.body.nombre.split(' ').join('-').toLowerCase();
    const idHorario = random.generate({
	    length: 4,
	    charset: 'numeric'
	  });
	  req.body.horarios.idHorario = idHorario;

    crud.insert(con,{
      insertInto: 'NOTIFICACIONES',
      values: {
        codigoUSUARIO: req.body.codigo,
        idHorario: idHorario,
        tipo: 'NUEVO ESTABLECIMIENTO'
     }
    }, 0,true);

    for (horario of req.body.horarios) {
      const queryH = ` INSERT INTO \`HORARIOS\` (\`dias\`,\`horaInicio\`,\`horaCierre\`,\`idEstablecimiento\`) VALUES ('${horario.dias}', '${horario.horaInicio}', '${horario.horaCierre}', '${idHorario}');`;
      con.query(queryH, (err, row) => {
    	if (err) {
    	  console.log(err);
    	}
    	console.log(row);
	  });
	  console.log(queryH);
    }
    delete req.body.horarios;
    req.body.idHorario = idHorario;
    crud.insert(con, {
    	insertInto: 'ESTABLECIMIENTOS',
    	values: req.body
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.delete('/establecimientos/delete', (req, res) => {
    crud.delete(con, {
      from: 'ESTABLECIMIENTOS',
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.put('/establecimientos/update', (req, res) => {
    crud.update(con, {
      table: 'ESTABLECIMIENTOS',
      values: req.body,
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });
};
