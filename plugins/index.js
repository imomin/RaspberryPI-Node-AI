var Finder =  require('./finder');
var Greeting =  require('./greeting');
var Schedule =  require('./schedule');
var Remembermy =  require('./remembermy');
var Recallmy =  require('./recallmy');
var Unknown =  require('./unknown');

var plugins = function (speaker) {
	finder = new Finder(speaker);
	greeting = new Greeting(speaker);
	schedule = new Schedule(speaker);
	remembermy = new Remembermy(speaker);
	recallmy = new Recallmy(speaker);
	unknown = new Unknown(speaker);

	this.handleGreeting = function(text){
		greeting.process(text);
	},
	this.handleSchedule = function(text){
		schedule.process(text);
	},
	this.handleRemembermy = function(text){
		remembermy.process(text);	
	},
	this.handleRecallmy = function(text){
		recallmy.process(text);
	},
	this.handleFinder = function(text){
		finder.process(text);
	},
	this.handleUnknown = function(text){
		unknown.process(text);
	}
}

module.exports = plugins;