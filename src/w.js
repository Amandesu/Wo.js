
import {Wo} from "./wo.js"
import {
	unique,
	toArray,
	isElemNode,
	isBoolean

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
W.map    = (dom, fn) => map.call(dom, fn);
W.each   = (dom, fn) => forEach.call(dom, fn);
W.some   = (dom, fn) => some.call(dom, fn);

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
	},
	addClass(value = ""){
		var classes = [];

		this.each(elem => {
			elem.className += " " + value
		})
		return this;
	},
	removeClass(value){
		this.each(elem => {
			var reg = new RegExp("(^|\\s)"+value+"($|\\s)", "g") ;
			elem.className = elem.className.replace(reg, "")
		});
		return this;
	},
	html(value){
		if (!this.length) return this; 
		if (!value)       return this[0].innerHTML;

		this.each(elem => {
			elem.innerHTML = value;				
		});
		return this;
	},
	text(value){
		if (!this.length) return this;
		if (!value)       return this[0].innerText;
		this.each(elem => {
			elem.innerHTML = T.html.encode(value);
		});
		return this;
	},
	remove(){
		this.each(elem => {
			let parent = elem.parentNode || document;
			parent.removeChild(elem)  
		});
		return this;
	},
	attr(key, value){
		var attribute = (elem, key, value) =>{
			if (!isElemNode(elem)) return;
			if (!value) {
				return elem.getAttribute(key);
			} else {
				elem.setAttribute(key, value);
			}
		} 
		if (!value) {
			return attribute(this[0], key);
		}
		this.each(function(elem, i){
			attribute(elem, key, value);
		});
		return this;			
	},
	style(property, value){
		if (!value) {
			let node = this[0], res;
			if (property == "width") 
				res = node.offsetWidth;
			else if (property == "height") 
				res = node.offsetHeight;
			else {
				res = node.style[property]
			}
			return res.replace(/px/g, "");
		} else {
			this.each(elem => {
				elem.style[property] = value.replace(/px/g, "") + "px";
			});
		}
		return this;
	},
	width(value){
		this.style("width", value)
	},
	height(value){
		this.style("height", value)
	},
	left(value){
		this.style("left", value)
	},
	right(value){
		this.style("right", value)
	},
	offset(){
		var left = 0, top = 0;
	    var offsetParent = this[0];  
	    while (offsetParent != null && offsetParent != document.body)  {  
	        left  += offsetParent.offsetLeft;
	        top   += offsetParent.offsetTop;  
	        offsetParent = offsetParent.offsetParent;  
	    }  
	    return {
	    	left  : left,
	    	top   : top
	    }			
	}
}
W.prototype = W.fn;
Wo.W.prototype = W.fn;
