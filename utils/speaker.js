var spawn = require('child_process').spawn;
var events = require('events');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _queue = [];
var _isSpeaking = false;

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

var playSoundUsingFestival = function(self) {
	var message = _queue.shift();
	var voice = "kal_diphone";
	console.log(message);
	var p = spawn('festival', ['--pipe']);
	p.stdin.end('(voice_' + voice + ') (SayText "'+ message +'")');
	p.stdout.on('data', function (data) {
	  console.log('stdout: ' + data);
	});
	p.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});
	p.on('close', function (code) {
		if (code !== 0) {
			console.log('ps process exited with code ' + code);
		}
		if(_queue.length === 0){
			self.emit('stopSpeaking');
			_isSpeaking = false;
			return;
		}
		else {
			playSoundUsingFestival();
		}
	});
}

var playSoundUsingESpeak = function(self) {
	console.log(_queue);
	var message = _queue.shift();
	console.log(_queue);
	console.log(message);
	//male wisper "espeak -s 125 -v en+whisper ''"
	//female "espeak -v en+f5 -s 160 ''"
	//Male "espeak -v en -s 160 ''"
	var cmdArgs = ['-s','160','-v','en+f5', message];
		
	var p = spawn('espeak', cmdArgs);
	//p.stdin.end('(voice_' + voice + ') (SayText "'+ message +'")');
	p.stdout.on('data', function (data) {
	  console.log('stdout: ' + data);
	});
	p.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});
	p.on('close', function (code) {
		if (code !== 0) {
			console.log('ps process exited with code ' + code);
		}
		if(_queue.length === 0){
			self.emit('stopSpeaking');
			_isSpeaking = false;
			return;
		}
		else {
			playSoundUsingESpeak();
		}
	});
}

var Speaker = function() {
	var self = this;
	this.speak = function(message){
		//CREATE A QUEUE (array) TO AVOID RUNNING MULTIPLE MESSAGES AT ONCE.
		_queue.push(message);
		if(!_isSpeaking){
			self.emit('startSpeaking');
			_isSpeaking = true;
			playSoundUsingESpeak(self);
		}
	},
	this.createAudioFile = function (message) {
		var voice = "kal_diphone";
		var fileName = guid() + '.wav';
		var p = spawn(_festivalFilePath, ['--pipe']);
		p.stdin.end('(voice_' + voice + ') (utt.save.wave (SayText "'+ message +'") "' + fileName +'" \'riff)');
		p.stdout.on('data', function (data) {
		  console.log('stdout: ' + data);
		});
		p.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});
		p.on('close', function (code) {
			if (code !== 0) {
				console.log('ps process exited with code ' + code);
			}
			self.emit('audioFileCreated',fileName);
		});
	}
}

util.inherits(Speaker, EventEmitter);
module.exports = Speaker;