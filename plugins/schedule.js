// this is where we keep track of events.
var nlpReminder = require('../libs/nlpReminderDrop');
var scheduler = require('../libs/scheduleTask').scheduleTask;

var schedule = function(speaker){

	this.process = function (text) {
		nlpReminder.process(text, function (err, data) {
			scheduler.add(data, function(err, obj){
				if(err) {
					speaker.speak('Due to technical error, reminder not set.');	
					console.log(err);
				}
				speaker.speak('Reminder set!');
			})
		});
	}
}

module.exports = schedule;
