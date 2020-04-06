// require('dotenv').config();
// var Twitter = require('twitter');
var formdata = new FormData();
formdata.append('grant_type', 'client_credentials');

var requestOptions = {
	method: 'POST',
	body: formdata,
	redirect: 'follow'
};

fetch('https://api.twitter.com/oauth2/token', requestOptions)
	.then((response) => response.text())
	.then((result) => console.log(result))
	.catch((error) => console.log('error', error));
// var client = new Twitter({
// 	consumer_key: 'process.env.API_KEY_TWITTER_CONSUMER_KEY',
// 	consumer_secret: 'process.env.API_KEY_TWITTER_CONSUMER_SECRET',
// 	bearer_token: 'process.env.API_KEY_TWITTER_TOKEN_BEARER'
// });

// var params = { screen_name: 'nodejs' };
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
// 	if (!error) {
// 		console.log(tweets);
// 	}
// });
