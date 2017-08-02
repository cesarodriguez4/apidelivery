const sql  = require('sql-crud');
const crud = new sql("mysql");

var random = require('randomstring');

module.exports = (app, con) => {

  app.get('/categories', (req, res) => {
    crud.select(con, {select: '*', from: 'CATEGORIAS'}, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
      	return console.log(err);
      }
      return res.send(rows);
    }, 0, 1);
  });

  app.get('/sub-categories', (req, res) => {
    con.query("SELECT cat.codigo code_cat, subcat.id code_sub, cat.nombre cat_name, subcat.nombre sub_name  FROM CATEGORIAS cat INNER JOIN SUBCATEGORIAS subcat ON subcat.categoria = cat.codigo", function(error, result) {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    });
  });

  app.get('/subcategories', (req, res) => {
    crud.select(con, {select: '*', from: 'SUBCATEGORIAS'}, (err, result) => {
      if (err) {
        res.send(err);
      }
      res.send(result);
    }, true);
  });

  app.get('/sub-categories/:cat', (req, res) => {
    let categoria = req.params.cat;
    crud.select(con, {
      select: '*',
      from: 'SUBCATEGORIAS',
      where: {categoria}
    }, (error, response) => {
      if (error) {
        res.send(error);
      }
      res.send(response);
    }, true);
  });

  app.post('/sub-categories/new', (req, res) => {
    req.body.codigo = random.generate(12).toUpperCase();
    req.body.ruta = req.body.nombre.split(' ').join('-').toLowerCase();
    crud.insert(con, {
      insertInto: 'SUBCATEGORIAS',
      values: req.body
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.post('/categories/new', (req, res) => {
    req.body.codigo = random.generate(12).toUpperCase();
    req.body.ruta = req.body.nombre.split(' ').join('-').toLowerCase();
    crud.insert(con, {
    	insertInto: 'CATEGORIAS',
    	values: req.body
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.delete('/sub-categories/delete', (req, res) => {
    crud.delete(con, {
      from: 'SUBCATEGORIAS',
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.put('/categories/update', (req, res) => {
    crud.update(con, {
      table: 'CATEGORIAS',
      values: req.body,
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.put('/sub-categories/update', (req, res) => {
    crud.update(con, {
      table: 'SUBCATEGORIAS',
      values: req.body,
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.delete('/categories/delete', (req, res) => {
    crud.delete(con, {
      from: 'CATEGORIAS',
      where: {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });
};
