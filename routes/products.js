let sql = require('sql-crud');
let crud = new sql('mysql');
const jwt = require('jsonwebtoken');
let random = require('randomstring');

module.exports = (app, con) => {
	app.get('/products/:cat', (req, res) => {
		const codigoCategoria = req.params.cat;
			crud.select(con,
				{
					select: '*',
					from: 'PRODUCTOS',
					where: {codigoCategoria}
				}, (error, success) => {
					if (error) {
						res.send(error);
					}
					res.send(success);
				}, true);
	});

  app.get('/products/fetch/all', (req, res) => {
    crud.select(con, {
      select: '*',
      from: 'PRODUCTOS'
    }, (error, result) => {
      if (error) {
        res.send(error);
      }
      res.send(result);
    });
  });

	app.get('/products/user/:user', (req, res) => {
		const codigoUsuario = req.params.user;
		const token = req.query.token;
		jwt.verify(token, app.get('token'), (error) => {
			if (error) {
				res.send({error: 'Ha ocurrido un error en la validacion del token'});
			} else {
				crud.select(con,
				{
					select: '*',
					from: 'PRODUCTOS',
					where: {codigoUsuario}
				}, (error, success) => {
					if (error) {
						res.send(error);
					} else {
						res.send(success);	
					}
				}, true);
			}
		});
	});


    app.get('/v2/products/user/:user', (req, res) => {
    const codigoUsuario = req.params.user;
    const token = req.query.token;
    jwt.verify(token, app.get('token'), (error) => {
      if (error) {
        res.send({error: 'Ha ocurrido un error en la validacion del token'});
      } else {
        const query = `SELECT
         PRODUCTOS.id as idProducto,
         PRODUCTOS.nombre as nombreProducto,
         PRODUCTOS.codigoCategoria as codigoCategoria,
         PRODUCTOS.calificacion as calificacionProducto,
         PRODUCTOS.codigoUsuario as codigoUsuario,
         PRODUCTOS.descripcion as descripcionProducto,
         PRODUCTOS.disponible as disponible,
         PRODUCTOS.activo as activoProducto,
         PRODUCTOS.codigoProducto as codigoProducto,
         PRODUCTOS.foto as fotoProducto,
         PRODUCTOS.precio as precioProducto,
         PRODUCTOS.inventario as inventarioProducto,
         PRODUCTOS.codigoEstablecimiento as codigoEstablecimiento,
         PRODUCTOS.vecesOrdenado as vecesOrdenado,
         ESTABLECIMIENTOS.nombre as nombreEstablecimiento,
         CATEGORIAS_ESTABLECIMIENTOS.nombre as nombreCategoria
      FROM PRODUCTOS 
         INNER JOIN ESTABLECIMIENTOS ON 
           ESTABLECIMIENTOS.id = PRODUCTOS.codigoEstablecimiento 
         INNER JOIN CATEGORIAS_ESTABLECIMIENTOS 
           ON CATEGORIAS_ESTABLECIMIENTOS.codigo = PRODUCTOS.codigoCategoria
      WHERE PRODUCTOS.codigoUsuario = '${codigoUsuario}';`;
        console.log(query);
        con.query(query, (err, row) => {
          if (err) {
            res.status(200).send(error);
          } else {
            res.status(200).send(row);
          }
        });
      }
    });
  });

	app.post('/products/new', (req, res) => {
    req.body.codigoProducto = random.generate(12).toUpperCase();
    crud.insert(con, {
    	insertInto: 'PRODUCTOS',
    	values: req.body
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

	app.put('/products/update', (req, res) => {
    crud.update(con, {
      table: 'PRODUCTOS',
      values: req.body,
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.delete('/products/delete', (req, res) => {
    crud.delete(con, {
      from: 'PRODUCTOS',
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.get('/products/bycode/:code', (req, res) => {
    const codigoProducto = req.params.code;
    crud.select(con, {
    	select: '*',
    	from: 'PRODUCTOS',
    	where: {codigoProducto}
    }, (error, result) => {
      if (error) {
      	res.send(error);
      }
      res.send(result);
    }, true);
  });

  app.get('/products/byCatEst/:code', (req, res) => {
    const codigoEstablecimiento = req.params.code;
    crud.select(con, {
      select: '*',
      from: 'PRODUCTOS',
      where: {codigoEstablecimiento}
    }, (error, result) => {
      if (error) {
        res.send(error);
      }
      res.send(result);
    }, true);
  });

  app.get('/maspedidos', (req, res) => {
    const q = 'SELECT * FROM `PRODUCTOS` WHERE `activo` = 1 ORDER BY `vecesOrdenado` DESC LIMIT 10;';
    console.log(q);
    con.query(q, (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result);
    });
  });
};
