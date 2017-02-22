( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
}(typeof window !== "undefined" ? window : this, function(window, noGlobal){
	"use strict";
	/* 
	 *工具类
	 *@namespace tool
	 */
	const flagElemRE = /\s*<([\w]+)[^>]*>\s*/i;   
	const simpleRE  = /^[_a-zA-Z](\w)*$/i;

	
	var T = {
		type(value){
			var exp = toString.call(value);
			var exec = /^\[Object (\w+)\]/i.exec(exp);
			return  exec ? exec[1].toLowerCase(): typeof value;
		},
		isPlainObject: (value) => T.type(value) == "object",
		isNumber: (value) => T.type(value) == "number",
		isObject: (value) => typeof value == "object",
		isArray: (value) => T.type(value) == "array",
		isBoolean: (value) => T.type(value) == "boolean",
		isElemNode: (value) => !!value && typeof value == "object" && (value.nodeType == 1 || value.nodeType == 9),
		toArray: (arr) => Array.from(arr),
		likeArray(arr){
			if(T.isArray(arr) == "array") return arr;
			return T.isObject(arr) && (arr.length === 0 || (T.isNumber(arr.length) && arr.length > 0 && !!arr[arr.length - 1]))
		},
		unique(arr){                    //数组去重
			var obj = {}, newArr = [],
				len = arr.length;
			for (let i = 0; i < len; i++){
				if (arr.slice(i+1).indexOf(arr[i]) == -1) 
					newArr.push(arr[i])
			}
			return newArr;
		}
	}
	var arrPro   = Array.prototype,
		forEach  = arrPro.forEach,
		map      = arrPro.map,
		filter   = arrPro.filter,
		push     = arrPro.push,
		slice    = arrPro.slice;
	var W = function(selector, context){
		return Wo.init(selector, context);
	}
	W.map    = (dom, fn) => map.call(dom, fn);
	W.each   = (dom, fn) => forEach.call(dom, fn);
	W.filter = (dom, fn) => filter.call(dom, fn);

	W.fn = {
		map(fn){
			return W(W.map(this, fn));
		},
		each(fn){
			return W(W.each(this, fn));
		},
		filter(fn){
			return W(W.filter(this, fn));
		},
		get(){
			return T.toArray(this);
		},
		eq(index){
			return this.slice(index, index+1)
		},
		slice(i, j){
			return W(slice.call(this, i, j));
		},
		parent(){
			var dom = [];
			this.each(elem => dom.push(elem.parentNode || document) );
			return W(T.unique(dom))
		},
		parents(selector){
			var dom = [];
			this.each(elem => {
				var parent = elem.parentNode;
				while(parent) {
					if (!selector)   dom.push(parent);
					else 
						if (Wo.matches(parent, selector)) 
									 dom.push(parent);

					parent = parent.parentNode;
				}
			});
			return W(T.unique(dom))
		},
		closest(selector, context){


		},
		siblings(selector, hasOwn){
			if (T.isBoolean(selector)) [selector, hasOwn] = [hasOwn, selector]  //重载
			var dom = [];
			this.each(elem => {
				var nodes = elem.parentNode.childNodes;
				nodes = W(nodes).filter(function(node){
					if (!selector) return true;
					if (node == elem) {
						if (hasOwn) return true;
						else        return false;
					}else if (typeof selector == "string"){                      //字符串
						if (Wo.matches(node, selector))
							 return true;
						else return false;

					}else if (T.isArray(selector)) {                            //数组,数组元素只能是字符串
						if (selector.some((item) => Wo.matches(node, item)))
							 return true;
						else return false;
					}                            
					
				});
				dom.push(...nodes)
			});
			return W(T.unique(dom))
		},
		children(selector){
			var dom = [];
			this.each(elem => {
				let nodes = elem.childNodes.length > 0 && W(elem.childNodes).filter(function(elem){
					if(!selector) return elem;
					else          return Wo.matches(elem, selector)
				})
				dom.push(...nodes);
			})
			return W(dom)
		},
		find(selector){
			var type = T.type(selector);
			var dom  = [];
			if (type == "string") {
				this.each(function(elem){
					let elems = Wo.qsa(selector, elem);
					push.apply(dom, elems);
				})
			} 	
			return W(dom);
		},
		not(selector) {
			var type = T.type(selector);
			if (type == "string") {

			}
		},
		addClass(value = ""){
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
		remove(){
			this.each(elem => {
				let parent = elem.parentNode || document;
				parent.removeChild(elem)  
			});
			return this;
		},
		attr(key, value){
			var attribute = (elem, key, value) =>{
				if (!T.isElemNode(elem)) return;
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
		}
	}
	W.prototype = W.fn;
	var Wo = {
		init(selector, context){
			var type = T.type(selector), dom = [];

			if (type == "string") {
				if(flagElemRE.test(selector)) 
					this.flagElement(selector, context)
			    else 
					dom = this.qsa(selector.trim(), context)
			}  else if(T.likeArray(selector)) {

				dom = T.toArray(selector).filter(function(elem){
					if (T.isElemNode(elem)){
						return elem;
					} else if(T.type(elem) == "string"){
						return W.qsa(elem)
					} else {
						return false;
					}
				});
			}  else if(T.isElemNode(selector)) {         //如果为dom节点
				dom = selector;
			}
			if (!dom) dom = []
			else if (dom.length == null)  dom = [dom] 

			dom.selector = selector;
			return new Wo.W(dom, context);
		},
		W(dom = [], context){
			var keys = Array.from(dom),
				len  = this.length = keys.length;
			this.selector = dom.selector;     
			while(len--){
				this[len] = keys[len];
			}
		},
		flagElement(selector, context){
			let isSimple = false;

		},
		qsa(selector, context = document){
			var firstEle = selector[0],
				mayId    = firstEle == "#",
				mayClass = !mayId && firstEle == ".",
				match    = (!mayId && !mayClass) ? selector : selector.slice(1),
				isSimple = simpleRE.test(match),
				dom;

			if (isSimple) {
				if (mayId && match) 			dom = document.getElementById(match);
				else if (mayClass && match) 	dom = context.getElementsByClassName(match)
				else if (match)                 dom = context.getElementsByTagName(match);
				else                            dom = context.querySelectorAll(selector)
			} 
			else dom = context.querySelectorAll(selector);
			return dom;
		},
		matches(element, selector){
			 var arr = ["matches", "webkitMatchesSelector", "mozMatchesSelector", "oMatchesSelector", "matchesSelector"],
				matchesSelector;
			if (
				arr.some(key => !!( matchesSelector = element[key]))
			 )  return matchesSelector.call(element, selector); 
			
			var parent = element.parentNode || document;
			var dom = Array.from(Wo.qsa(selector, parent));
			if (
				dom.some(elem => elem == element)
			)     return true;
			else  return false;
		}
	};
	Wo.W.prototype = W.fn
	
	window.$ = window.$ || W; 

	log(W(".a, .j").siblings([".i"], true));


}) )