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
	const simpleRE   = /^[_a-zA-Z$](\w)*$/i;
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
		},
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
	}
	var arrPro   = Array.prototype,
		forEach  = arrPro.forEach,
		map      = arrPro.map,
		filter   = arrPro.filter,
		push     = arrPro.push,
		slice    = arrPro.slice,
		some     = arrPro.some;
	var W = function(selector, context){
		return Wo.init(selector, context);
	}
	W.map    = (dom, fn) => map.call(dom, fn);
	W.each   = (dom, fn) => forEach.call(dom, fn);
	W.filter = (dom, fn) => filter.call(dom, fn);
	W.some   = (dom, fn) => some.call(dom, fn);
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
		some(fn){
			return W.some(this, fn);
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
				while (parent) {
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
			var dom = [],
				endNode = context;
			if (context) {
				if (typeof context == "string" || T.isElemNode(context))              
					endNode = W(context);
				else if (!Wo.isW(context)) 
					throw new Error("closest方法传入错误的参数")
				endNode = endNode[0];
			}
			
			this.each(elem => {
				var parent = elem;       
				while (parent) {
					if (!selector) {
						dom.push(parent);
					} else if (typeof selector == "string") {
						if (Wo.matches(parent, selector)){
							dom.push(parent)
						}
					} else if (T.isArray(selector)) {
						if (selector.some(elem => Wo.matches(parent, selector)))
							dom.push(parent);
					}
					if (endNode == parent) break;
					parent = parent.parentNode;
				}
			});
			return W(T.unique(dom));
		},
		siblings(selector, hasOwn){
			if (T.isBoolean(selector)) [selector, hasOwn] = [hasOwn, selector]  
			var dom = [];
			this.each(elem => {
				var nodes = elem.parentNode.childNodes;
				nodes = W(nodes).filter(function(node){
					if (node == elem) {
						if (hasOwn) return true;                              
						else        return false;
					}
					if (!selector) return true;                        		                       
					if (typeof selector == "string"){                         
						if (Wo.matches(node, selector))
							 return true;
						else return false;

					}else if (T.isArray(selector)) {                            
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
			var dom = [], nodes;
			if (typeof selector == "function") {
				let domTemp = this.filter(selector);
				return this.not(domTemp);
			} else if ((nodes = W(selector)).length > 0) {
				this.filter(elem => {
					if(
						nodes.get().every(function(node){
							return elem !== node
						})
					)  dom.push(elem)
				})
				return W(dom);
			}
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
		append(value){
			return operator.call(this, "append", value);
		},
		prepend(value){
			return operator.call(this, "prepend", value);
		},
		before(value) {
			return operator.call(this, "before", value);
		},
		after(value) {
			return operator.call(this, "after", value);
		},
		insertBefore(value){
			return operator.call(this, "insertBefore", value);
		},
		insertAfter(value) {
			return operator.call(this, "insertAfter", value);
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
		},
		css(property, value){
			if (!value) return this[0].style[property];

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
		        top += offsetParent.offsetTop;  
		        offsetParent = offsetParent.offsetParent;  
		    }  
		    return {
		    	left  : left,
		    	top   : top
		    }
				
		},
		position(){

		},
		on(event, fn) {
			this.each(elem => {
				function proxy(){
					fn.apply(elem)
				}
				elem.addEventListener(event, proxy)
			})
		}
	}
	W.prototype = W.fn;
    //节点操作 appebd prepend after before insertAfter insertBefore
    //除了append 暂时只接受单个节点的传入
	function operator(method, value){
		var dom = value, type = 3 ,self = this;
		if (!value) return this;
		if (W(value).length > 0)  type = 1
		else if (Wo.isW(value))   type = 2   
		else                       type = 3    
		function getDom(){
			if (type == 1)       return W(value).map(elem => elem.cloneNode(true));
			else if (type == 2)  return value[0].cloneNode(true);
			else if (type == 3)  return document.createTextNode(value);
		}
		this.each(elem => {
			dom = getDom()                     //生成dom节点
			var childs = W(elem).children();
			if (method == "append") {
				dom.each(node => elem.appendChild(node));
			} else if (method == "prepend") {
				if (childs.length > 0)         elem.insertBefore(dom[0], childs[0])
				else                           elem.appendChild(dom[0])
			
			} else if (method == "after") {    elem.parentNode.insertBefore(dom[0], elem.nextSibling);
			} else if (method == "before") {   elem.parentNode.insertBefore(dom[0], elem);
			} else if (method == "insertAfter") {
				if (type !== 3)                W(value).after(self[0]);
			} else if (method == "insertBefore") {
				if (type !== 3)                W(value).before(self[0]);
			}
		});
		return this;
	}
	var Wo = {
		init(selector, context){
			var type = T.type(selector), dom = [];

			if (type == "string") {
				if(flagElemRE.test(selector)) 
					this.flagElement(selector, context)
			    else 
					dom = this.qsa(selector.trim(), context)
			}  else if(T.likeArray(selector)) {         //如果为类似数组

				T.toArray(selector).forEach(function(elem){
					var nodes;
					if (T.isElemNode(elem)){
						dom.push(elem);
					} else if( (nodes = W(elem)).length > 0){
						return dom.push(...nodes);
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
		isW(ctx){
			return ctx instanceof Wo.W;
		},
		contains(parent, node){
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
		flagElement(selector, context){
			let isSimple = false;

		},
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
	W.fn.constructor = Wo.W; 
	Wo.W.prototype   = W.fn;

	W("#block").on("click", function(){
		log(W(this).left("200"));
	})
	return W;	
	//log(W(".j").siblings(true));


}) )