var processor = require('./utils/processor');
var p = new processor();

var RememberMy = require('./plugins/remembermy');
remembermy = new RememberMy(null);
remembermy.process('');


p.startListening();
//p.startCamera();
