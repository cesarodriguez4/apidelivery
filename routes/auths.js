var request = require('request');
const sql  = require('sql-crud');
const crud = new sql("mysql");
var jwt = require('jsonwebtoken');

module.exports = (app, con) => {
  app.post('/auth/facebook', (req, res) => {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
	  code: req.body.code,
	  client_id: req.body.clientId,
	  client_secret: 'fbf5d2bad6b9ba506d4b01b2f662b1d7',
	  redirect_uri: req.body.redirectUri
	};

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }
    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {
      	console.log('en A');
      	console.log(profile);
        crud.select(con, {
        	select: '*',
        	from: 'USUARIOS',
        	where: {email:profile.email}
        }, (err, result) => {
          if (result.length !== 0) {
            var token = jwt.sign({data: profile.email}, app.get('token'), { expiresIn: '24h' });
            console.log({result, token});
            res.send({result, token});
          } else {
            res.status(200).send({error: 'Este usuario no posee cuenta en este sitio.'});
          }
        }, true);
      } else {
        // Step 3. Create a new user account or return an existing one.
        console.log('en B');
        console.log(profile);
        crud.select(con, {
        	select: '*',
        	from: 'USUARIOS',
        	where: {email:profile.email}
        }, (err, result) => {
          if (result.length !== 0) {
            var token = jwt.sign({data: profile.email}, app.get('token'), { expiresIn: '24h' });
            console.log({result, token});
            res.send({result, token});
          } else {
            res.status(200).send({error: 'Este usuario no posee cuenta en este sitio.'});
          }
        }, true);
      }
    });
  });
  });

  app.post('/auth/google', (req, res) => {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: 'L7eM0Jb6iP2Un0atG4oBcKo4',
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
        if (req.header('Authorization')) {
          console.log('en A');
          console.log(profile);
          crud.select(con, {
            select: '*',
            from: 'USUARIOS',
            where: {email:profile.email}
          }, (err, result) => {
            if (result.length !== 0) {
              var token = jwt.sign({data: profile.email}, app.get('token'), { expiresIn: '24h' });
              console.log({result, token});
              res.send({result, token});
            } else {
              res.status(200).send({error: 'Este usuario no posee cuenta en este sitio.'});
            }
          }, true);
        } else {
          // Step 3. Create a new user account or return an existing one.
          console.log('en B');
          console.log(profile);
          crud.select(con, {
            select: '*',
            from: 'USUARIOS',
            where: {email:profile.email}
          }, (err, result) => {
            if (result.length !== 0) {
              var token = jwt.sign({data: profile.email}, app.get('token'), { expiresIn: '24h' });
              console.log({result, token});
              res.send({result, token});
            } else {
              res.status(200).send({error: 'Este usuario no posee cuenta en este sitio.'});
            }
          }, true);
        }
      });
    });
  });
};
