/***********************************************************************************************************
* Name: Webhook API Facade Instrumentation Pattern
* Purpose: This Webhook Facade provides the instrumentation to send requests to the original backend AS IS
* while augmenting its capabilities.
***********************************************************************************************************/

var express = require('express'), app = express(), request = require('request');
var url  = require('url'), path = require('path'), apigeeConfig = require('./config/apigee-config.json'),
	webhooksSubs = require('./config/webhooks-subscribers.json'), async =require('async'), webHooks = require('./lib/webhooks');

app.all('/v1/**', function(req, res){ //listen all requests to /v1/**
	var body_;
	var url_parts = url.parse(req.url, true);
	var p = req.pipe(request( url.resolve(apigeeConfig.management_server_url, url_parts.path), function(error, responseMgmt, body){
		body_ = body;
	} )).pipe( res );
	p.on('finish', function() { // execute after response is sent to the client
		function send( body ){
			async.map(
				webhooksSubs.resources, //iterate through each resource under /config/webhooks-subscribers
				async.apply( webHooks.forEachResource, req, body_ ),
				function(err, result){
					console.log(result);
					return(body);
				}
			 )
		};
		send(body_);
	});
});

app.listen(9000);