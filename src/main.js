
	//工具类
	var T = function(){
		var addItem = function (key) {
			var curNum = localStorage.getItem(key);
			if (!curNum) 
				localStorage.setItem(key, 0)
			localStorage.setItem(key, ++curNum);
		};
		var getItem = function (key) {
			return localStorage.getItem(key)
		}	
		var random = function(start, end) {
			if (start == end || !end) return Number(start);
			return Math.floor(Math.random(0, 1)*(end - start + 1)+start)
		}
		var getHex = function(s, e, bytes){
			var res   = T.random(s, e).toString(16),
				arr   = [], hex, bytes;
			if(bytes)  bytes= bytes;
			else if(res.length <= 2){       //传入一个biye的值
				bytes = 1;  
				arr.push("00H")
			} else bytes = 2
			
			for (var i = 0; i < bytes; i++) {
				hex = res.substr(i, 2);
				if (hex.length == 0) hex = "00";
				else if (hex.length == 1) hex = "0"+hex;
				arr.push(hex+"H");
			}
			return arr;
		}
		return {
			addItem  : addItem,
			getItem  : getItem,
			random   : random,
			getHex   : getHex
		}	
	}();

	var Hex = function(){
		this.arrHex = [];
		this.init();
	}
	Hex.prototype = {
		constructor: Hex,
		//手机毫秒数
		init: function(){
			T.addItem("rollNum");
			var arrHex = this.arrHex, push = [].push;
			push.apply(arrHex, this.getMsPhone()); 
			push.apply(arrHex, this.getRoll()); 
			push.apply(arrHex, this.getRandom()); 
			push.apply(arrHex, this.getRandom()); 
			push.apply(arrHex, this.getRandom()); 
		},
		getHex: function(){
			return this.arrHex;
		},
		getMsPhone: function(){
			var ms = new Date().getMilliseconds();
			return T.getHex(ms)
		},
		//滚动值
		getRoll: function(){
			var rollNum = T.getItem("rollNum");
			return T.getHex(rollNum);
		},
		//3个随机数
		getRandom: function(){
			return T.getHex(0, Math.pow(2, 32)-1, 4)
		}
	}
	log(new Hex().getHex());
	
	



new Vue({
	el: 'body',
	data: {
		name: "leiwuyi"
	}
	//components: { App }
})
// 
