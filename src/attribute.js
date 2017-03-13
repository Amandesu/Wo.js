 import {W} from "./w"
 import {Wo} from "./wo"
 import {isArray, isElemNode, isPlainObject} from "./tool"
 W.extend({
 	/* 确定任何一个匹配元素是否有被分配给定的（样式）类。 
     *@param{String} 类名
     *@return{Boolean}
 	 */
 	hasClass(value) {
 		if (!value) {
 			return true;
 		}
 		return this.get().every(elem => {
 			var reg = new RegExp("(^|\\s)"+value+"($|\\s)") ;
 			if(!reg.test(elem.className))
 				return false
 			else
 				return true
 		});
 	},
 	/* 对每一个匹配元素进行样式的切换,没有有则增加 有则移出。 
     *@param{String} 类名
     *@return{Boolean}
 	 */
 	toggleClass(value) {
 		if (!value) {
 			return this;
 		}
 		this.each(elem => {
 			var $elem = W(elem);
 			if ($elem.hasClass(value)) {
 				$elem.removeClass(value);
 			} else {
 				$elem.addClass(value);
 			}
 		});
 		return this;
 	},
 	/**  为每个匹配的元素添加指定的样式类名
     *@param{String|Array}  类名
 	 */
 	addClass(value = ""){
		if (!isArray(value)) {
 			value = [value];
 		}
		this.each(elem => {
			var arr = W.copy([] , value, true),    //防止影响value
				len = arr.length;
			while (len--) {
				if (W(elem).hasClass(arr[len])) 
					arr.splice(len, 1);
			}
			if (elem.className){
				arr.unshift(elem.className);
			}
			elem.className = arr.join(" ");
		})
		return this;
	},
	/**  为每个匹配的元素移出指定的样式类名，如果传入"a b"则移出a类和b类
     *@param{String}  
 	 */
	removeClass(value){
		this.each(elem => {
			var arr = [], newCN = elem.className;
			if(/\s/.test(value)) 
				arr = value.split(" ");
			else 
				arr = [value];
			arr.forEach(function (name) {
				var reg = new RegExp("(^|\\s)"+name+"($|\\s)", "g") ;
				newCN = newCN.replace(reg, " ").replace(/(^\s|\s$)/, "")
			})
			elem.className = newCN		
		});
		return this;
	},
	/**  获取匹配的元素集合中的第一个元素的属性的值  或 设置每一个匹配元素的一个或多个属性。
     *@param{String|Object}   key   属性 或者键值对 
     *@param{String}          value 值  
 	 */
	attr(key, value) {
		var attribute = (elem, key, value) =>{
			if (!isElemNode(elem)) 
				return;
			
			if (isPlainObject(key)) {
				for (let name in key) {
					elem.setAttribute(name, key[name]);
				} 
			} else {
				elem.setAttribute(key, value);
			}		
		};
		if (typeof key == "string" && !value ) {
			return this[0].getAttribute(key);
		}
		this.each(function(elem, i){
			attribute(elem, key, value);
		});
		return this;			
	},
	/**  移出匹配的元素集合中的第一个元素的属性, 或者多个元素的属性。
     *@param{String|Array}          key   属性  
 	 */
	removeAttr(key) {
		var removeAttribute = (elem, key) =>{
			if (!isElemNode(elem)) 
				return;
			if (isArray(key)) {
				let len = key.length;
				while(len--) {
					elem.removeAttribute(key[len]);
				}
				
			} else {
				elem.removeAttribute(key);
			}
		} 
		if (key) {
			this.each(function(elem, i){
				removeAttribute(elem, key);
			});
		}
		return this;
	},
	/* 获取匹配元素集合中的第一个元素的样式属性的计算值  或  设置每个匹配元素的一个或多个CSS属性 
     *@param{String} 类名
     *@return{Boolean}
 	 */
 	css: function (name, value) {
 		var getStyle = window.getComputedStyle;
 		if (!value && !isPlainObject(name)) {
 			if (isArray(name)) {
 				let obj = {}, len = name.length, elem = this[0];
 				while (len--) {
 					let key = name[len];
 					obj[key] = getStyle(elem, null)[key]
 				}
 				return obj;
 			} else {
 				return getStyle(this[0], null)[name];
 			}	
 		}
 		this.each(elem => {
 			if (!isPlainObject(name)) {
 				elem.style[name] = value;
 			} else {
 				for (let key in name) {
 					elem.style[key] = name[key];
 				}
 			}
 		});
 		return this;
 	},
 	/* 获取匹配元素集合中的第一个元素的宽度的计算值  或  设置每个匹配元素的一个或多个宽度值 
     *@param{String} 类名
     *@return{Boolean}
 	 */
 	width(value){
 		return this.css("width", value);
 	},
 	/* 获取匹配元素集合中的第一个元素的高度的计算值  或  设置每个匹配元素的一个或多个高度值 
     *@param{String} 类名
     *@return{Boolean}
 	 */
 	height(value){
 		return this.css("width", value);
 	},
 	/** 在匹配的元素集合中，获取的第一个元素的当前坐标，或设置每一个元素的坐标，坐标相对于文档。  
     *@return{Object}
     */
 	offset(){
 		var elem = this[0];
		var left = elem.offsetLeft;
		var top  = elem.offsetTop;
		var parent = elem.offsetParent;
		while (parent && parent != document) {
			left  += parent.offsetLeft;
			top   += parent.offsetTop;
			parent = parent.offsetParent;
		} 
 		return {
 			left  : left,
 			top   : top
 		}
 	}
 });