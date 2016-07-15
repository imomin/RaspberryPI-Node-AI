// this is where we keep track of events.
var remembermy = function(speaker){

	this.process = function (text) {
		speaker.speak(text);
	}
}

module.exports = remembermy;