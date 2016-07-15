// this is where we keep track of events.
var schedule = function(speaker){

	this.process = function (text) {
		speaker.speak(text);
	}
}

module.exports = schedule;