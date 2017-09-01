const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes/index');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'todocondelivery.com', 
  port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
    auth: {
        user: 'cuenta@todocondelivery.com',
        pass: 'wO2jv$28'
    }
});

transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Servidor listo para enviar correos electronicos');
   }
});

//user todoc_main
//password sJ3u3q%8

/*var connection = mysql.createConnection({
  host     : 'wftuqljwesiffol6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'qyjpkdhu7j2009zq',
  password : 'dalo41ujnktlkzdm',
  database : 'ul2fiwvka2u6vjr7'
});*/

var connection = mysql.createConnection({
  host     : 'localhost',
  port: '3306',
  user     : 'todoc_main',
  password : 'sJ3u3q%8',
  database : 'todocond_db'
});

connection.connect(function(error) {
  if(error) {
    console.log(error);
  } else {
    console.log('Conectado Exitosamente');
  }
}); 

const app = express();
app.set('view engine', 'pug');
app.set('token', 'sAPk0gxwel');

app.use(cors());
app.options('*', cors());

app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', express.static('dist'));

require('./routes/category.js')(app, connection);
require('./routes/users.js')(app, connection, transporter);
require('./routes/administradores.js')(app, connection);
require('./routes/establecimientos.js')(app, connection);
require('./routes/email')(app, connection, transporter);
require('./routes/documents')(app, connection);
require('./routes/products')(app, connection);
require('./routes/shop-categories')(app, connection);
require('./routes/orders')(app, connection, transporter);
require('./routes/search')(app, connection);
require('./routes/notifications')(app, connection);
require('./routes/auths')(app, connection);
require('./routes/horarios')(app, connection);
require('./routes/mensajes')(app, connection);
require('./routes/permisos')(app, connection);
require('./routes/deudas')(app, connection);
require('./routes/cobros')(app, connection);
require('./routes/promociones')(app, connection);
// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
