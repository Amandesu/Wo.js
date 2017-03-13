/** 节点操作
 *
 */
 import {W} from "./w"
 import {Wo} from "./wo"
 import {encode} from "./tool"
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
	 *@param{Boolean}         remain   是否保留原有的节点
	 */
	append: function (value, fn, remain = true){
		W(value).insertAfter(W(this).lastChild(), fn , remain)
		return this;
	},
	/** 在每个匹配元素里面的开头处插入参数内容  
	 *@param{String|HTML DOM} value    可以是字符串也可以是dom节点,也可以是W节点
	 *@param{Boolean}         remain   是否保留原有的节点
	 */
	prepend: function (value, fn, remain = true) {
		W(value).insertBefore(W(this).children(0), fn , remain)
		return this;
	},
	/** 在目标元素前面插入集合中每个匹配的元素 
	 *@param{String|HTML DOM} value    可以是字符串也可以是dom节点,也可以是W节点
	 *@param{Boolean}         remain   是否保留原有的节点
	 */
	insertBefore: function (value, fn, remain = false) {
		if (!remain) {
			this.remove()
		}
		var dom = [];
		if (value && value.nodeType == 3) //如果为文本节点
			dom = [value];
		else 
			dom = W(value).get()

		dom.forEach(elem => {			
			var nodes = createDom(this);
			elem.parentNode.insertBefore(nodes, elem)
		});
		return this;
	},
	/** 在目标元素后面插入集合中每个匹配的元素 
	 *@param{String|HTML DOM} value    可以是字符串也可以是dom节点,也可以是W节点
	 *@param{Boolean}         remain   是否保留原有的节点
	 */
	insertAfter: function(value, fn, remain = false) {
		W(value).each(elem => {			
			this.insertBefore(elem.nextSibling, fn, remain)
		});
		return this;
	},
	/** 将匹配元素集合从DOM中删除 
	 *@return{W DOM}         
	 */
	remove(){
		this.each(elem => {
			let parent = elem.parentNode;
			if (parent) {
				parent.removeChild(elem)
			}	  
		});
		return this;
	},
	/**  获取集合中第一个匹配元素的HTML内容 或 设置每一个匹配元素的html内容。
   	 *@param{String} value
	 */
	html(value){
		if (!this.length) 
			return this; 
		if (value == undefined)       
			return this[0].innerHTML;
		this.each(elem => {
			elem.innerHTML = value;				
		});
		return this;
	},
	/**  获取集合中第一个匹配元素的text内容 或 设置每一个匹配元素的文本内容。
   	 *@param{String} value
	 */
	text(value){
		if (!this.length) return this;
		if (value == undefined)       return this[0].innerText;
		this.each(elem => {
			elem.innerHTML = encode(value);
		});
		return this;
	}
})

function createDom(value, remain) {
	if (W(value).length == 0) {                //如果为字符串则创造文本节点
		return document.createTextNode(value.selector);
	} else {
		var frags = document.createDocumentFragment();
		W(value).each(function(elem) {
			frags.appendChild(elem.cloneNode(true));
		})
		return frags;
	}
	return [];
}

W.prototype = W.fn;
Wo.W.prototype = W.fn;
