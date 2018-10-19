var request = require("request");
var fs = require("fs")
var config = JSON.parse(fs.readFileSync('../gatekeeper/config.json', 'utf-8'));


const THEIRTOKEN = "a857a395abab33c53a4b451e84cf0c0cbf207445"

var auth = 'Basic ' + Buffer.from(config.oauth_client_id + ':' + config.oauth_client_secret).toString('base64');

var options = { method: 'GET',
  url: 'https://api.github.com/applications/'+config.oauth_client_id+'/tokens/'+THEIRTOKEN,
  headers:
   { 'User-Agent': 'request', Authorization: auth }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  try{
    let result = JSON.parse(body)
    console.log(result)
  }catch(e){
    console.log(body)
    console.log(e)
  }
});
