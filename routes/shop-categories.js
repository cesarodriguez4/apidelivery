const sql  = require('sql-crud');
const crud = new sql("mysql");

var random = require('randomstring');

module.exports = (app, con) => {


  app.post('/shop-category', (req, res) => {
    let codigo_usuario = req.body.codigo_usuario;
    let q = `SELECT cat.codigo code_cat, establ.nombre establ_nombre, establ.codigo establ_codigo, establ.id establ_id, cat.id id_cat, cat.nombre cat_name FROM CATEGORIAS_ESTABLECIMIENTOS cat INNER JOIN ESTABLECIMIENTOS establ ON establ.id = cat.codigo_establecimiento WHERE cat.codigo_usuario = '${codigo_usuario}'`;
    console.log(q);
    con.query(q, function(error, result) {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    });
  });

  /*app.post('/shop-category/codeByEstablishments', (req, res) => {
    let id = req.body.id;
    let q  = `SELECT * FROM CATEGORIAS_ESTABLECIMIENTOS WHERE codigo_establecimiento = '${id}'`;
    console.log(q);
    con.query(q, function(error, result) {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    });
  });*/

  app.get('/shop-subcategory/:code', (req, res) => {
    const subcategoria = req.params.code;
    crud.select(con,
      {
        select: '*',
        from: 'ESTABLECIMIENTOS',
        where: {subcategoria}
      }, (error, success) => {
        if (error) {
          res.send(error);
        }
        res.send(success);
      }, true);
  });

  app.get('/shop-category/byCode/:code', (req, res) => {
		const codigo_establecimiento = req.params.code;
    crud.select(con,
      {
        select: '*',
        from: 'CATEGORIAS_ESTABLECIMIENTOS',
        where: {codigo_establecimiento}
      }, (error, success) => {
        if (error) {
          res.send(error);
        }
        res.send(success);
      }, true);
	});

  app.post('/shop-category/new', (req, res) => {
    req.body.codigo = random.generate(12).toUpperCase();
    req.body.ruta = req.body.nombre.split(' ').join('-').toLowerCase();
    crud.insert(con, {
    	insertInto: 'CATEGORIAS_ESTABLECIMIENTOS',
    	values: req.body
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.delete('/shop-category/delete', (req, res) => {
    crud.delete(con, {
      from: 'CATEGORIAS_ESTABLECIMIENTOS',
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.put('/shop-category/update', (req, res) => {
    crud.update(con, {
      table: 'CATEGORIAS_ESTABLECIMIENTOS',
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
