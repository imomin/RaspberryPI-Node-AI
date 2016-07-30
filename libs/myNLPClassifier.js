var myNLPclassifier = function(config) {
	var aiName = config.aiName;
	var greetingRegex1 = ("^([A-Za-z0-9]+.)+"+ aiName +"");
	var recallRegex1 = ("(.*(where|who)\\s(?:is|are|has))\\s([a-zA-Z\\s0-9]+)"); 
	var remembermyRegex1 = (".*remember\\s([\\s\\S]*?)\\s(are|is|has)+\\s(.*)");
	var reminderRegex1 = (".*(remind me|tell me)\\s((?:[\\s\\S]*?)\\s(?:seconds|minutes|minute|hours|hour|days|day|weeks|week|months|month|years|year|at|on|within|tonight|tomorrow|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next|week|from now|today|on|to|((O|o)n)*((\\s(((M|m)on|(T|t)ues|(W|w)ednes|(F|f)ri|(S|s)atur|(S|s)un)day))?\\s+)*((J|j)anuary|(f|F)ebruary|(m|M)arch|(a|A)pril|(m|M)ay|(j|J)une|(j|J)uly|(a|A)ugust|(s|S)eptember|(o|O)ctober|(n|N)ovember|(D|d)ecember)\\s+\\d*(st|rd|th)*(\\s+|,)*[\\d]+(st|rd|th)*(\\s+\\d+)*))");
	var faceRecRegex1 = ("(?:.*name is)\\s(\\w+)");
	
	this.getContext = function (string) {
		if(string.match(greetingRegex1)){
			return 'greeting';
		} else if(string.match(remembermyRegex1)) {
			return 'remembermy';
		} else if(string.match(recallRegex1)) {
			return 'recallmy';
		} else if(string.match(reminderRegex1)) {
			return 'schedule';
		} else if(string.match(faceRecRegex1)) {
			return 'faceRec';
		} else {
			return 'unknown';
		}
	}
}
module.exports = myNLPclassifier;
