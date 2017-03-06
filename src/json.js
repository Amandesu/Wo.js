
	import {isPlainObject, isArray} from "./tool"
	const literlRE = /^[_a-zA-X]\w*$/;
	const keyWordRE  = /^(?:true|false|null|NaN|Infinity|Math\.\w+\(\)|undefined)/i;
	
	/**  纯手工的解析JSON字符串方法, 比原生方法JSON.parse更为健壮, 
     *   value支持Math.random function undifined等特殊值的传入
     *@param  {String} text   JSON类型的字符串 '{"name": "leiwuyi", "age": 12}' 
     *@param  {Object} ctx    指上下文, value值的作用域   
     *@return {Object} 
      example
	       parseOwn('{name: "leiwuyi", "age": [1, 2, 3, 4, 5], isOk: m}', {m: 18})
		   return {
				name : "leiwuyi",
				age  : [1, 2, 3, 4, 5],
				isOk : 18
		   }
     */
	var parseOwn = function (text, ctx = window) { //'{}'
		var at = -1;
		var ch = " ";

		function white() {
			while (ch && /\s/.test(ch)) {
				next()
			}
		}
		function next(str) {
			if (str && str != ch) {
				throw new Error("第"+ at + "位的" + ch +"预期不符");
			}
			at++;
			ch = text[at];
		}	
		function string() {
			var str = '';
			next('"');
			while (ch && ch != '"') {
				str += ch;
				next()
			}
			next('"')
			return str;
		}
		function number() {
			var str = "";
			if (ch == "-") {
				str += ch;
				next("-")
			}
			while (ch && /\d/.test(ch)) {
				str += ch;
				next()
			}
			return Number(str);
		}
		function array() {
			var arr = [];
			next("[");
			white();
			if (ch == "]") {
				return arr;
			}
			while (ch) {
				let value;
				white();
				value = start();
				arr.push(value);
				if (ch == ']') {
					next("]")
					return arr;
				}
				white()
				next(",");
			}
			return arr;
		}
		function object() {
			var obj = {};
			next("{");
			white();
			if (ch == "}"){
				return obj;
			}
			while (ch) {
				let key, value;
				white();
				key = string()
				next(":")
				white();
				value = start();
				obj[key] = value;
				if (ch == '}') {
					next("}")
					return obj
				}
				white();
				next(",")
			}
		}
		function literl(){
			var str = ""
			while (ch && ch != ",") {
				str += ch;
				next()
			}
			if (literlRE.test(str) && !keyWordRE.test(str)) {
				str = ctx ? ctx[str] :str 
			}
			return new Function("ctx", " return "+ str)();
		}
		function start(){
			var res;
			white();
			if (ch == "{") {                    //对象
				res = object();
			} else if (ch == '"') {             //字符串
				res = string(); 
			} else if (/-|\d/.test(ch)) {       //数字
				res = number();
			} else if (ch == "[")  {            //数组
				res = array();
			} else {                            //字面量
				res = literl();                            
			}                               
			return res;
		}
		return start()
	};
	/**  纯手工JSON.stringfiy方法  兼容低版本浏览器
     *@param  {Object} obj   传入对象
     *@return {string}       字符串
      example
	       parseOwn({name: "leiwuyi", "age": [1, 2, 3, 4, 5], isOk: true})
		   return '{name : "leiwuyi", age  : [1, 2, 3, 4, 5],isOk: true}'
     */
	function stringfiyOwn(obj) {

		function str(key, value) {
			let arr = [], string;
			if (isArray(value)) {
				let len = value.length;
				for (var i = 0; i < len; i++) {
					arr.push(str("",value[i]))
				}
				string = '[' + arr.join(",") + ']';
			} else if (isPlainObject(value)) {
				for (var name in value) {
					arr.push(str(name, value[name]));
				}
				string = '{' + arr.join(",") + "}";
			} else {
				string = value;
			}
			if (key) {
				return '"' + key + '":' + string;
			} else {
				return string;
			}
		}
		return str("", obj);
	}
	function parse(text){
		var obj = null
		try {
			obj = JSON.parse(text)
		}
		catch(err) {
			if (err) {
				try {
					obj = parseOwn(text); 
				}
				catch (err){
					try {
						if (/^\s*\{/.test(text)) {
                    		text = "(" + text + ")";
                		}
                		obj = eval(text);
					}
					catch (err) {
						return err + "解析错误";
					}
				}	
			}
		}
		return obj
	}

	function stringfiy(obj) {
		var text = ""; 
		try {
			text = JSON.stringfiy(obj);
		}
		catch(err) {
			if (err) {
				try {
					text =stringfiyOwn(obj); 
				}
				catch (err){
					return err + "解析错误";
				}	
			}
		}
		return text
	}
	export {
		parse, 
		stringfiy
	}

	