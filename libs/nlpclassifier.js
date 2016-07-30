var natural = require('natural'),
    classifier = new natural.BayesClassifier();

var NLPclassifier = function(config) {
	var aiName = config.aiName;

	this.load = function(){
		classifier.addDocument(aiName, 'greeting');
		classifier.addDocument('hi ' + aiName, 'greeting');
		classifier.addDocument('hey ' + aiName, 'greeting');
		classifier.addDocument('hello ' + aiName, 'greeting');
		classifier.addDocument('good morning ' + aiName, 'greeting');

		classifier.addDocument('where is my', 'recallmy');
		classifier.addDocument('where\'s my', 'recallmy');
		classifier.addDocument('where are my', 'recallmy');
		classifier.addDocument('do you know where is my', 'recallmy');
		classifier.addDocument('do you know where\'s my', 'recallmy');
		classifier.addDocument('do you know where are my', 'recallmy');
		classifier.addDocument('who has my', 'recallmy');
		
		classifier.addDocument('remind me to', 'schedule');
		classifier.addDocument('tell me to', 'schedule');
		classifier.addDocument(['remind me','minute'], 'schedule');
		classifier.addDocument(['remind me','minutes'], 'schedule');
		classifier.addDocument(['remind me','hour'], 'schedule');
		classifier.addDocument(['remind me','hours'], 'schedule');
		classifier.addDocument(['remind me','day'], 'schedule');
		classifier.addDocument(['remind me','days'], 'schedule');
		classifier.addDocument(['remind me','today'], 'schedule');
		classifier.addDocument(['remind me','tonight'], 'schedule');
		classifier.addDocument(['remind me','tomorrow'], 'schedule');
		classifier.addDocument(['remind me','month'], 'schedule');
		classifier.addDocument(['remind me','monday'], 'schedule');
		classifier.addDocument(['remind me','tuesday'], 'schedule');
		classifier.addDocument(['remind me','wednesday'], 'schedule');
		classifier.addDocument(['remind me','thursday'], 'schedule');
		classifier.addDocument(['remind me','friday'], 'schedule');
		classifier.addDocument(['remind me','saturday'], 'schedule');
		classifier.addDocument(['remind me','sunday'], 'schedule');
		classifier.addDocument(['remind me','next'], 'schedule');
		classifier.addDocument(['remind me','week'], 'schedule');
		classifier.addDocument(['remind me', 'from now'], 'schedule');
		classifier.addDocument(['tell me','minutes'], 'schedule');
		classifier.addDocument(['tell me','minute'], 'schedule');
		classifier.addDocument(['tell me','minutes'], 'schedule');
		classifier.addDocument(['tell me','hour'], 'schedule');
		classifier.addDocument(['tell me','hours'], 'schedule');
		classifier.addDocument(['tell me','day'], 'schedule');
		classifier.addDocument(['tell me','days'], 'schedule');
		classifier.addDocument(['tell me','today'], 'schedule');
		classifier.addDocument(['tell me','tomorrow'], 'schedule');
		classifier.addDocument(['tell me','month'], 'schedule');
		classifier.addDocument(['tell me','week'], 'schedule');		
		

		classifier.addDocument(['remember','my'], 'remembermy');
		classifier.addDocument(['remember','on the'], 'remembermy');
		classifier.addDocument(['remember','in the'], 'remembermy');
		classifier.addDocument(['remember','by the'], 'remembermy');
		classifier.addDocument('remember something is somewhere', 'remembermy');
		classifier.addDocument(['remember','is with'], 'remembermy');
		classifier.addDocument(['remember','are with'], 'remembermy');
		classifier.addDocument(['remember','has'], 'remembermy');

		

		classifier.train();
	},
	this.getContext = function (string) {
		return classifier.classify(string);
	}
	this.load();
}
module.exports = NLPclassifier;