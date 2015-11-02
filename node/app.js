var express = require('express'),
	app = express();
	request = require('request');
var url  = require('url'),
	path = require('path'),
	apigeeConfig = require('./config/apigee-config.json'),
	webhooksSubs = require('./config/webhooks-subscribers.js')(),
	async =require('async');

app.all('/v1**', function(req, res){
	var url_parts = url.parse(req.url, true);
	req.pipe(request( url.resolve(apigeeConfig.management_server_url, url_parts.path),
		function(error, responseMgmt, body){
			console.log( body );
			async.map(
				webhooksSubs.resources, //iterate through each resource under /config/webhooks-subscribers
				function(resource, callback){
					console.log(resource.description);
					var myArray = resource.path.exec(url_parts.pathname);
					if( myArray && (resource.verb === req.method) ) { // match found based on URL and verb! send request to webhook
						console.log(req.method + ' - ' + resource.description);
						async.map(
							resource.subscribers,
							function(subscriber, callback){
								var options = { method : subscriber.verb, uri : subscriber.url, headers : subscriber.headers, qs: subscriber.qs ,
									body : 'payload={"channel": "#apigee-webhooks", "username": "webhookbot", "text": ' + JSON.stringify(body) + ', "icon_emoji": ":ghost:"}'
								};
								request(options, //send the request to the subscriber
									function(err, response, body){
										callback( err, body ); //we don't care what happens to message sent to the subscriber
									}
								);
							},
							function(err, result){
								console.log( result );
								callback( err, result );
							}
							);
					}else{
						callback( null );
					}
				},
				function(err, result){
					console.log(result);
					return(responseMgmt);
				}
			 )
		} )).pipe( res );
});

app.listen(9000);

// console.log(url_parts.pathname);
// console.log(url_parts)
// /v1/organizations/cs-oauth/apis/slack-webhook-adapter/revisions/1/deployments
//console.log(apigeeConfig.management_server_url + url_parts.path);
//console.log(url.resolve(apigeeConfig.management_server_url, url_parts.path))
//req.pipe(request( url.resolve(apigeeConfig.management_server_url, url_parts.path) )).pipe(res);

				// webhooksSubs.resources.forEach(function(resource){ //iterate through each resource under /config/webhooks-subscribers
				// 	var myArray = resource.path.exec(url_parts.pathname);
				// 	if( myArray && (resource.verb === req.method) ) { // match found based on URL and verb! send request to webhook
				// 		console.log(resource.description);
				// 		resource.subscribers.forEach(function(subscriber){ // now find all the subscribers
				// 			var options = { method : subscriber.verb, uri : subscriber.url, headers : subscriber.headers, qs: subscriber.qs ,
				// 				body : 'payload={"channel": "#apigee-webhooks", "username": "webhookbot", "text": ' + JSON.stringify(body) + ', "icon_emoji": ":ghost:"}'
				// 			};
				// 			request(options, //send the request to the subscriber
				// 				function(err, response, body){
				// 					//res.end(body); //we don't care what happens to message sent to the subscriber
				// 				}
				// 			);
				// 		});
				// 	}
				// });