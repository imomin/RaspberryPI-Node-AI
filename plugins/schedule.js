// this is where we keep track of events.
var nplReminder = require('../libs/nlpReminder');
var scheduler = require('../libs/scheduleTask').scheduleTask;

var schedule = function(speaker){

	this.process = function (text) {
		var data = nplReminder.process(text);
		scheduler.add(data, function(err, obj){
			if(err) {
				speaker.speak('Due to technical error, reminder not set.');	
				console.log(err);
			}
			speaker.speak('Reminder set for ' + data.body);
		})
	}
}

module.exports = schedule;