var SpotifyWebApi = require('spotify-web-api-node');

//var SpotifyWebApi = require("../");

/**
 * This example retrives an access token using the Client Credentials Flow. It's well documented here:
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

/*
 * https://developer.spotify.com/spotify-web-api/using-scopes/
 */

 /**
 * Set the credentials given on Spotify's My Applications page.
 * https://developer.spotify.com/my-applications
 */
var spotifyApi = new SpotifyWebApi({
  clientId : '',
  clientSecret : '',
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
});

/*
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '',
  clientSecret : '',
});

spotifyApi.getAlbums(['631tfYWQsACU5Kmk8dpqli'])
  .then(function(data) {
    console.log('Albums information', data.body);
  }, function(err) {
    console.error(err);
  });
*/

/* curl -X GET "https://api.sotify.com/v1/albums/631tfYWQsACU5Kmk8dpqli" -H "Authorization: Bearer BQCw2Lh05fNz8-t71ay2pJiClrabrqaOnsVkzJjQDGRuQTnFyfNzC6fbQARa78SUk9QrARyQQeO59Vcok74"
*/
