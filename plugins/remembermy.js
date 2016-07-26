var nplRememberMy = require('../libs/nlpRememberMy');
var db = require('../database');
var co = require('co');

var remembermy = function(speaker){
	this.process = function (text) {
		var data = nplRememberMy.process(text);
		co(function*() {
			return yield db.addRememberObject('rememberstuff',data)
		}).then(function (value) {
		    speaker.speak('Got it!');
		}, function (err) {
			speaker.speak('Due to technical error, I cannot remember your command.');	
			console.log(err);
		});
	}
}
module.exports = remembermy;
