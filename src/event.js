 import {W} from "./w"
 import {Wo} from "./wo"
 import {isFunction, isBoolean} from "./tool"
 W.extend({
 	/** 给元素集合绑定事件  
     *@param{String}  eventType  事件类型
     *@param{String|HTML DOM}  selector 选择器,将事件委托至该节点运行
     *@param{Function}  callback
     *@param{*}         data传入的数据
     *@param{Boolean}   once 是否事件只触发一次
     *@return{this}
 	 */
 	 on : function(eventType, selector, callback, data, once){
 	 	if (isFunction(selector)) {
			once     = data
			data     = callback;
			callback = selector;
			selector = null;
		} else if (typeof selector !== "string") 
			throw new Error("selectot参数不合法")
		if (isBoolean(data))
			[data, once] = [once, data]
		this.each(elem => {
			var onceFn, delagetor;
			if (!elem.handle) 
				elem.handle = new Handle(elem);		
			if (once) {
				onceFn = function(e) {
					remove(elem, eventType, proxyFn);
					return callback.apply(elem, arguments);
				}
			} 
			if (selector) {
				delagetor = function(e) {
					var dom = W(e.target).closest(selector, elem).get();
					if (dom.length > 0) {
						return (onceFn || callback).apply(dom, arguments);
					}				
				}  
			}
			var proxy = function(callback) {
				return function(e){
					e.data = data;
					e.elem = elem;
					callback.call(elem, e);
				}
			};
			var proxyFn = proxy(delagetor || onceFn || callback)
			add(elem, eventType, proxyFn);
		});
		return this;
 	 },
 	 /** 移出元素集合中每一个元素的事件  
     *@param{String}  eventType  事件类型
     *@param{Function}  callback
     *@return{this}
 	 */
 	 off : function(eventType, fn) {
		this.each(elem => {
			remove(elem, eventType, fn);
		});
		return this;
	}

 });
    /** 事件的工具类,用于存储,移出elem中的事件函数  
     *
     */
	var Handle = function(elem){
		this.elem   = elem;
		this.events = {};
	};
	Handle.prototype.add = function(type, callback, isProxy) {
		var events = this.events;
		if (!events[type]) {
			events[type] = []
		}
		events[type].push(callback);
		return this;
	}
	Handle.prototype.remove = function(type, callback) {
		var events = this.events, index;
		if (events[type]) {
			if (!callback) 
				delete events[type];
			else {
				index = events[type].indexOf(callback);
				if (index > -1) {
					events[type].splice(index, 1)
				}
			}
		}
		return this; 
	}
	/** 为元素节点添加事件  
     *@param{HTML DOM} elem      元素节点
     *@param{String}   eventType 事件类型    
     *@param{Function} callback  绑定的函数   
	 */
	function add(elem, eventType = "", callback) {
		eventType.split(" ").forEach(event => {
			elem.handle.add(event, callback);	
			elem.addEventListener(event, callback, false);
		})	
	}
	/** 移出元素节点绑定事件  
     *@param{HTML DOM} elem      元素节点
     *@param{String}   eventType 事件类型     如果没有则移出所有事件
     *@param{Function} callback  绑定的函数   
	 */
	function remove(elem, eventType = "", callback) {
		eventType.split(" ").forEach(event => {
			var handle = elem.handle;
			var events = handle.events;
			if (!eventType) {                       //移出所有事件
				for (let event in events) {
					remove(elem, event, callback)
				}
			} else {
				if (!callback) {
					let _events = handle.events[event], len = _events.length;
					while(len--) {
						handle.remove(event, callback);
						elem.removeEventListener(event,  _events[len], false)
					}
				}
				elem.removeEventListener(event, callback, false)
			}		
		});
	}