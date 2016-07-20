var nplReminder = {
      process:function (text) {
            var date = new Date();
            return {
                  "type" : "reminder" , 
                  "status" : "FUTURE" , 
                  "hint" : "AMBIGUOUS_TIME_OF_DAY,ASK_FOR_TIME" , 
                  "weekday" : "MONDAY" , 
                  "year" : date.getFullYear().toString(), 
                  "month" : (date.getMonth()+1).toString(), 
                  "day" : date.getDate().toString(), 
                  "hour" : date.getHours().toString(), 
                  "minute" : (date.getMinutes()+1).toString() , 
                  "utcdate": date.getTime().toString() , 
                  "timeZone": "America/Chicago" , 
                  "action" : "remind me" , 
                  "body" : "do something" , 
                  "utterance" : "Remind me to do something in 1 minute" , 
                  "recurring" : "no" , 
                  "reqtime" : "8" 
            }
      }
}
module.exports = nplReminder;