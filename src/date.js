
const week = [ "星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var getDetail = (d = new Date()) => {
	return {
		"y"   : "" + d.getFullYear(),
		"M"   : "" + (d.getMonth()+1),
		"d"   : "" + d.getDate(),
		"h"   : "" + d.getHours(),
		"m"   : "" + d.getMinutes(),
		"s"	  : "" + d.getSeconds(),
		"week": "" + d.getDay()
	}
};
var decorate = function(str){
	if (str.length && str.length < 2){
		return "0" + str;
	}else{
		return str;
	}
};
//var types = "Object Array Date String Number Boolean RegExp HTMLDocument Undefined";
var type = function(obj){
	var exec = /\[Object ([\w]+)\]/i.exec(toString.call(obj)) ;
	exec = exec && exec[1] && exec[1].toLowerCase();	 
	return exec;
}

/**
 *定义日期操作对象  
 *@namespace
 *@name date
 */
var date = {

	"y": new Date().getFullYear(),
	"M": new Date().getMonth()+1,
	"d": new Date().getDate(),
	"h": new Date().getHours(),
	"m": new Date().getMinutes(),
	"s": new Date().getSeconds(),
	/** 
	 *判断二个日期对象是否在同一天 
	 *@param{Object Date} date1  时间对象
	 *@param{Object Date} date2  时间对象
	 *@return{Boolean}
	 */
	isSomeDate(date1, date2){
		var d1 = getDetail(date1),
			d2 = getDetail(date2);
		if(d1.y+d1.M+d1.d == d2.y+d2.M+d2.d){
			return true
		}else return false
	},
	/** 
	 *判断二个日期之间的差值 
	 *@param{Object Date | String} date1 时间对象或者字符串
	 *@param{Object Date | String} date2 时间对象或者字符串
	 *@param{String}               unit  单位 默认为时         
	 *@return{Number}    
	 @example
	 date.getDiff(new Date("2017-02-15"), new Date("2017-03-17"))
	 date.getDiff("2017-02-15", "2017-03-17", "天")
	 date.getDiff("2017-2-15 12:10", "2017-3-17 11:22", "分")
	*/
	getDiff(date1, date2, unit = "时"){
		var time = this.parse(date2) - this.parse(date1),
			units = {
				"天|日|day|d|date": 3600*24*1000,
				"时|小时|h"       : 3600*1000,
				"分|分钟|m"       : 60*1000,
				"秒|s"            : 1000,
				"毫秒|ms"         : 1
			},
			unitKeys = Object.keys(units),
			len      = unitKeys.length, timeStamp;
		if (type(unit) == "string") {
			while(len--){
				if(unitKeys[len].indexOf(unit) >= 0){
					timeStamp = units[unitKeys[len]];
					break;
				};
			}
		} 
		return time/timeStamp;
	},
	/** 
	 *将一个时间格式的字符串解析为时间戳zh
	 *支持 2012-01-12|2012 2 1|2012/2/1|2012\2\1|2012-02-02 12:00|2012-02-02 12:00:00
	 *     2012-01  12:00| 2012 1  12:2:3等写法 
	 *     如果日期格式只有二位如 2012 2  12:00后面添加时间必须加上二个空格
	 *@param{Object Date | String} date  时间对象或者字符串
	 *@return{Number}
	 *
	 */
	parse(date){  //2015 12 11 12:20:00
		var d = getDetail(new Date, true);
		if(type(date) == "date") {
			return date.getTime();
		} else if(type(date) == "string"){
			let dateRE = /^\s*(\d{4})(?:[-\s\/\\,](\d{1,2}))?(?:[-\s\/\\,](\d{1,2}))?/,
				timeRE = /(\d{1,2})\:(\d{1,2})(?:\:(\d{1,2}))?/,
				dateList = dateRE.exec(date) || [],
				timeList = timeRE.exec(date) || [];
			if (date) {
				d.y = dateList[1] || d.y;
				d.M = dateList[2] || 1;
				d.d = dateList[3] || 1;
				d.h = timeList[1] || 0;
				d.m = timeList[2] || 0;
				d.s = timeList[3] || 0;
			}
			
		} /* else if (type(date) == "array"){

		} */ 
		return +new Date(d.y+"-"+d.M+"-"+d.d+" "+d.h+":"+d.m+":"+d.s);
			
	},
	getChinaDate(exp, date){  
		if (type(exp) == "date") [exp, date] = [date, exp];  //重载
		if(!exp)  exp = "yyyy-MM-dd week hh:mm:ss"
		var d = getDetail(date); 
		var dateReg = {
			"y+-?"  : d.y + "年",
			"M+-?"  : decorate(d.M) + "月",
			"d+-?"  : decorate(d.d) + "日",
			"week"  : week[d.week],
			"h+:?"  : decorate(d.h) + "点",
			"m+:?"  : decorate(d.m) + "分",
			"s+:?"  : decorate(d.s) + "秒"
		}
		for(let reg in dateReg){
			exp = exp.replace(new RegExp(reg), () => {
				return dateReg[reg];
			})
		}
		return exp;
	},
	format(exp, date){
		var d = getDetail(date);
		var dateReg = {
			"y+": d.y,
			"M+": d.M,
			"d+": d.d,
			"h+": d.h,
			"m+": d.m,
			"s+": d.s
		};
		if(!exp) exp = "y-M-d h:m:s";
		if(/y+/.exec(exp)[0].length == 2){
			dateReg["y+"] = d.y.substr(2, 4);
		};
		for(let reg in dateReg){
			exp = exp.replace(new RegExp(reg), () => {
				let val = dateReg[reg];
				return decorate(val)
			})
		}
		return exp;
	}
}
export default date
