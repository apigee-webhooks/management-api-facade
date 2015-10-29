var express = require('express'),
	app = express();
	request = require('request');
var url  = require('url'), path = require('path');

app.all('/v1**', function(req, res){
	//console.log(req);
	var url_parts = url.parse(req.url, true);
	console.log(url_parts.pathname);
	// /v1/organizations/cs-oauth/apis/slack-webhook-adapter/revisions/1/deployments
	req.pipe(request( "https://api.enterprise.apigee.com" + url_parts.pathname )).pipe(res);
	//res.end('done');
})

// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/forecastweather_node/:woeid', forecastweather_node.get)
app.listen(9000);