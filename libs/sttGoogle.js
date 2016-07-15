var fs = require('fs');
var request = require('request');
var config = require('../config');
var googleSpeach = {
	process:function(audioFileName, callback){
		console.log("processing...");
		fs.readFile(audioFileName, function (err, data) {
		  	if (err) return callback(err);
		  
		  request.post({body: data, headers: {'Content-Type': 'audio/l16; rate=16000'}, url:'https://www.google.com/speech-api/v2/recognize?client=chromium&xjerr=1&pfilter=1&output=json&maxResults=1&lang=en-us&key='+config.googleAPIKey},
		    function (err, res, body) {
		      if (err) 
		      	return callback(err);

		      if(res.statusCode !== 200) {
		      	return callback(body);
		      }

		      try {
		      	body = body.split('\n')[1];
		      	var response = JSON.parse(body);
		      	if(response.result.length > 0){
					var text = response.result[response.result_index].alternative[0].transcript;		
				}
				else {
					var text = null;
				}
		      	return callback(null, text);
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

module.exports = googleSpeach;