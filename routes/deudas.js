const sql  = require('sql-crud');
const crud = new sql("mysql");

module.exports = (app, con) => {
	app.get('/deudas', (req, res) => {
	  const curDate = new Date();

	 function monthDiff(d1, d2) {
	  let months;
	  months = (d2.getFullYear() - d1.getFullYear()) * 12;
	  months += d2.getMonth() - d1.getMonth();
	  return months;
	}

      crud.select(con, {
      	select: '*',
      	from: 'ESTABLECIMIENTOS'
      }, (err, row) => {
        if (err) {
        	res.send(err);
        }
        let response = [];
        for (let est of row) {
          const vence = new Date(est.ultimoPago);
          if ((monthDiff(vence, curDate)) > 0) {
            response.push(est);
          }
        }
        setTimeout(()=> {
          res.send(response);
        }, 1000);
      });
	});

  app.put('/deudas/act', (req, res) => {
    const ultimoPago = new Date();
    crud.update(con,{
      table: 'ESTABLECIMIENTOS',
      values: {ultimoPago},
      where: {id: req.body.id}
    }, (err, row) => {
      if (err) {
        res.send(err);
      }
      res.send({success: 'Se ha actualizado con exito.'});
    }, true);
  });
}