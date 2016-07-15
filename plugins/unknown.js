//response to an unrecognized text.
var unknown = function(speaker){

	this.process = function (text) {
		speaker.speak('I am not programmed from this command.');
	}
}

module.exports = unknown;