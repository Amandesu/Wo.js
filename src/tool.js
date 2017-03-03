
function type(value) {
	var exp = toString.call(value);
	var exec = /^\[Object (\w+)\]/i.exec(exp);
	return  exec ? exec[1].toLowerCase(): typeof value;
}
function isPlainObject(value) {
	return type(value) == "object";
}
function isNumber(value) {
	return type(value) == "number";
} 
function isObject(value) {
	return typeof value == "object";
}
function isArray(value) {
	return type(value) == "array";
}
function isFunction(value) {
	return typeof value == "function";
}
function isBoolean(value) {
	return type(value) == "boolean";
}
/** 判断是否为元素节点或者文本节点
 *return{Booearn} 
 */
function isElemNode(value) {
	return !!value && typeof value == "object" && (value.nodeType == 1 || value.nodeType == 9);
}
/** 转化为数组
 *@param{*} value 类似数组
 *@return{Array}
 */
function toArray(value) {
	var arr = [];
	if (!likeArray(value))
		return arr;
	try {
		arr = Array.from(value)
	} catch (e) { 
		let len = value.length;
		while (len--) {
			arr[len] = value[len];
		}
	}
	return arr
}
/** 判断是否为类似数组的对象  
 *@param{Object} arr 
 *@return{Booearn}
  @example
  	likeArray({name:"leiwuyi", age:24, length:2})
 */
function likeArray(arr){
	if(isArray(arr) == "array") return arr;
	return isObject(arr) && (arr.length === 0 || (isNumber(arr.length) && arr.length > 0 && !!arr[arr.length - 1]))
}
/** 数组去重  
 *@param{Object} arr 
 *@return{Array} newArr
  @example
  	var a = [1, 1, 2, 2, 3, dom1(节点类型), dom1, dom2]
  	var b = unique(arr)
  	b = [1, 2, 3, dom1, dom2];
 */
function unique(arr){
	var newArr = [], len = arr.length, map;
	if (Map) 
		map = new Map();

	for (let i = 0; i < len; i++) {
		if (map){
			if (!map.get(arr[i])) {                     //时间复杂度O(n)
				map.set(arr[i], 1);
				newArr.push(arr[i]); 
			}
		}
		else {
			if (arr.slice(i+1).indexOf(arr[i]) == -1)   //时间复杂度O(n2)
				newArr.push(arr[i])
		}
	}
	map.clear()
	return newArr;
}
export {type, isPlainObject, toArray, unique}
/*
		html: function(){

			var encode = function(content){
				var escapeMap = {
				    "<": "&#60;",
				    ">": "&#62;",
				    '"': "&#34;",
				    "'": "&#39;",
				    "&": "&#38;"
				};
				return String(content).replace(/&(?![\w#]+;)|[<>"']/g, function(s){
				    return escapeMap[s]
				});
					
			}
		
        	var decode = function(){

        	};
        	return {
        		encode: encode,
        		decode: decode,
        	};

		}()
	}*/