var child = require('child_process')
	, path = require('path')
	, net = require('net')
	, fs = require('fs');

var options = {
	encoding: 'UTF-8'
};

exports.detector = Detector;

function Detector(conf) {
	this.port = 4004;
	if (conf) {
		if (conf.port) {
			this.port = conf.port;
		}
	}
	var script = path.resolve(__dirname, 'server.py');
	var command = 'python ' + script + ' ' + this.port;
	child.exec(command, options, function (error, stdout, stderr) {
		if (error) {
			console.log(stderr);
		}
	});
	this.clients = [];
};
Detector.prototype.connect = function (callback, code, send) {
	var client = new net.Socket({
		readable: true,
		writable: true
	});
	client.on('error', function (err) {
		if (err) {
			callback(null, err);
		}
	});
	client.connect(this.port, '127.0.0.1');
	this.clients.push(client);
	var self = this;
	client.on('data', function (res) {
		var message = res.toString('UTF-8');
		if (message == 'BUFFER OK') {
			client.write(send);
		} else {
			self.disconnect(client);
			var retour = JSON.parse(message);
			if (retour.error) {
				callback(null, retour.error);
			} else {
				callback(retour);
			}
		}
	});
	if (code == 'STOP') {
		client.write(code);
	} else if (send) {
		var buffer = send.length;
		client.write(code + buffer);
	}
};
Detector.prototype.disconnect = function (client) {
	var idx = this.clients.indexOf(client);
	if (idx >= 0) {
		this.clients.slice(idx);
	}
	client.destroy();
};
Detector.prototype.findMove = function (json, callback) {
	var send = json.image1 + ' ' + json.image2;
	this.connect(callback, 'MOVDET', send);
};
Detector.prototype.findFaces = function (json, callback) {
	var scaleFactor = 1.2;
	var minNeighbors = 8;
	if (json.scaleFactor) {
		scaleFactor = json.scaleFactor;
	}
	if (json.minNeighbors) {
		minNeighbors = json.minNeighbors;
	}
	var send = json.image + ' ' + json.haarcascade + ' ' + scaleFactor + ' ' + minNeighbors;
	this.connect(callback, 'FACDET', send);
};
Detector.prototype.recognizeFaces = function (json, callback) {
	var scaleFactor = 1.2;
	var minNeighbors = 8;
	if (json.scaleFactor) {
		scaleFactor = json.scaleFactor;
	}
	if (json.minNeighbors) {
		minNeighbors = json.minNeighbors;
	}
	var send = json.csv + ' ' + json.image + ' ' + json.haarcascade + ' ' + scaleFactor + ' ' + minNeighbors;
	this.connect(callback, 'FACREC', send);
};
Detector.prototype.close = function (callback) {
	this.connect(callback, 'STOP');
	callback('Socket closed');
};

exports.pythonVersion = function () {
	var script = path.resolve(__dirname, 'version.py');
	return child.execSync('python ' + script, options);
};

exports.webcam = Webcam;

function Webcam(conf) {
	var port = 4003;
	if (conf) {
		if (conf.port) {
			port = conf.port;
		}
	}
	var script = path.resolve(__dirname, 'webcam_frame.py');
	var command = 'python ' + script + ' ' + port;
	child.exec(command, options, function (error, stdout, stderr) {
		if (error) {
			console.log(stderr);
		}
	});
	this.client = new net.Socket({
		readable: true
	});
	this.client.connect(port, '127.0.0.1');
	this.callback = null;
	var self = this;
	var marqueur = 'WEBCAM';
	var tmp_image = null;
	this.client.on('error', function (err) {
		if (err) {
			self.callback(null, err);
		}
	});
	this.client.on('data', function (data) {
		var str = data.toString('UTF-8');
		var pos = str.indexOf(marqueur);
		if (pos >= 0) {
			if (tmp_image !== null) {
				tmp_image += str.substring(0, pos);
				if (self.callback !== null) {
					self.callback(tmp_image);
				}
			}
			tmp_image = str.substring(pos + marqueur.length);
		} else {
			tmp_image += str;
		}
	});
};
Webcam.prototype.frame = function (callback) {
	this.callback = callback;
};