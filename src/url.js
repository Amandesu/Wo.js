
import {isPlainObject, isArray} from "./tool"

/** 将对象解析为url地址字符串
 *@param{Object}  obj   参数
 *@param{key}     默认没有-->为了兼容递归调用添加的属性
 *@return{String} 
  @example 
   urlObj({name:"leiwuyi", age: 24})
   return name=leiwuyi&age=24
 */
var urlObj   = function (obj, key) {
	var arr = [];
	for (var name in obj) {
		if (isPlainObject(obj[name]) || isArray(obj[name])) {
			arr.push(urlObj(obj[name], name))
		} else {
			if (key) 
				arr.push(key + "[" + name+ "]" + "=" + encodeURIComponent(obj[name]) );
			else
			    arr.push(name + "=" + encodeURIComponent(obj[name]) );
		}
		
	}
	return arr.join("&");
}


/** 拼接url;
 *@param{Object}  obj   
 *@param{String}  url   默认当前地址
 *@return{String} 新的url
  @example 
   makeUrl({name: "leiwuyi", age: 24}, www.baidu.com?age=15)
   return "www.baidu.com?name=leiwuyi&age=24"
 */
var makeUrl  = function (obj, url = location.href) {
	var target = Object.assign(getUrlObj(url), obj);    
	var host   = url.replace(/\?([^?]+|$)/, "");
	return host + "?" + urlObj(target)
};


/** 将url的参数以对象的形式存储起来 
 *@param{String}  url   默认当前地址
 *@return{Object} 
  @example 
   getUrlObj(www.baidu.com?name=leiwuyi&age=24")
   return {
		name: "leiwuyi",
		age : 24
   }
 */
var getUrlObj = function (url = location.href) {
	var obj = {};
	url.replace(/(?:\?|&)([^?&]+)=([^?&]+)/g, function (_, $1, $2) {
		obj[$1] = decodeURIComponent($2);
	});
	return obj;
};


/** 查询url参数的值 
 *@param{String}  key   参数
 *@param{String}  url   默认当前地址
 *@return{String} value
  @example 
   queryUrl("index", "www.baidu.com?index=18")
   return 18
 */
var queryUrl = function (key, url = location.href) {
	var reg = new RegExp("(?:\\?|&)"+ key + "=([^?&]+)");
	var exec = reg.exec(url);
	return exec && exec[1];
}
export {urlObj, makeUrl, getUrlObj, queryUrl}
