
import {Wo} from "./wo.js"
import {
	unique,
	toArray,
	isElemNode,
	isBoolean,
	isObject

} from  "./tool"

export  function W(selector, context){
	return Wo.init(selector, context);
}

var arrPro   = Array.prototype,
	forEach  = arrPro.forEach,
	map      = arrPro.map,
	push     = arrPro.push,
	slice    = arrPro.slice,
	some     = arrPro.some;
W.map    = (dom, fn) => {
	map.call(dom, function(elem, i){
		fn.call(dom, elem, i)
	});
	return dom;
}
W.each   = (dom, fn) => {
	forEach.call(dom, function(elem, i){
		fn.call(dom, elem, i)
	});
	return dom;
} 
W.some   = (dom, fn) => {
	some.call(dom, function(elem, i){
		fn.call(dom, elem, i)
	});
	return dom;
}

//扩展静态属性
W.extendProp = function(options, cover) {
	var source = this;
	if (cover) {
		return Object.assign(source, options);
	} else {
		let keys = Object.keys(options), len = keys.length;
		while (len--) {
			let key = keys[len];
			if (!source.hasOwnProperty(key)) {
				source[key] = options[key];
			}
		}
	}
	return source;

}
//扩展原型属性
W.extend = function(options, cover) {
	return W.extendProp.call(W.fn, options, cover)
}
/** 属性的拷贝
 *@param{Object}   target目标对象
 *@param{Object}   source被拷贝的对象
 *@param{Boolean}  是否为深度拷贝
 *@param{Boolean}  是否覆盖相同属性
 */
W.copy = function(target, source, deep, copy) {
	for (var name in source) {
		if (target[name] !== undefined && !copy) 
			continue; 
		if (!isObject(source[name]) || !deep) {
			target[name] = source[name];
		} else {
			target[name] = {};
			W.copy(target[name], source[name]);
		}
	}
	return target;
};
W.fn = {
	constructor: W,
	map(fn){
		return W(W.map(this, fn));
	},
	each(fn){
		return W(W.each(this, fn));
	},
	some(fn){
		return W.some(this, fn);
	},
	get(){
		return toArray(this);
	}
}
W.prototype = W.fn;
Wo.W.prototype = W.fn;
