"use strict";
const express = require('express');
const helmet = require('helmet');
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
var cors = require('cors')
app.use(cors())

var request = require("request");
var config = JSON.parse(fs.readFileSync('../gatekeeper/config.json', 'utf-8'));

app.get('/github/:token', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("/github/"+req.params.token)

  var auth = 'Basic ' + Buffer.from(config.oauth_client_id + ':' + config.oauth_client_secret).toString('base64');

  var options = { method: 'GET',
    url: 'https://api.github.com/applications/'+config.oauth_client_id+'/tokens/'+req.params.token,
    headers:
     { 'User-Agent': 'request', Authorization: auth }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    try{
      res.set('Content-Type', 'application/json');
      res.end(body);
    }catch(e){
      console.log(body)
      console.log(e)
    }
  });


});

app.listen(8000);
console.log(`http listening on 8000`);
