var greenting = function(speaker){
	this.process = function (text) {
		var ackMessage = ["Yes","How can I help."];
		var random = Math.floor((Math.random() * ackMessage.length) + 1);
		var sayIt = ackMessage[random];
		speaker.speak(sayIt);
	}
}

module.exports = greenting;