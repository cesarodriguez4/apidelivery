var mysql = require('mysql');
var sql = require('../index');

/*
var connection = mysql.createConnection({
  host     : 'gk90usy5ik2otcvi.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'ekk1j4ep3qnun9wm',
  password : 'a8mojldmf0cbr8i6',
  database : 'w7yh7cpln9w2enpc'
});
*/

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'users'
});

var crud = new sql('mysql');
crud.select(connection, {
	select: '*',
	from: 'USUARIOS',
	where: {usuario: 'CXGCQDN'},
	innerJoin: {
		table: ['USUARIOS','ESTABLECIMIENTOS'],
		on: ['USUARIOS.codigo','ESTABLECIMIENTOS.usuario']
	}
}, true);