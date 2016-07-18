var greenting = function(speaker){
	this.process = function (text) {
		var ackMessage = ["Yes","How can I help.","What?"];
		var random = Math.floor((Math.random() * ackMessage.length));
		var sayIt = ackMessage[random];
		speaker.speak(sayIt);
	}
}

module.exports = greenting;