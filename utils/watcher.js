var deepBeliefClassifer = require('../libs/deepBelief/imgClassifier');
var cv = require('opencv');
var pyCamCode = require('../libs/pyCamCode');
var imgClassifer = new deepBeliefClassifer();
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Watcher = function() {
	var self = this;
	this.start = function(){
		var webcam = new pyCamCode.webcam({
		    port: 8090
		});
		webcam.frame(function (image) {
		    // image est au format base64
			console.log(image);
		});
	},
	this.stop = function() {

	},
	this.classifyObjects = function(image){
		
	}
}

//EVENTS
imgClassifer.on('imageClassifed', function(data) {
    console.log(data);
});

util.inherits(Watcher, EventEmitter);
module.exports = Watcher;








// var spawn = require('child_process').spawn;
// var deepBeliefClassifer = require('../libs/deepBelief/imgClassifier');
// var cv = require('opencv');
// var imgClassifer = new deepBeliefClassifer();
// var util = require('util');
// var EventEmitter = require('events').EventEmitter;
// var fs = require('fs');

// //apt-get install python-opencv
// //apt-get install numpy
// var Watcher = function() {
// 	var self = this;
// 	this.start = function(){
// 		var args = ["-w", "640", "-h", "480", "-o", "./temp/image_stream.jpg", "-t", "999999999", "-tl", "100"];
// 		proc = spawn('raspistill', args);
// 		fs.watchFile('../temp/image_stream.jpg', function(current, previous) {
// 			self.emit('liveStream',current);
// 		});
// 	},
// 	this.stop = function () {
// 		fs.unwatchFile('../temp/image_stream.jpg');
// 	}
// 	this.classifyObjects = function(image){
		
// 	}
// }

// //EVENTS
// imgClassifer.on('imageClassifed', function(data) {
//     console.log(data);
// });

// util.inherits(Watcher, EventEmitter);
// module.exports = Watcher;
