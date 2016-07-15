var spawn = require('child_process').spawn;
var events = require('events');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var config = require('../config');
var googleSTT = require('../libs/sttGoogle');
var rec;
var audioFileName = 'command.wav';

//MAKE SURE TO INSTALL SOX sudo apt-get install sox
var Listener = function() {
	var self = this; //original "this"
	this.listen = function(){
		self.emit('startListening');

		var cmdArgs = ['-d','-b','16','-c','1','-r','16000', audioFileName,'silence','1','0.1','5%','1','1.0','5%','pad','0.5','0.5'];
		
		rec = spawn('sox', cmdArgs);
		rec.stdout.setEncoding('binary');
		
		rec.stdout.on('data', function (data) {
			console.log('Recording %d bytes', data.length);
		});
		rec.stdout.on('end', function () {
			self.emit('stoppedListening');
			processSTT();
		});
	},
	this.stop = function(){
		if (typeof rec === 'undefined')
			rec.kill(); // Exit the spawned process, exit gracefully
		console.log("Stopped listening.");
		return true;
	},
	processSTT = function() {
		googleSTT.process(audioFileName, function(err, text){
			if (err) self.emit('sstError', err);
	  		self.emit('textReceived',text);
		});
	}
}

util.inherits(Listener, EventEmitter);
module.exports = Listener;