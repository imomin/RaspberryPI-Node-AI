var config = require('../config');
var Listener =  require('./listener.js');
var Speaker = require('./speaker.js');
var nlpclassifier = require('../libs/nlpclassifier');
var classifier = new nlpclassifier(config);
var plugins = require('../plugins');

var listener = new Listener();
var speaker = new Speaker();
var plugin = new plugins(speaker);

var Processor = function() {
	this.startListening = function(){
		listener.listen();
	},
	this.stopListening = function () {
		listener.stop();
	},
	this.testContext = function(text) {
		processText(text);
	}
}

function processText(text){
	//figure out what is the user asking to do.

	if(!text && text === null) {
		speaker.speak("I'm sorry, there seems to be a problem.");
		return;
	}
	var context = classifier.getContext(text);
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
})

module.exports = Processor;