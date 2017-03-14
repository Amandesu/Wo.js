
/**
 * Wo  dom工具类
 */
import {
	type,
	likeArray,
	toArray,
	isElemNode,

} from "./tool"

import { W
} from "./w"
const flagElemRE   = /\s*<([a-zA-Z]+)[^>]*>/g;   
const singleTagRE  = /^\s*<(\w+)\s*\/?>(?:<\/\1>|)\s*$/
const simpleRE     = /^[_a-zA-Z$](\w)*$/i; 
var Wo = {
	/**  初始化选择器
	 *@param{String}    selector  选择器
	 *@param{context}   context   上下文
	 *@return{Object}   Wo.W的实例
	 */
	init: function(selector, context){
		var sType = type(selector), 
		    dom = [];
		if (sType == "string") {
			if(Wo.isFlagElem(selector)) 
				dom = this.createElement(selector, context)
		    else 
				dom = this.qsa(selector.trim(), context)
		} else if(likeArray(selector)) {         //如果为类似数组
			if (Wo.isW(selector)) {            
				return selector;
			} else if (selector.length == 0) {
				dom = [];
			}
			toArray(selector).forEach(function(elem){
				var nodes;
				if (isElemNode(elem)){
					dom.push(elem);
				} else if( (nodes = W(elem)).length > 0){
					dom.push(...nodes);
				}
			});
		}  else if(isElemNode(selector)) {         //如果为dom节点
			dom = selector;
		}
		if (!dom)                                  //查询到的节点为空
		    dom = []
		else if (dom.length == null)               //查询的是一个单节点
		    dom = [dom]                

		dom.selector = selector;
		return new Wo.W(dom, context);
	},
	/**  W构造函数 将dom数组转化为类似$()的实例对象
	 *@param{Array}     dom元素构成的数组
	 *@param{context}   上下文
	 */
	W: function(dom = [], context){
		var keys = Array.from(dom),
			len  = this.length = keys.length;
		this.selector = dom.selector;     
		while(len--){
			this[len] = keys[len];
		}
	},
	/** 判断是否位Wo.W的实例
	 *@param{Boolean}     
	 */
	isW: function(ctx){
		return ctx instanceof Wo.W;
	},
	/** 判断二个节点是否为直系关系 
	 *@param{HTML DOM}   父节点
	 *@param{HTML DOM}   子孙节点
	 *@return{Boolean}   
	 */
	contains: function(parent, node){
		var contain = document.documentElement.contains ? function(parent, node){
				return parent.contains(node);
			} : function(parent, node) {
				var parentNode = node;
				while (parentNode){
					if (parentNode == parent) 
						return true
					parentNode = parentNode.parentNode;
				}
				return false
			} 
		return contain(parent, node);
	},	
	isFlagElem(str){
		return flagElemRE.test(str)
	},
	createElement(str){
		var dom = [];
		if(singleTagRE.test(str)){
			return document.createElement(RegExp.$1)
		}
		var container = document.createElement("div");
		container.innerHTML = str;
		W(container).children().each(function(elem){
			dom.push(container.removeChild(elem));
		})
		return dom;		
	},
	/** 匹配选择器
	 *@param{String}    selector 选择器
	 *@param{HTML DOM}  context  上下文
	 *@return{Boolean}   
	  @example
	  	 var dom = document.getElementById("a") 
	     Wo.qsa(".index", dom)
	 */ 
	qsa(selector, context = document){
		var firstEle = selector[0],
			mayId    = firstEle == "#",
			mayClass = !mayId && firstEle == ".",
			match    = (!mayId && !mayClass) ? selector : selector.slice(1),
			isSimple = simpleRE.test(match),
			dom = [];
		if (/^[1-9]$/.test(firstEle)) return dom;
		if (isSimple) {
			if (mayId && match) 			dom = document.getElementById(match);
			else if (mayClass && match) 	dom = context.getElementsByClassName(match)
			else if (match)                 dom = context.getElementsByTagName(match);
			else                            dom = context.querySelectorAll(selector)
		} 
		else dom = context.querySelectorAll(selector);
		return dom;
	},
	/** 匹配dom节点和选择器     是W.js核心函数参考zepto
	 *@param{HTML DOM}   element  Dom节点
	 *@param{String}     selector 选择器
	 *@param{Boolean}  
	 */
	matches(element, selector){
		 var arr = ["matches", "webkitMatchesSelector", "mozMatchesSelector", "oMatchesSelector", "matchesSelector"],
			matchesSelector;
		if (
			arr.some(key => !!( matchesSelector = element[key]))
		 )  return matchesSelector.call(element, selector); 
		
		var parent = element.parentNode || document;
		var dom = toArray(Wo.qsa(selector, parent));
		if (
			dom.some(elem => elem == element)
		)     return true;
		else  return false;
	},
	/** 获得节点默认的display
	 *@param{String} nodeName 标签名     
	 */
	getDisplay(nodeName) {
		var elemDisplays = [];            //缓存
		return function() {
			var element, display
		    if (!elemDisplays[nodeName]) {
				element = document.createElement(nodeName)
				document.body.appendChild(element)
				display = getComputedStyle(element, '')["display"]
				element.parentNode.removeChild(element)
				//display == "none" && (display = "block")
				elemDisplays[nodeName] = display
		    }
	    	return elemDisplays[nodeName]
		}();  
  	}
}

export {Wo};