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
		W(value).insertAfter(W(this).lastChild(), fn , remain)
		return this;
	},
	/** 在每个匹配元素里面的开头处插入参数内容  
	 *@param{String|HTML DOM} value    可以是字符串也可以是dom节点,也可以是W节点
	 *@param{Boolean}         remain   prepend方法默认保留
	 */
	prepend: function (value, fn, remain = true) {
		W(value).insertBefore(W(this).children(0), fn , remain)
		return this;
	},
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
	insertAfter: function(value, fn, remain = false) {
		W(value).each(elem => {			
			this.insertBefore(elem.nextSibling, fn, remain)
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
