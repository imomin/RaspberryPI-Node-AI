var spawn = require('child_process').spawn;
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var dbImgClassifier = function() {
	var self = this;
	this.process = function(imageFile){
		console.log("processing image...");
		imageFile = imageFile ? imageFile : 'data/dog.jpg';
		//./jpcnn -i data/dog.jpg -n ./networks/jetpac.ntwk -t -m s
		var cmdArgs = ['-i',imageFile,'-n','./networks/jetpac.ntwk', '-t','-m','s'];
		
		var p = spawn('./jpcnn', cmdArgs);
		//p.stdout.setEncoding('binary');
		p.stdout.on('data', function (data) {
			data = '{\'score\':' + data.toString();
			data = data.replace(/[\t]/g, ",'label':'");
			data = data.replace(/[\n\r]/g, "'},{'score':");
			data = data.slice(0,-10);
			data = '['+data+']';
			//console.log(data);
			self.emit('imageClassifed', data);
		});
		p.stderr.on('data', function (data) {
			//console.log('stderr: ' + data);
		});
		p.on('close', function (code) {
			if (code !== 0) {
				console.log('ps process exited with code ' + code);
			}
			return;
		});
	}
};
util.inherits(dbImgClassifier, EventEmitter);
module.exports = dbImgClassifier;