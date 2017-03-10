/** 节点操作
 *
 */
 import {W} from "./w"
 import {Wo} from "./wo"
 import "./find"
/* "append prepend, beofore after insertBefore insertAfter".split(" ").forEach(
	function(method) {
		W.fn[method] = function() {
			return operator.call(this, method, value);
		}
	}
) */
W.extend({
	/** 在每个匹配元素里面的末尾处插入参数内容  
	 *@param{String|HTML DOM} value    可以是字符串也可以是dom节点,也可以是W节点
	 *@param{Boolean}         remain   append方法默认保留
	 */
	append: function (value, fn, remain = true){
		if (!remain) {
			W(value).remove()
		}
		this.each(function(elem){
			var dom = createDom(value, remain);
			if (dom.nodeType == 3)              //文本节点
				elem.appendChild(dom);
			else 
				dom.forEach(function(node){
					elem.appendChild(node)
				});
		});
	},
	/** 在每个匹配元素里面的开头处插入参数内容  
	 *@param{String|HTML DOM} value    可以是字符串也可以是dom节点,也可以是W节点
	 *@param{Boolean}         remain   prepend方法默认保留
	 */
	prepend: function (value, fn, remain = true) {
		if (!remain) {
			W(value).remove()
		}
		this.each(function(elem){
			W(value).insertBefore(W(elem).children(0), fn, true);
		})	
	},
	insertBefore: function (value, fn, remain = false) {
		if (!remain) {
			this.remove()
		}
		W(value).each(elem => {
			var dom = createDom(this);
			dom.forEach(function(node){
				elem.parentNode.insertBefore(node, elem);
			}); 
		});
	},
	insertAfter: function(value, fn, remain = false) {
		if (!remain) {
			this.remove()
		}
		W(value).each(elem => {
			var dom = createDom(this);
			dom.forEach(function(node){
				elem.parentNode.insertBefore(node, elem.nextSibling);
			}); 
		});
	}

})
function createDom(value, remain) {
	var type = getType(value);
	if (type == 3) {                //如果为字符串则创造文本节点
		return document.createTextNode(value);
	} else {
		var dom = W(value).map(function(elem) {
				return elem.cloneNode(true);
			}).get();
		return dom;
	}
	return [];
}
function getType(value) {
	var type = 3;
	if (W(value).length > 0) 
		type = 1
	else if (Wo.isW(value))  
	    type = 2   
	else                       
		type = 3 
	return type;
}
function operator(method, value){
	var dom = value, 
	    type = getType(),
	    self = this;
	if (!value) 
		return this;
	 
	 this.each(elem => {
		dom = getDom()                     //复制生成dom节点 所有的操作不改变原有的节点
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
W.prototype = W.fn;
Wo.W.prototype = W.fn;
