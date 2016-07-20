var config = require('../config');
var Listener =  require('./listener.js');
var Speaker = require('./speaker.js');
//var Watcher = require('./watcher.js');
var nlpclassifier = require('../libs/nlpclassifier');
var classifier = new nlpclassifier(config);
var plugins = require('../plugins');
var scheduleTask = require('../libs/scheduleTask').scheduleTaskRunner;

var listener = new Listener();
var speaker = new Speaker();
//var watcher = new Watcher();
var plugin = new plugins(speaker);

var Processor = function() {
	this.startListening = function(){
		this.startCron();
		listener.listen();
	},
	this.stopListening = function () {
		listener.stop();
	},
	this.startCamera = function(){
		//watcher.start();
	},
	this.startCron = function(){
		scheduleTask.initialize();
	},
	this.test = function(){
		this.startCron();
		plugin.handleSchedule('remind me to go to sleep in 1 minute');
	}
}

function processText(text){
	//figure out what is the user asking to do.
	if(typeof(text) ==='undfined' || text === null || !text || text.length < 1) {
		speaker.speak("I'm sorry, there seems to be a problem.");
		return;
	}
	var context = classifier.getContext(text);
	console.log('context ---> ' + context);
	switch(context) {
		case 'greeting':
			plugin.handleGreeting(text);
			break;
		case 'schedule':
			plugin.handleSchedule(text);
			break;
		case 'remembermy':
			plugin.handleRemembermy(text);
			break;
		case 'recallmy':
			plugin.handleRecallmy(text);
			break;
		case 'finder':
			plugin.handleFinder(text);
			break;
		default:
			plugin.handleUnknown(text);
	}
}


//EVENTS
listener.on('startListening', function() {
    console.log("listening...");
	console.log("Say '" + config.aiName + "'.");
});

listener.on('stoppedListening', function() {
    console.log('End Recording');
});

listener.on('sstError', function(err) {
    console.log(err);
});

listener.on('textReceived', function(text) {
	console.log('textReceived ---> ' + text);
    processText(text);
});

speaker.on('stopSpeaking', function(){
	listener.listen();
});

// watcher.on('liveStream', function(image){
// 	console.log(image);
// });


module.exports = Processor;