 import {W} from "./w"
 import {Wo} from "./wo"
 import {} from "./tool"
 W.extend({
 	show(){
 		log( move.linear(0, 100, 10, 100) );
 	},
	hide(){
		
	}, 
	animate(options, interval, easing, callback){
		var elem = this[0];
		var entrys = {};
		for (var key in options) {           //第一次循环取值
			entrys[key] = W(elem).css(key);
		}
		for (let key in options) {           //第一次循环取值
			let s = parseInt(entrys[key])
			let e = parseInt(options[key])
			if (key == "opacity") {
				W(elem).css("opacity", "0")
			}
			animate(s, e, interval, easing, function(value){
				W(elem).css(key, value)
			}, callback);
		}				
	}
 });

/** 运动函数 
 */
var animate = function(start, end, t, easing, fn, callback){
	var time = +new Date();
	var interval = setInterval(function(){
		var durTime = +new Date() - time;
		var pos     = speeds[easing](start, end, durTime, t)
		if (durTime >= t) {
			clearInterval(interval);
			fn(end);
			callback();
		} else {
			fn(pos + start*1)
		}
	}, 17)
}
var speeds = {
 	/** 匀速运动 
 	 */
 	"linear": function(s, e, d, t){
 		return (e-s)*d/t
 	}
}
