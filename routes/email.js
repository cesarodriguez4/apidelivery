const sql = require('sql-crud');
let crud = new sql('mysql');
let jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

module.exports = (app, con, transporter) => {

  app.post('/resetPassword', (req, res) => {
    crud.select(con,
    	{
    		select: '*',
    		from: 'USUARIOS',
    		where: {email: req.body.email}
    	}, (error, result) => {
          if (error) {
          	return res.send(error);
          }
            if (result.length > 0) {
            const token = jwt.sign({ data: req.body.email}, app.get('token'), { expiresIn: '24h' });
            const email = req.body.email;
            const enlace = `http://todocondelivery.com/setPassword?t=${token}&u=${email}`;
            let opciones = {
				    from: '"Recuperacion de cuenta" <cuenta@todocondelivery.com>', // sender address
				    to: req.body.email,
				    subject: `Recuperar contraseña ✔`,
				    html: 
            `<img style="margin-left: 40%" width="250" height="100" src="https://pbs.twimg.com/media/DCV9eGXXkAAf2VY.png">
              <h1 style="background-color: #001357;color: white;font-family: arial;
              padding: 2em;"">
              Sigue el siguiente enlace para cambiar tu contraseña
            </h1>
            <h2 style="background-color: red;padding: 2em;text-align: center;">
            <a style="color: white" href="${enlace}">Enlace</a></h2>
            `
				};
            	transporter.sendMail(opciones, (error, info) => {
				    if (error) {
				        return console.log(error);
				    }
				    console.log('Correo %s enviado: %s', info.messageId, info.response);
				});
				res.send("ok");
            } else {
            	res.send({error: 'Este correo no existe.'})
            }
    	}, true);
  });


  app.post('/resetPassword/admin', (req, res) => {
    crud.select(con,
      {
        select: '*',
        from: 'ADMINISTRADORES',
        where: {email: req.body.email}
      }, (error, result) => {
          if (error) {
            return res.send(error);
          }
            if (result.length > 0) {
            const token = jwt.sign({ data: req.body.email}, app.get('token'), { expiresIn: '24h' });
            const email = req.body.email;
            const enlace = `https://todocondelivery.herokuapp.com/setPassword?t=${token}&u=${email}`;
            let opciones = {
            from: '"Recuperacion de cuenta" <cuenta@todocondelivery.com>', // sender address
            to: req.body.email,
            subject: `Recuperar contraseña ✔`,
            html: 
            `<h1>
              Sigue el siguiente enlace para cambiar tu passworrd
            </h1>
            <a href="${enlace}">Enlace</a>
            `
        };
              transporter.sendMail(opciones, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Correo %s enviado: %s', info.messageId, info.response);
        });
        res.send("ok");
            } else {
              res.send({error: 'Este correo no existe.'})
            }
      }, true);
  });

  app.get('/applyReset/:token/:email/:password/:tipo', (req, res) => {
    const token = req.params.token;
    const email = req.params.email;
    const password = req.params.password;
    const tipo = req.params.tipo || 0;
    const saltRounds = 10;
    let tabla = 'USUARIOS';
    if (tipo == 1) {
      tabla = 'ADMINISTRADORES'
    } 

    jwt.verify(token, app.get('token'), (error, success) => {
      if (error) {
        return res.send('Error en proceso. key inválida');
      }
      bcrypt.hash(password, saltRounds, (err, hash) => { 
        if (err) {
          res.send('Error almacenando password, intenta mas tarde');
        }
        crud.update(con, {
          table: tabla,
          values: {password: hash}, 
          where: {email}
        }, (error, exito) => {
          if (error) {
            return res.send(error);
          }
          return res.send('Cambio exitoso. Inicia sesión en todocondelivery.com');
        }, true);
      });
    });

  });


  app.post('/chat', (req, res) => {
    let opciones = {
      from: '"Soporte" <cuenta@todocondelivery.com>', // sender address
      to: req.body.email,
      subject: `Tu consulta se ha creado correctamente`,
      html: 
       `<img style="margin-left: 40%" width="250" height="100" src="https://pbs.twimg.com/media/DCV9eGXXkAAf2VY.png">
          <h1 style="background-color: #001357;color: white;font-family: arial;
          padding: 2em;"">
          Tu mensaje se ha enviado correctamente.
        </h1>
        <p>En las proximas 24 horas antenderemos tu consulta</p>
        <p>todocondelivery.com</p>
        `
    };
    transporter.sendMail(opciones, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Correo %s enviado: %s', info.messageId, info.response);
    });

    crud.insert(con, {
      insertInto: 'MENSAJES',
      values: req.body
    }, false, true);
    res.send('ok');
  });

  app.get('/activa', (req, res) => {
    const token = req.query.t;
    console.log(token);
    jwt.verify(token, app.get('token'), (error, success) => {
      if (error) {
        return res.send('Error en activación. Llave inválida');
      }
      crud.update(con, {
        table: 'USUARIOS',
        values: {activado: 1}, 
        where: {email: req.query.u}
      }, (error, exito) => {
        if (error) {
          return res.send(error);
        }
        return res.send('Activación exitosa. Inicia sesión en todocondelivery.com');
      }, true);
    });
  });
};
