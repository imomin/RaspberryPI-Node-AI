var parser = {
	_text: null,
	_result:{
			utterance:null,
		  	relationalObject:null,
		  	owner:null,
		  	object:null,
		  	verb:null,
		  	location:null
		},

	parseText: function(text){
		_text = text;
		_result = this._result;
		this.apply(this.rule1)
			.apply(this.rule2)
			.apply(this.rule3);
		return _result;
	},
	apply: function(rule){
		rule();
		return this;
	},
	rule1: function(){
		var PARSER1 = (".*remember\\s([\\s\\S]*?)\\s(are|is)+\\s(.*)");
		var rePattern = new RegExp(PARSER1);
		var result = _text.match(rePattern);
		if(!!result){
			_result.utterance = result[0];
			_result.relationalObject = result[1];
			_result.verb = result[2];
			_result.location = result[3];
		}
	},
	rule2: function(){
		var PARSER2  =  (".*remember\\s([\\s\\S]*?)\\s(has)+\\s(.*)");
		var rePattern = new RegExp(PARSER2);
		var result = _text.match(rePattern);
		if(!!result){
			_result.utterance = result[0];
			_result.relationalObject = result[3];
			_result.verb = result[2];
			_result.location = result[1];
		}
	},
	rule3: function(){
		var POSSESSOR = ("\\W*(\\w.*)\\s(\\w+)\\W*$");
		if(_result.relationalObject.split(" ").length === 1){
			_result.owner = 'my';
			_result.object = _result.relationalObject;
		} else {
			var rePattern = new RegExp(POSSESSOR);
			var result = _result.relationalObject.match(rePattern);
			_result.owner = result[1];
			_result.object = result[2];
		}
	}
}

var nplRememberMy = {
	process:function (text) {
		return parser.parseText(text);
	}
}
module.exports = nplRememberMy;