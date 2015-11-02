var express = require('express'),
	app = express();
	request = require('request');
var url  = require('url'),
	path = require('path'),
	apigeeConfig = require('./config/apigee-config.json'),
	webhooksSubs = require('./config/webhooks-subscribers.js')();

app.all('/v1**', function(req, res){
	var url_parts = url.parse(req.url, true);
	req.pipe(request( url.resolve(apigeeConfig.management_server_url, url_parts.path),
			function(error, response, body){
				console.log(body);
				webhooksSubs.resources.forEach(function(resource){ //iterate through each resource under /config/webhooks-subscribers
					var myArray = resource.path.exec(url_parts.pathname);
					if( myArray && (resource.verb === req.method) ) { // match found based on URL and verb! send request to webhook
						console.log(resource.description);
						resource.subscribers.forEach(function(subscriber){ // now find all the subscribers
							var options = { method : subscriber.verb, uri : subscriber.url, headers : subscriber.headers, qs: subscriber.qs ,
								body : 'payload={"channel": "#apigee-webhooks", "username": "webhookbot", "text": ' + JSON.stringify(body) + ', "icon_emoji": ":ghost:"}'
							};
							request(options, //send the request to the subscriber
								function(err, response, body){
									//res.end(body); //we don't care what happens to message sent to the subscriber
								}
							);
						});
					}
				});
				res.end('done');
		} ));
	//res.end('done');
});

app.listen(9000);

// console.log(url_parts.pathname);
// console.log(url_parts)
// /v1/organizations/cs-oauth/apis/slack-webhook-adapter/revisions/1/deployments
//console.log(apigeeConfig.management_server_url + url_parts.path);
//console.log(url.resolve(apigeeConfig.management_server_url, url_parts.path))
//req.pipe(request( url.resolve(apigeeConfig.management_server_url, url_parts.path) )).pipe(res);