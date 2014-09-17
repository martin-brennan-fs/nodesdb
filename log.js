var AWS = require('aws-sdk');
var _   = require('underscore');
var sdb = new AWS.SimpleDB({ region: 'ap-southeast-2' });
require('colors');

// Split args.
var args = process.argv.slice(2);

// Set defaults for undefined ars.
if (args[0] == undefined) { args[0] = "connect" }; // default domain
if (args[1] == undefined) { args[1] = 10 }; // default limit

// Set up the select expression.
var params = {
	SelectExpression: "SELECT * FROM " + args[0] + " WHERE timestamp IS NOT NULL ORDER BY timestamp DESC LIMIT " + args[1]
}

// Run the simpleDB query.
sdb.select(params, function (error, data) {

	// Output any errors.
	if (error != null) {
		console.log(error);
	} else {
		console.log('----------------------------------');

		// Loop through all of the items and output the log message.
		for(var i = 0; i < data.Items.length; i++) {

			// Get the required properties from the attributes.
			var attr = data.Items[i].Attributes;
			var timestamp = _.where(attr, { Name: "timestamp" })[0].Value;
			var status = _.where(attr, { Name: "status" })[0].Value;
			var message = _.where(attr, { Name: "message" })[0].Value;

			// Change the color of the status output depending on status.
			switch(status) {
				case "INFO":
					status = status.blue;
				break;
				case "ERROR":
					status = status.red;
				break;
				case "SUCCESS":
					status = status.green;
				break;
				case "WARN":
					status = status.yellow;
				break;
			}

			// Bold the timestamp.
			timestamp = ("[" + timestamp + "] ").bold

			// Output the messages.
			console.log(timestamp + status);
			console.log(message);
			console.log('----------------------------------');
		}
	}
})