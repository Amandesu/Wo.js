 import {W} from "./w"
 import {Wo} from "./wo"
 import {} from "./tool"
 W.extend({
 	show(){
 		this.each(elem => {
 			var nodeName = elem.nodeName
 			var defaultDisplay = Wo.getDisplay(nodeName);
 			W(elem).css("display", defaultDisplay);
 		});
 		return this;
 	},
	hide(){
		this.each(elem => {
 			W(elem).css("display", "none");
 		});
 		return this;
	}, 
	animate(options, interval, easing, callback){
		var elem = this[0];
		var entrys = {};
		for (var key in options) {           //第一次循环取值
			entrys[key] = W(elem).css(key);
		}
		var cb = {
			callback: callback.bind(elem),
			done    : false
		}
		for (let key in options) {           //第一次循环取值
			let s = Number(entrys[key].toString().replace("px", ""))
			let e = Number(options[key].toString().replace("px", ""))
			proxyAnimate(s, e, interval, easing, function(value){
				W(elem).css(key, value)
			}, cb);
		}				
		return this;
	}
 });

/** 运动函数 
 */
var proxyAnimate = function(start, end, t, easing, fn, cb){
	var time = +new Date();
	var interval = setInterval(function(){
		var durTime = +new Date() - time;
		var pos     = speeds[easing](start, end, durTime, t)
		if (durTime >= t) {
			clearInterval(interval);
			fn(""+end);
			if(!cb.done) {
				cb.done = true;
				cb.callback()
			}
		} else {
			fn(""+(pos + start*1));
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
