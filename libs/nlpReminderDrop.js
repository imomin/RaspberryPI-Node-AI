var request = require('request');
var nplReminderDrop = {
  	process:function (text, callback) {
		request.get('http://www.reminderdrop.com/api/'+text+'/America/Chicago', function (error, response, body) {
			callback(error, JSON.parse(body));
		});
  	}
}

module.exports = nplReminderDrop;