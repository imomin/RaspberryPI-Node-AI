var deepBeliefClassifer = require('../libs/deepBelief/imgClassifier');
var cv = require('opencv');
var fs = require('fs');
//var pyCamCode = require('../libs/pyCamCode');
var cvFaceRec = require('../libs/cvFaceRec');
var imgClassifer = new deepBeliefClassifer();
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var lbphFaceRecognizer = cv.FaceRecognizer.createLBPHFaceRecognizer(1,8,8,8,75);
var eigenFaceRecognizer = cv.FaceRecognizer.createEigenFaceRecognizer(80,100.0);
var fisherFaceRecognizer = cv.FaceRecognizer.createFisherFaceRecognizer(10);

var Watcher = function() {
	var self = this;
	this.train = false;
	this.detect = false;
	this.newPersonName = "";
	this.newPersonId = "";
	this.people = {};
	this.start = function(){
		var camera = new cv.VideoCapture(0);
  		var window = new cv.NamedWindow('Video', 0);
  		camera.setWidth(320);
		camera.setHeight(240);
		var cvImages = [];
  		setInterval(function() {
		    camera.read(function(err, im) {
		      if (err) throw err;
		      //console.log(im.size())
		      if (im.size()[0] > 0 && im.size()[1] > 0){
				im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
					if (err) throw err;
					for (var i=0;i<faces.length; i++){
						var x = faces[i]
						im.rectangle([x.x, x.y], [x.width, x.height], [109,252,180], 2);
						if(self.train ===  true) {
							console.log("Inside training...");
							var myName = "1234";
							var ims = im.size();
					        var im2 = im.roi(x.x, x.y, 124, 124);//x.width, x.height
							var channels = im2.channels();

							if(channels >= 3){
					            var labelNumber = parseInt(self.newPersonId); //Create labelnumber; Account-Id starts by 1, labels for openCV start with 0
					            cvImages.push(new Array(labelNumber,im2));  //Add image to Array 
					        }
					        if(cvImages.length > 4){
					        	self.train = false;
								// var personImageFolderPath = './facerec/trainingdata/person02';
								// if(!fs.existsSync(personImageFolderPath))
								// {
								// 	fs.mkdirSync(personImageFolderPath);
								// }
								// var hash_lb = personImageFolderPath + '/lbpg_' + new Date().getTime() + '.xml';
								lbphFaceRecognizer.trainSync(cvImages);
								//lbphFaceRecognizer.saveSync(hash_lb);
								//console.log('lbphFaceRecognizer Saved!');

								// var hash_fh = personImageFolderPath + '/fihr_' + new Date().getTime() + '.xml';
								// fisherFaceRecognizer.trainSync(cvImages);
								// fisherFaceRecognizer.saveSync(hash_fh);
								// console.log('fisherFaceRecognizer Saved!');

								// var hash_en = personImageFolderPath + '/eigen_' + new Date().getTime() + '.xml';
								// eigenFaceRecognizer.trainSync(cvImages);
								// eigenFaceRecognizer.saveSync(hash_en);
								// console.log('eigenFaceRecognizer Saved!');
								self.detect = true;
								cvImages = [];

						    }
						}
						if(self.detect ===  true) {
							// lbphFaceRecognizer.loadSync('./facerec/trainingdata/person02/lbpg_1469913070594.xml');
							// lbphFaceRecognizer.loadSync('./facerec/trainingdata/person02/lbpg_1469913081230.xml');
							// lbphFaceRecognizer.loadSync('./facerec/trainingdata/person02/lbpg_1469913087612.xml');

							// eigenFaceRecognizer.loadSync('./facerec/trainingdata/person02/eigen_1469912063372.xml');
							// eigenFaceRecognizer.loadSync('./facerec/trainingdata/person02/eigen_1469912107523.xml');
							// eigenFaceRecognizer.loadSync('./facerec/trainingdata/person02/eigen_1469912277267.xml');

							var ims = im.size();
					        var im2 = im.roi(x.x, x.y, 124, 124);// x.width, x.height
							var data = lbphFaceRecognizer.predictSync(im2);

							// var data = fisherFaceRecognizer.predictSync(im2);

							// var data = eigenFaceRecognizer.predictSync(im2);
							
							if(self.people[data.id.toString()]) {
								im.putText(self.people[data.id.toString()].name, x.x, x.y, "HERSEY_PLAIN", [109,252,180], 2);
							}
						}
						window.show(im);
					}
				});
		      }
		      window.blockingWaitKey(0, 50);
		    });
		  }, 100);
	},
	this.stop = function() {

	},
	this.classifyObjects = function(image){
		
	},
	this.trainFace = function(intro){
		var regex = "(?:.*name is)\\s(\\w+)";
		var name = intro.match("(?:.*name is)\\s(\\w+)")[1];
		this.newPersonName = name;
		this.newPersonId = parseInt(new Date().getTime().toString().substring(9,13));// TEMP ONLY!!!!!
		this.people[this.newPersonId] = {}
		this.people[this.newPersonId].name=name;
		console.log(this.people);
		setInterval(function() {
			self.train = true;
		},100);
	},
	this.test = function(){
		// When opening a file, the full path must be passed to opencv
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
