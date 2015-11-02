module.exports = function(){
	return {"resources" : [
		{
			"path" : /\/v1\/o\/(?:.*?)\/(?:apis)\/(?:.*?)\/(?:revisions)\/\d*\/(?:deployments)/, //this regex will match /v1/o/cs-oauth/apis/sample-api/revisions/1/deployments
			//curl http://localhost:9000/v1/o/cs-oauth/apis/sample-api/revisions/1/deployments -v -u $ae_username:$ae_password
			"description" : "Get all deployment info of sample-api proxy",
			"verb" : "GET",
			"subscribers" : [
				{
					"name" : "Slack Apigee-Webhook",
					"desription" : "Incoming Webhook for apigee-webhook channel",
					"url" : "https://hooks.slack.com/services/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",
					"verb" : "POST",
					"headers" : { "Content-Type" : "application/x-www-form-urlencoded" },
					"qs" : null
				}
			]
		},
		{
			"path" : /\/v1\/o\/(?:.*?)\/(?:environments|e)\/(?:.*?)\/(?:apis)\/(?:.*?)\/(?:revisions)\/\d*\/(?:deployments)/, //this regex will match /v1/o/cs-oauth/e/test/apis/sample-api2/revisions/1222/deployments
			//curl -X DELETE http://localhost:9000/v1/o/cs-oauth/e/test/apis/sample-api2/revisions/12/deployments\?override\=true\&delay\=10 -d '{}' -u $ae_username:$ae_password
			"description" : "Delete deployments of an api proxy",
			"verb" : "DELETE",
			"subscribers" : [
				{
					"name" : "Slack Apigee-Webhook",
					"desription" : "Incoming Webhook for apigee-webhook channel",
					"url" : "https://hooks.slack.com/services/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",
					"verb" : "POST",
					"headers" : { "Content-Type" : "application/x-www-form-urlencoded" },
					"qs" : null
				}
			]
		},
		{
			"path" : /\/v1\/o\/(?:.*?)\/(?:apis)$/, //this regex will match e.g. /v1/o/cs-oauth/apis?action=import&name=sample-api2
			//curl -X POST -F "file=@sample-api2.zip" "http://localhost:9000/v1/o/cs-oauth/apis?action=import&name=sample-api2" -u $ae_username:$ae_password
			"description" : "Imports a bundle of an api proxy",
			"verb" : "POST",
			"subscribers" : [
				{
					"name" : "Slack Apigee-Webhook",
					"desription" : "Incoming Webhook for apigee-webhook channel",
					"url" : "https://hooks.slack.com/services/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",
					"verb" : "POST",
					"headers" : { "Content-Type" : "application/x-www-form-urlencoded" },
					"qs" : null
				}
			]
		},
		{
			"path" : /\/v1\/o\/(?:.*?)\/(?:apis)\/(?:.*?)\/(?:revisions)\/\d*\/(?:deployments)/, //this regex will match /v1/o/cs-oauth/apis/sample-api/revisions/1/deployments

			"description" : "Deploys a revision of an api proxy",
			"verb" : "POST",
			"subscribers" : [
				{
					"name" : "Slack Apigee-Webhook",
					"desription" : "Incoming Webhook for apigee-webhook channel",
					"url" : "https://hooks.slack.com/services/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",
					"verb" : "POST",
					"headers" : { "Content-Type" : "application/x-www-form-urlencoded" },
					"qs" : null
				}
			]
		}
	]}
}