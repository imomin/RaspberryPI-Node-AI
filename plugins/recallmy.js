//this is to find objects asked to remember in rememberlocation.
var nlpRecallMy = require('../libs/nlpRecallMy');
var db = require('../database');
var co = require('co');

var recallmy = function(speaker){
	this.process = function (text) {
		var self = this;
		self.parsedData = nlpRecallMy.process(text);
		var query = {'object':self.parsedData.object, 'owner':self.parsedData.owner};
		co(function*() {
			return yield db.findMyObject('rememberstuff',query, function(err, data) {
				if(err){
					console.log(err);
				}
				if(data){
					var text = data.utterance.replace('remember','').replace('my', 'your');
					speaker.speak(text);
				} else {
					var text = 'I don\'t know where ' + self.parsedData.relationalObject.replace('my', 'your') + ' ' + self.parsedData.verb+'.';
					speaker.speak(text);
				}
			});
		});
	}
}
module.exports = recallmy;
