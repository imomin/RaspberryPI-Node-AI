var nlpReminder = require('./libs/nlpReminderDrop');
var x = nlpReminder.process('computer wake me up at 8:00 AM tomorrow morning.', function (err, data) {
	console.log(data);
});


//var processor = require('./utils/processor');

// var p = new processor();
//p.startListening();
//p.startCamera();


// var faceDetec = require('./libs/cvFaceRec');
//faceDetec.train();
// faceDetec.recognize();
// faceDetec.detecFace()