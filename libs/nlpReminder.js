
var request = require('request');
var chrono = require('chrono-node');

var AmbiguousTime = {
    MORNING:6,
    BEFORE_LUNCH:11,
    NOON:12,
    AFTER_LUNCH:14,
    AFTERNOON:15,
    EVENING:18,
    TONIGHT:20,
    BEFORE_MIDNIGHT_HR: 0,
    BEFORE_MIDNIGHT_MN: 0,
    MIDNIGHT:0,
    AFTER_MIDNIGHT_HR:0,
    AFTER_MIDNIGHT_MN:10,
    NIGHT:21,
    COUPLE_OF:2,
    FEW:4,
    SEVERAL:7,
    LATER:90,
    SHIFT_BY:-30,
    SHIFT_BEFORE:-15,
    SHIFT_JUST_BEFORE:-4,
    SHIFT_AFTER:5,
    SHIFT_JUST_AFTER:3,
    NON_ZERO_MINUTES:5,
    END_OF_DAY_HOUR:16,
    END_OF_DAY_MINS:45
}

var   weekday = new Array(7);
      weekday[0]=  "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";

var parser = {
      _text: null,
      _result:{
            "status":null,
            "utterance":null,
            "weekday":null,
            "year":null,
            "month":null,
            "day":null,
            "hour":null,
            "minute":null,
            "utcdate":null,
            "timeZone":"America/Chicago",
            "recurring":false,
            "repeat":[],
            "task":null
      },

      parseText: function(text){
            _result = this._result;
            _result.utterance = text;
            _text = text.toLowerCase();
            this.apply(this.rule1)
                .apply(this.rule2)
                .apply(this.rule3);
            return _result;
      },
      apply: function(rule){
            rule();
            if(this.status === "Unknown command"){
                  return false;
            }
            return this;
      },
      rule1: function(){
            var TELL_ME_TO = ("tell\\s+(\\w*)(\\s+(to|that|about))?");
            var DONT_FORGET_TO = ("don't\\s+forget\\s+(to|that|about)?");
            var REMIND_ME_TO = ("remind\\s+(\\w*)(\\s+(to|that|about))?");

            var pattern1 = new RegExp(REMIND_ME_TO);
            var result1 = _text.match(pattern1);

            var pattern2 = new RegExp(DONT_FORGET_TO);
            var result2 = _text.match(pattern2);

            var pattern3 = new RegExp(TELL_ME_TO);
            var result3 = _text.match(pattern3);

            if(result1 === null && result2  === null && result3  === null){
                  _result.status = "Unknown command";
                  return false;
            }
            else {
                  var p = new RegExp("(.*)\\s((remind|tell|don't\\s+forget)+(.*))");
                  var result = _text.match(p);
                  _text = result[2];
                  _text = _text.replace(new RegExp(DONT_FORGET_TO), "")
                               .replace(new RegExp(TELL_ME_TO), "")
                               .replace(new RegExp(REMIND_ME_TO), "");
            }
      },
      rule2: function() {
            _text = _text.replace(new RegExp("(P|p)\.(M|m)\."), "pm")
            .replace(new RegExp("(A|a)\\.(M|m)\\."), "am")
            .replace(new RegExp("[!:\\.;,]"), " ")
            .replace(new RegExp("in\\s+((a|one)?)\\s*minute"), " in 1 minute ")
            .replace(new RegExp("in\\s+(a|an|the|one)?\\s*hour"), " in 1 hour ")
            .replace(new RegExp("in\\s+((a|one)?)\\s+day"), " in 24 hours ")
            .replace(new RegExp("in(\\sa)*\\s+(half)?\\s?(a|an)?\\s+hour"), " in 30 minutes ")
            .replace(new RegExp("\\s+(half)\\s+(a|an)?\\s+hour"), " 30 minutes ")
            .replace(new RegExp("a half hour(s?)"), "30 minutes")
            .replace(new RegExp("\\s+(a|at|at a)\\s+quarter to midnight(\\s+|$)"), " at 23:45 ")
            .replace(new RegExp("\\s([a]? quarter after midnight)(\\s+|$)"), " 0:15 am ")
            .replace(new RegExp("\\s(just before midnight)(\\s+|$)"), " at 23:55 ")
            .replace(new RegExp("\\s(before midnight)(\\s+|$)") , " before " + AmbiguousTime.BEFORE_MIDNIGHT_HR + ":" + AmbiguousTime.BEFORE_MIDNIGHT_MN+" pm ")
            .replace(new RegExp("\\s(by midnight)(\\s+|$)") , " at " + AmbiguousTime.BEFORE_MIDNIGHT_HR + ":" + AmbiguousTime.BEFORE_MIDNIGHT_MN+" pm ")
            .replace(new RegExp("\\s(after midnight)(\\s+|$)"), " at " + AmbiguousTime.AFTER_MIDNIGHT_HR + ":" + AmbiguousTime.AFTER_MIDNIGHT_MN + " am ")
            .replace(new RegExp("\\s(@)?(midnight)(\\s+|$)") , " 24:00 am ")
            .replace(new RegExp("\\s(@)?(noon)(\\s+|$)"), " 12:00 pm ")
            .replace(new RegExp("(by|towards|at)(\\s+the)*\\s+end\\s+of(\\s+the)*\\s+day"), " at " + AmbiguousTime.END_OF_DAY_HOUR + ":" + AmbiguousTime.END_OF_DAY_MINS + " pm ")

            .replace(new RegExp("\\s(one)(\\s+|$)"), " 1 ")
            .replace(new RegExp("\\s(two)(\\s+|$)"),       " 2 ")
            .replace(new RegExp("\\s(three)(\\s+|$)")    , " 3 ")
            .replace(new RegExp("\\s(four)(\\s+|$)")     , " 4 ")
            .replace(new RegExp("\\s(five)(\\s+|$)")     , " 5 ")
            .replace(new RegExp("\\s(six)(\\s+|$)")      , " 6 ")
            .replace(new RegExp("\\s(seven)(\\s+|$)")    , " 7 ")
            .replace(new RegExp("\\s(eight)(\\s+|$)"), " 8 ")
            .replace(new RegExp("\\s(nine)(\\s+|$)")     , " 9 ")
            .replace(new RegExp("\\s(ten)(\\s+|$)")      , " 10 ")
            .replace(new RegExp("\\s(eleven)(\\s+|$)")   , " 11 ")
            .replace(new RegExp("\\s(twelve)(\\s+|$)")   , " 12 ")
            .replace(new RegExp("\\s(thirteen)(\\s+|$)") , " 13 ")
            .replace(new RegExp("\\s(fourteen)(\\s+|$)") , " 14 ")
            .replace(new RegExp("\\s(fifteen)(\\s+|$)")  , " 15 ")
            .replace(new RegExp("\\s(sixteen)(\\s+|$)")  , " 16 ")
            .replace(new RegExp("\\s(seventeen)(\\s+|$)"), " 17 ")
            .replace(new RegExp("\\s(eighteen)(\\s+|$)"), " 18 ")
            .replace(new RegExp("\\s(nineteen)(\\s+|$)") , " 19 ")
            .replace(new RegExp("\\s(twenty)(\\s+|$)")   , " 20 ")
            .replace(new RegExp("\\s(thirty)(\\s+|$)")   , " 30 ")
            .replace(new RegExp("\\s(fourty)(\\s+|$)")   , " 40 ")
            .replace(new RegExp("\\s(forty)(\\s+|$)"), " 40 ")
            .replace(new RegExp("\\s(fifty)(\\s+|$)"), " 50 ")

            .replace(new RegExp("\\s(M|m)on\\.?\\s+"), " monday ")
            .replace(new RegExp("\\s(T|t)ue\\.?\\s+"), " tuesday ")
            .replace(new RegExp("\\s(W|w)ed\\.?\\s+"), " wednesday ")
            .replace(new RegExp("\\s(T|t)hu\\.?\\s+"), " thursday ")
            .replace(new RegExp("\\s(F|f)ri\\.?\\s+"), " friday ")
            .replace(new RegExp("\\s(S|s)at\\.?\\s+"), " saturday ")
            .replace(new RegExp("\\s(S|s)un\\.?\\s+"), " sunday ")

            .replace(new RegExp("\\s((J|j)an)\\.?\\s+"), " January ")
            .replace(new RegExp("\\s((F|f)eb)\\.?\\s+"), " February ")
            .replace(new RegExp("\\s((M|m)ar)\\.?\\s+"), " March ")
            .replace(new RegExp("\\s((A|a)pr)\\.?\\s+"), " April ")
            .replace(new RegExp("\\s((M|m)ay)\\.?\\s+"), " May ")
            .replace(new RegExp("\\s((J|j)un)\\.?\\s+"), " June ")
            .replace(new RegExp("\\s((J|j)ul)\\.?\\s+"), " July ")
            .replace(new RegExp("\\s((A|a)ug)\\.?\\s+"), " August ")
            .replace(new RegExp("\\s((S|s)ep)\\.?\\s+"), " September ")
            .replace(new RegExp("\\s((O|o)ct)\\.?\\s+"), " October ")
            .replace(new RegExp("\\s((N|n)ov)\\.?\\s+"), " November ")
            .replace(new RegExp("\\s((D|d)ec)\\.?\\s+"), " December ");

            // var pattern1 = new RegExp("later\\s+(on\\s+)*(this\\s+)*(in\\s+the\\s+)*(today|tonight|morning|afternoon|evening)");
            // var r1 = _text.match(pattern1);
            // if (!!r1) {
            //       _text.replace("later on", "").replace("later","");
            // }
      },
      rule3: function(){
            var date = chrono.parseDate(_text);
            var detailInfo = chrono.parse(_text);
            _text = _text.replace(detailInfo[0].text,"");
            
            _result.weekday = weekday[date.getDay()];
            _result.year = date.getFullYear();
            _result.month = date.getMonth()+1;
            _result.day = date.getDay();
            _result.hour = date.getHours();
            _result.minute = date.getMinutes();
            _result.utcdate = date.getTime();
            _result.status = "success";
            _result.task = _text.trim();
      }
}

var nplReminder = {
      process:function (text) {
            return parser.parseText(text);
      }
}
module.exports = nplReminder;