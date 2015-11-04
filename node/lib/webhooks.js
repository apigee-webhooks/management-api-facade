var url  = require('url'), async =require('async'), request = require('request');

function forEachResource (req, body, resource, callback){ // find if the request matches the resource path expression
					console.log(resource.description);
					var url_parts = url.parse(req.url, true);
					var myArray = resource.path.exec(url_parts.pathname);
					if( myArray && (resource.verb === req.method) ) { // match found based on URL and verb! send request to webhook
						console.log(req.method + ' - ' + resource.description);
						async.map(
							resource.subscribers,
							async.apply ( forEachSubscriber, body ),
							function(err, result){
								console.log( result );
								callback( err, result );
							}
							);
					}else{
						callback( null );
					}
}

function forEachSubscriber (body, subscriber, callback){ // for each subscriber, send a request
	var options = { method : subscriber.verb, uri : subscriber.url, headers : subscriber.headers, qs: subscriber.qs ,
		body : 'payload={"channel": "#apigee-webhooks", "username": "webhookbot", "text": ' + JSON.stringify(body) + ', "icon_emoji": ":ghost:"}'
	};
	request(options, //send the request to the subscriber
		function(err, response, body){
			callback( err, body ); //we don't care what happens to message sent to the subscriber
		}
	);
}

module.exports = {
	forEachResource : forEachResource,
	forEachSubscriber : forEachSubscriber,
}