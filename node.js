var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var cmd = require('node-cmd');
var sleep = require('sleep');
//npm install request
var request = require('request');
var SpotifyWebApi = require('spotify-web-api-node');
var token;
var id;
var songtime;
// Replace "###...###" below with your project's host, access_key and access_secret.
var defaultOptions = {
  host: 'identify-us-west-2.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type:'audio',
  secure: true,
  access_key: '',
  access_secret: ''
};

function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign(signString, accessSecret) {
  return crypto.createHmac('sha1', accessSecret)
    .update(new Buffer(signString, 'utf-8'))
    .digest().toString('base64');
}

/**
 * Identifies a sample of bytes
 */
function identify(data, options, cb) {

  var current_data = new Date();
  var timestamp = current_data.getTime()/1000;

  var stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp);

  var signature = sign(stringToSign, options.access_secret);

  var formData = {
    sample: data,
    access_key:options.access_key,
    data_type:options.data_type,
    signature_version:options.signature_version,
    signature:signature,
    sample_bytes:data.length,
    timestamp:timestamp,
  }
  request.post({
    url: "http://"+options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}

var bitmap = fs.readFileSync('sample.wav');

identify(new Buffer(bitmap), defaultOptions, function (err, httpResponse, body) {
  if (err) console.log(err);
  console.log(body);
  var obj = JSON.parse(body);
  id = obj.metadata.music[0].external_metadata.spotify.album.id;
  console.log(id);
  var spotifyApi = new SpotifyWebApi({
    clientId : '',
    clientSecret : '',
  });

  // Retrieve an access token
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      //console.log('The access token expires in ' + data.body['expires_in']);
      //console.log('The access token is ' + data.body['access_token']);
      token = data.body['access_token'];
      //console.log(token);
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      setTimeout(function() {
        var curl = "curl -X GET \"https://api.spotify.com/v1/albums/" + id + "\"" + " -H \"Authorization: Bearer " + token + "\"";
        console.log(curl);
        cmd.get(
       curl,
       function(err, data, stderr){
         var obj = JSON.parse(data);
          var link = obj.images[0].url;
          var command = "xdg-open " + link;
          cmd.run(command);
      }
       );
      }, 2000)
    }, function(err) {
      console.log('Something went wrong when retrieving an access token', err.message);
  });
  function applycurl() {

  }

//cmd.run(curl)


});
//sleep.sleep(songtime);
