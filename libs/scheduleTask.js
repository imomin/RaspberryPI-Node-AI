var url = 'mongodb://localhost:27017/Node-AI';
var taskRunner = require('tasks-runner');
var speaker;
var scheduleTask = {
	add:function(data, callback) {
		var date = new Date();
			date.getFullYear(data.year);
			date.getMonth(data.month);
			date.getDate(data.day);
			date.getHours(data.hour);
			date.getMinutes(data.minute);
		var message = data.body;
		taskRunner
			.schedule('reminder',data,{'startAt':date})
			.catch(function(err) {
		    		callback('Something went wrong: ' + err.message);
			   }).then(function(scheduledTask) {
		    		callback(null, scheduledTask);
			   });
	}
}

var scheduleTaskRunner = {
	taskProcessor:function(taskName){
	    console.log('Providing processor for task with name: ' + taskName);
	    switch (taskName) {
	        case 'reminder':
	            return {
                    notifyUser: function(data) {
                    	scheduleTaskRunner.speaker.speak('This is reminder to ' + data.body);
                    },
                    run: function* (data, previousTaskResult, extendedTaskInfo) {
                        this.notifyUser(data);
                        // console.log('Passed data during task scheduling: ' + data);
                        // console.log('Result of previous task of the same group: ' + previousTaskResult);
                        // console.log('Extended information about current task: ' + extendedTaskInfo);
                    }
                };
	        default:
	            throw new Error('Task processor is not defined for task: ' + taskName);
	    }
	},
	initialize:function(speaker){
		taskRunner.connect(url);
		taskRunner.run({
		    scanInterval: 60, // 60 seconds
		    lockInterval: 60, // 60 seconds
		    tasksPerScanning: 1000,
		    taskProcessorFactory: this.taskProcessor
		}).then(function(){
		    console.log('First scanning iteration was finished');
		});
		this.speaker = speaker;
		//process.on('SIGTERM', taskRunner.stop.bind(taskRunner));
		//process.on('SIGINT', taskRunner.stop.bind(taskRunner));
	}
}
module.exports = {'scheduleTaskRunner':scheduleTaskRunner,'scheduleTask':scheduleTask}

