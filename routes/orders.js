const sql = require('sql-crud');
const crud = new sql("mysql");
let jwt = require('jsonwebtoken');
let random = require('randomstring');

module.exports = (app, con, transporter) => {

    app.get('/orders', (req, res) => {
        let q = `SELECT *, users.email emailVendedor, comp.email emailComprador, establ.nombre nombreEstablecimiento, establ.telefono telefonoEstablecimiento FROM ORDENES ord INNER JOIN ESTABLECIMIENTOS establ ON establ.id = ord.codigoEstablecimiento INNER JOIN USUARIOS users ON users.codigo = ord.codigoVendedor INNER JOIN USUARIOS comp ON comp.codigo = ord.codigoComprador`;
        console.log(q);
        con.query(q, function(error, result) {
            if (error) {
                return res.send(error);
            }
            return res.send(result);
        });
    });

    app.get('/getOrder/code/:code', (req, res) => {
      const q = `SELECT DISTINCT ESTABLECIMIENTOS.nombre 
      as nombreEstablecimiento, ESTABLECIMIENTOS.telefono as 
      telefonoEstablecimiento,
      ESTABLECIMIENTOS.email as emailEstablecimiento,
      ORDENES.estado as estadoOrden,
      ORDENES.codigoOrden as codidoOrden,
      USUARIOS.nombre as nombreUsuario,
      USUARIOS.apellido as apellidoUsuario,
      USUARIOS.telefono as telefonoUsuario,
      USUARIOS.nit as nitUsuario,
      USUARIOS.apellidoNIT as apellidoNIT,
      ORDENES.direccionEntrega as direccionEntrega,
      ORDENES.precioTotal as precioTotal,
      ORDENES.titulo as productosComprados FROM ORDENES 
        INNER JOIN NOTIFICACIONES 
        ON ORDENES.codigoOrden = NOTIFICACIONES.codigoOrden
        INNER JOIN USUARIOS
        ON ORDENES.codigoComprador = USUARIOS.codigo
        INNER JOIN ESTABLECIMIENTOS
        ON ORDENES.codigoVendedor = ESTABLECIMIENTOS.codigo 
        WHERE ORDENES.codigoOrden = '${req.params.code}';`;
        console.log(q);
      con.query(q, (err, resu) => {
            if (err) {
                res.send(err);
            }
            res.send(resu);
        });
    });


    app.get('/reorder/:id', (req, res) => {
        let query = 'INSERT INTO ORDENES (`titulo`, `precioTotal`, `codigoEstablecimiento`, `direccionEntrega`, `fechaPedido`, `codigoVendedor`, `codigoComprador`, `estado`, `codigoOrden`, `comentariosOrden`) SELECT `titulo`, `precioTotal`, `codigoEstablecimiento`,`direccionEntrega`, `fechaPedido`, `codigoVendedor`,`codigoComprador`, `estado`, `codigoOrden`, `comentariosOrden` FROM ORDENES  WHERE id = ';
        query += req.params.id + ';';
        console.log(query);
        con.query(query, (err, r) => {
            if (err) {
                res.send(error);
            }
            res.send(r);
        });
    });

    app.put('/califica', (req, res) => {
        crud.update(con, {
            table: 'ORDENES',
            values: req.body,
            where: {
                codigoOrden: req.body.codigoOrden
            }
        }, (error, result) => {
            if (error) {
                return res.send(error);
            }
            return res.send(result);
        }, true);
    });

    app.post('/order/new', (req, res) => {
        req.body.codigoOrden = random.generate(12).toUpperCase();
        let opciones = {
            from: '"Tu pedido está en proceso" <cuenta@todocondelivery.com>', // sender address
            to: req.body.email,
            subject: `Tu pedido esta en proceso ✔`,
            html: `<img style="margin-left: 40%" width="250" height="100" src="https://pbs.twimg.com/media/DCV9eGXXkAAf2VY.png">
              <h1 style="background-color: #001357;color: white;font-family: arial;
              padding: 2em;"">
             ¡Tu compra está en camino!
        </h1>
        <p>No olvides calificar cómo te fue en la compra. 
        Esto lo puedes hacer en el área de tu perfil.</p>
        `
        };
        transporter.sendMail(opciones, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Correo %s enviado: %s', info.messageId, info.response);
        });

        delete req.body.email;
        crud.insert(con, {
            insertInto: 'NOTIFICACIONES',
            values: {
                codigoEstablecimiento: req.body.codigoEstablecimiento,
                codigoUsuario: req.body.codigoVendedor,
                codigoOrden: req.body.codigoOrden,
                tipo: 'ORDENES'
            }
        }, 0, true);

        crud.insert(con, {
            insertInto: 'ORDENES',
            values: req.body
        }, (error, result) => {
            if (error) {
                return res.send(error);
            }
            return res.send(result);
        }, true);
    });

    app.get('/orders/user/:user', (req, res) => {
        const codigoComprador = req.params.user;
        const token = req.query.token;
        jwt.verify(token, app.get('token'), (error) => {
            if (error) {
                res.send({
                    error: 'Ha ocurrido un error en la validacion del token'
                });
            } else {
                crud.select(con, {
                    select: '*',
                    from: 'ORDENES',
                    where: {
                        codigoComprador
                    }
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


     app.get('/orders/all/', (req, res) => {
                const query = `
                SELECT DISTINCT
                ESTABLECIMIENTOS.nombre as nombreEstablecimiento,
                ESTABLECIMIENTOS.telefono as telefonoEstablecimiento,
                ESTABLECIMIENTOS.email as emailEstablecimiento,
                ORDENES.estado as estadoOrden,
                ORDENES.codigoOrden as codidoOrden,
                USUARIOS.nombre as nombreUsuario,
                USUARIOS.apellido as apellidoUsuario,
                USUARIOS.telefono as telefonoUsuario,
                USUARIOS.nit as nitUsuario,
                USUARIOS.apellidoNIT as apellidoNIT,
                ORDENES.id as idOrden,
                ORDENES.direccionEntrega as direccionEntrega,
                ORDENES.precioTotal as precioTotal,
                ORDENES.titulo as productosComprados
                FROM ORDENES INNER JOIN USUARIOS
                ON USUARIOS.codigo = ORDENES.codigoComprador
                INNER JOIN ESTABLECIMIENTOS
                ON ESTABLECIMIENTOS.id = ORDENES.codigoEstablecimiento`;
        console.log(query);
        con.query(query, (error, result) => {
            if (error) {
                res.send(error);
            }
            res.send(result)
        });
    });

    app.get('/orders/seller/:user', (req, res) => {
        const codigoVendedor = req.params.user;
        const token = req.query.token;
        jwt.verify(token, app.get('token'), (error) => {
            if (error) {
                res.send({
                    error: 'Ha ocurrido un error en la validacion del token'
                });
            } else {
                const query = `
                SELECT DISTINCT
                ESTABLECIMIENTOS.nombre as nombreEstablecimiento,
                ESTABLECIMIENTOS.telefono as telefonoEstablecimiento,
                ESTABLECIMIENTOS.email as emailEstablecimiento,
                ORDENES.estado as estadoOrden,
                ORDENES.codigoOrden as codidoOrden,
                USUARIOS.nombre as nombreUsuario,
                USUARIOS.apellido as apellidoUsuario,
                USUARIOS.telefono as telefonoUsuario,
                USUARIOS.nit as nitUsuario,
                USUARIOS.apellidoNIT as apellidoNIT,
                ORDENES.id as idOrden,
                ORDENES.direccionEntrega as direccionEntrega,
                ORDENES.precioTotal as precioTotal,
                ORDENES.titulo as productosComprados
                FROM ORDENES INNER JOIN USUARIOS
                ON USUARIOS.codigo = ORDENES.codigoComprador
                INNER JOIN ESTABLECIMIENTOS
                ON ESTABLECIMIENTOS.id = ORDENES.codigoEstablecimiento
                WHERE ORDENES.codigoVendedor = '${codigoVendedor}'`;
                console.log(query);
                con.query(query, (error, result) => {
                    if (error) {
                        res.send(error);
                    }
                    res.send(result)
                });
            }
        });
    });
    //Mejorar esto del codigo
    app.post('/countItem', (req, res) => {
        const items = req.body.array;
        for (let x of items) {
            console.log(x);
            crud.select(con, {
                select: 'vecesOrdenado',
                from: 'PRODUCTOS',
                where: {
                    codigoProducto: x
                }
            }, (error, success) => {
                if (error) {
                    console.log(error);
                }
                let vecesOrdenado = success[0].vecesOrdenado;
                console.log('vecesOrdenado');
                console.log(vecesOrdenado);
                vecesOrdenado += 1;
                crud.update(con, {
                    table: 'PRODUCTOS',
                    values: {
                        vecesOrdenado
                    },
                    where: {
                        codigoProducto: x
                    }
                }, false, true);
                console.log('vecesOrdenado', vecesOrdenado);
            });
        }
        res.send('ok');
    });

    app.delete('/orders/delete', (req, res) => {
        crud.delete(con, {
            from: 'ORDENES',
            where: {
                id: req.body.id
            }
        }, (error, result) => {
            if (error) {
                return res.send(error);
            }
            return res.send(result);
        }, true);
    });

    app.put('/orders/update', (req, res) => {
        crud.update(con, {
            table: 'ORDENES',
            values: req.body,
            where: {
                codigoOrden: req.body.codigoOrden
            }
        }, (error, result) => {
            if (error) {
                return res.send(error);
            }
            return res.send(result);
        }, true);
    });

    app.post('/setStars', (req, res) => {
        const calificacion = req.body.calificacion;
        const codigoOrden = req.body.codigoOrden;
        console.info(calificacion);
        console.info(codigoOrden);
        crud.select(con, {
            select: 'idComprados',
            from: 'ORDENES',
            where: {
                codigoOrden
            }
        }, (err, r) => {
            if (err) {
                res.send(err);
            }
            console.info(r);
            const ord = r[0].idComprados;
            const order = ord.split(',');
            console.log(ord);
            console.info(order);
            for (let x of order) {
                console.info('x', x);
                crud.select(con, {
                    select: '*',
                    from: 'ESTABLECIMIENTOS',
                    where: {
                        id: x
                    }
                }, (err, resu) => {
                    if (err) {
                        res.send(err);
                    }
                    const establ = resu[0];
                    console.log(establ);
                    const vecesCalificado = parseFloat(establ.vecesCalificado) + 1;
                    console.log('vecesCalificado');
                    console.log(vecesCalificado);
                    console.log('rep');
                    console.log(establ.reputacion);
                    console.log(calificacion);
                    const reputacion = parseFloat(establ.reputacion) + parseFloat(calificacion) / parseFloat(vecesCalificado);
                    console.log('reputacion');
                    console.log(reputacion);
                    crud.update(con, {
                        table: 'ESTABLECIMIENTOS',
                        values: {
                            vecesCalificado,
                            reputacion
                        },
                        where: {
                            id: x
                        }
                    }, false, true);
                }, true);
            }
            res.send('ok');
        })
    });
};