//this is to find objects asked to remember in rememberlocation.
var recallmy = function(speaker){

	this.process = function (text) {
		speaker.speak(text);
	}
}

module.exports = recallmy;