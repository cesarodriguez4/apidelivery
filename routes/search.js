let sql = require('sql-crud');
let crud = new sql('mysql');

module.exports = (app, con) => {
	app.post('/search', (req, res) => {
    const query = `SELECT DISTINCT *, establ.nombre nombreEstablecimiento, prod.nombre nombreProducto FROM PRODUCTOS prod INNER JOIN ESTABLECIMIENTOS establ ON establ.id = prod.codigoEstablecimiento WHERE prod.nombre LIKE '%${req.body.search}%' OR establ.nombre LIKE '%${req.body.search}%';`;
    console.log(query);
    con.query(query, (error, response) => {
      if (error) {
        res.send(error);
      }
      res.send(response);
    });
  });
};
