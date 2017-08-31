const sql  = require('sql-crud');
const crud = new sql("mysql");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var random = require('randomstring');

module.exports = (app, con, transporter) => {
  app.get('/users', (req, res) => {
    crud.select(con, {select: '*', from: 'USUARIOS'}, (err, rows) => {
      if (err) {
        res.send({error: `Error en consulta: ${err}`});
        return console.log(err);
      }
      return res.send(rows);
    }, 0, 1);
  });
  
  app.put('/users/state', (req, res) => {
    crud.update(con, {
      table  : 'USUARIOS',
      values : req.body,
      where  : {id: req.body.id}
    }, (error, result) => {
      if (error) {
        return res.send(error);
      }
      return res.send(result);
    }, true);
  });

  app.post('/users/new', (req, res) => {
    //Usuario 1: Establecimiento, 0: usuario comun 
    const saltRounds = 10;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
      req.body.codigo = random.generate(12).toUpperCase();
      req.body.password = hash;
          if (req.body.tipo === 1) {
            crud.insert(con,{
              insertInto: 'NOTIFICACIONES',
              values: {
                codigoUSUARIO: req.body.codigo,
                tipo: 'ESTABLECIMIENTO'
             }
            }, 0,true);

            crud.select(con, {
              select: 'email',
              from: 'USUARIOS',
              where: {tipo: 1}
            }, (err, resu) => {
              console.log(resu);
            }, true);
          }
          

        crud.insert(con, {insertInto: 'USUARIOS', values: req.body}, (err, result) => {
          if (err) {
            return res.send("Error: "+ err);
          }
        // crear token de activacion
        const token = jwt.sign({ data: req.body.email}, app.get('token'), { expiresIn: '72h' });
        const user = req.body.email;
        const enlace = `https://todocondelivery.herokuapp.com/activa?t=${token}&u=${user}`;
        const enlacePagina = `http://shop.todocondelivery.com`;

        const bienvenidaUsuario = {
          from: '"todoConDelivery.com" <cuenta@todocondelivery.com>', 
          to: req.body.email,
          subject: 'Bienvenido',
          html: `
           <body>
            <img style="margin-left: 40%" width="250" height="100" src="https://pbs.twimg.com/media/DCV9eGXXkAAf2VY.png">
              <h1 style="background-color: #001357;color: white;font-family: arial;
              padding: 2em;"">
             A sólo a un paso de activar tu cuenta
              </h1>
            <h2>Haz click en el link o cópialo en tu navegador para activar tu perfil</h2>
            <small><strong>nota:</strong> si eres un usuario administrador de tiendas,
            también debes ser aprobado por un supervisor de nuestra página.</small>
            <div><a href="${enlace}">Haz click en este enlace</a> </br></div>
            <div>
            <p>Hola ${req.body.nombre}, 
            gracias por registrarte, solo quedan unos pasos mas
             para que puedas disfrutar de los beneficios que te 
             ofrece www.todocondelivery.com </p> 
             <li>1.- Haz clic en el enlace de confirmación de cuenta que te hemos enviado.</li> 
             <li>2.- Busca el producto que desees adquirir.</li> 
             <li>3.- Agrégalo a tu carrito de compras.</li>
             <li>4.- Revisa tu información y dirección 
             antes de terminar tu pedido.</li> 
             <li>5.- Ponte cómodo mientras esperas.</li>
             <li>6.- Disfruta.</li>
            </div>
           </body>
          ` };

        const bienvenidaTienda = {
          from: '"todoConDelivery.com" <cuenta@todocondelivery.com>', 
          to: req.body.email,
          subject: 'Bienvenido',
          html: `
           <body>
           <img style="margin-left: 40%" width="250" height="100" src="https://pbs.twimg.com/media/DCV9eGXXkAAf2VY.png">
              <h1 style="background-color: #001357;color: white;font-family: arial;
              padding: 2em;"">
             Bienvenido
              </h1>
            <p>Hola
             ${req.body.nombre},
            gracias por registrarte como administrador de
             un establecimiento, estos son los pasos a seguir
              para que puedas registrar tu establecimiento
               y ofrecer tus productos:</p>
               <li>1.- Haz clic en este <a href='${enlace}'>enlace</a> para activar tu cuenta. Luego de eso 
               abre esta <a href='${enlacePagina}'>página</a> para que puedas crear tu establecimiento.</li>
               <li>2.- Ingresa tu usuario y contraseña.</li>
               <li>3.- Dentro de la pagina podrás administrar 
               tus establecimientos, 
               categorías de establecimientos, productos que 
               serán mostrados 
               en la pagina www.todocondelivery.com, ademas podrás revisar 
               todos los pedidos que se realicen a tu establecimiento 
               y las notificaciones que te enviemos.</li>
               <li>4.- Para que tu establecimiento sea 
               visible en la pagina web 
               una vez hayas terminado de registrarlo, 
               ponte en contacto 
               con cualquiera de los siguientes correos electrónicos:</li>
               <ul>aadrianras@todocondelivery.com</ul>
               <ul>msimon@todocondelivery.com</ul>
               <ul>jczamora@todocondelivery.com</ul>
               <p>Gracias por ser parte de la familia todocondelivery.com</p>
               <p>Saludos Cordiales</p>
           </body>
          `
        };

        if (req.body.tipo === 1) {
          transporter.sendMail(bienvenidaTienda, (error, info) => {
            console.log(info);
          });
        } else {
          transporter.sendMail(bienvenidaUsuario, (error, info) => {
            console.log(info);
          });
        }
      }, true);
    });
  });

  app.post('/users/login', (req, res) => {
    req.body.tipo = req.body.tipo || 0;
    crud.select(con,
    {
      select: '*',
      from: 'USUARIOS',
      where: {email: req.body.email, tipo: req.body.tipo, activado: 1, estado: 1}
    }, (err, results) => {
      if (err) {
        return res.send({error: 'Error inesperado: ' + err});
      } else {
        if (results.length > 0) {
          //Existe el email en la base de datos
          bcrypt.compare(req.body.password, results[0].password, function(error, pass) {
            if (error) {
              return res.send({error: 'Error inesperado: ' + error});
            } else {
              if (pass) {
                //Coinciden, generamos token
                var token = jwt.sign({  data: req.body.email}, app.get('token'), { expiresIn: '24h' });
                return res.send({results, token});
              } else {
                return res.send({error: 'Contraseña y/o correo inválidos.'});
              }
            }
          });
        } else {
          res.send({error: 'Este email no se encuentra registrado.'})
        }
      }
    });
  });

  app.post('/users/exist', (req, res) => {
    if (req.body.email) {
      crud.select(con, 
        {
          select: 'email',
          from: 'USUARIOS',
          where: {email: req.body.email, tipo: req.body.tipo}
        },(error, result) => {
          if (error) {
            return res.send(error);
          }
          if (result.length > 0) {
            return res.send(true);
          }
          return res.send(false);
      });
    } else {
      res.send({error: 'Ningun campo email enviado.'});
    }
  });

  app.get('/users/get/:id', (req, res) => {
    const id = req.params.id;
    crud.select(con, {
      select: '*',
      from: 'USUARIOS',
      where: {id}
    }, (err, r) => {
      if (err) {
        res.send(err);
      }
      res.send(r);
    }, true);
  });

  app.put('/users/modify', (req, res) => {
    let tipo = req.body.tipo || 'USUARIOS';
    if (tipo == 1) {
      tipo = 'ADMINISTRADORES';
    } else {
      tipo = 'USUARIOS';
    }
    delete req.body.tipo;
    crud.update(con,
      {
        table: tipo,
        values: req.body,
        where: {email: req.body.email}
      }, (error, response) => {
        if (error) {
          res.send(error);
        }
        res.send(response);
      }, true);
  });

}