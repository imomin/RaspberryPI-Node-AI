var fs = require('fs');
var request = require('request');
var config = require('../config');
var witstt = {
	process:function(audioFileName, callback){
		console.log("processing...");
		fs.readFile(audioFileName, function (err, data) {
		  if (err) return callback(err);
		  request.post({
		  	body: data, 
		  	headers: {
			  		'Accept':'application/vnd.wit.20160202+json',
			  		'Authorization':'Bearer ' + config.witAPIKey,
			  		'Content-Type':'audio/wav'
		  		}, 
		  		url: 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json'
		  	},

		    function (err, res, body) {
		      	  if (err) return callback(err);

			      try {
			      	return callback(null,JSON.parse(body));
			      }
			      catch (e) {
			        return callback(e);
			      }
			      finally {
			        fs.unlink(audioFileName);
			      }
		  });
		});
	}
};

module.exports = witstt;