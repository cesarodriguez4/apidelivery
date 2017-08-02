let sql = require('sql-crud');
let crud = new sql('mysql');
module.exports = (app, con) => {
	app.put('/documents/upload', (req, res) => {
		crud.update(con, {
			table:'DOCUMENTOS',
			values: {contenido: req.body.contenido},
			where:{ruta: req.body.ruta}
		}, (error, response) => {
			if (error) {
				res.send(error);
			}
			res.send(response);
		}, true);
	});
	app.get('/documents/:doc', (req, res) => {
      const doc = req.params.doc;
      crud.select(con, {
      	select: '*',
      	from: 'DOCUMENTOS',
      	where: {ruta: doc}
      }, (error, success) => {
        if (error) {
        	res.send(error);
        }
        res.send(success);
      }, true);
	});
}