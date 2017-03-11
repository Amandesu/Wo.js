/* 
 *DOM节点的遍历和筛选
 */

import {W} from "./w"
import {Wo} from "./wo"
import {
	unique,
	toArray,
	isElemNode,
	isBoolean,
	isArray,
	type,
	isNumber,
} from  "./tool"

 var arrPro   = Array.prototype,
 	 push     = arrPro.push,
 	 slice    = arrPro.slice; 
 W.extend({
 	/** 获取元素集合的每一个父元素 
	 *@return{Object}
	 */
 	parent(){
		var dom = [];
		this.each(elem => dom.push(elem.parentNode || document) );
		return W(unique(dom))
	}, 
	/** 获取元素集合的每一个满足条件的祖先元素 
	 *@param{String} selector 
	 *@return{Object}
	 */
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
		return W(unique(dom))
	},
	/** 从节点开始向外查找节点  
	 *@param{String|Array} selector 选择器  
	 *@param{Object} context  范围 在这个节点范围内进行查找, 可以是W对象也可以是DOM对象
	 *@return{Object}
	 */
	closest(selector, context){         
		var dom = [],
			endNode = context;
		if (context) {
			if (typeof context == "string" || isElemNode(context))              
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
				} else if (isArray(selector)) {
					if (selector.some(elem => Wo.matches(parent, selector)))
						dom.push(parent);
				}
				if (endNode == parent) break;
				parent = parent.parentNode;
			}
		});
		return W(unique(dom));
	}, 
	/** 获取匹配元素集合中每个元素的满足条件的兄弟元素 
	 *@param{String|Array} selector 选择器  
	 *@param{Boolear}      hasOwn   是否包含自己
	 *@return{Object}
	 */
	siblings(selector, hasOwn){
		var dom = [];
		if (isBoolean(selector)) 
			[selector, hasOwn] = [hasOwn, selector]  

		this.each(elem => {
			var nodes = elem.parentNode.childNodes;
			nodes = W(nodes).filter(function(node){
				if (node == elem) {
					if (hasOwn)            //输出自身
						return true;                              
					else        
						return false;
				}
				if (!selector) 
					return true;                        		                       
				
				if (typeof selector == "string"){                         
					if (Wo.matches(node, selector))
						 return true;
					else return false;

				}else if (isArray(selector)) {                            
					if (selector.some((item) => Wo.matches(node, item)))
						 return true;
					else return false;
				}                            
				
			});
			dom.push(...nodes)
		});
		return W(unique(dom))
	},
	/** 获取匹配元素集合中每个元素的满足条件的孩子元素 
	 *@param{String} selector 选择器  
	 *@return{Object}
	 */
	children(selector){
		var dom = [], index = 0;
		
		this.each(elem => {
			let nodes = elem.childNodes.length > 0 && W(elem.childNodes).filter(function(node, i){
				if(selector == undefined){
					return true;
				} else if (isNumber(selector)) {
					if (selector == i) {
						return true
					} 
				} else {
				    return Wo.matches(node, selector)
				}
			}) 
			dom.push(...nodes);
		})
		return W(dom)
	},
	/** 获取匹配元素集合中每个元素的最后的孩子元素 
	 *@param{String} selector 选择器  
	 *@return{Object}
	 */
	lastChild(){
		var dom = [];
		this.each(elem => {
			var elem = W(elem).children();
			push.call(dom, elem[elem.length-1])
		})
		return W(dom);
	},
	/** 获取当前匹配的元素集合中每个元素的后代。
	 *@param{String} selector 选择器  
	 *@return{Object}
	 */
	find(selector){
		var sType = type(selector);
		var dom  = [];
		if (sType == "string") {
			this.each(function(elem){
				let elems = Wo.qsa(selector, elem);
				push.apply(dom, elems);
			})
		} 	
		return W(dom);
	},
	/** 获得指定索引的元素
	 *@param{Number} index 索引  
	 */
	eq(index){
		return this.slice(index, index+1)
	},
	/** 根据指定的下标范围，过滤匹配的元素集合，
	 *@param{Number} i 开始的索引  
	 *@param{Number} j 结束的索引  
	 */
	slice(i, j){
		return W(slice.call(this, i, j));
	},
	/** 获得下一个元素
	 *@param{Number} index 索引  
	 */
	next(){
		var dom = [];
		this.each(node => {
			var nextNode = node.nextSibling ;
			while(nextNode && nextNode.nodeType != 1) {
				nextNode = nextNode.nextSibling;
			};
			if (nextNode && nextNode.nodeType == 1) 
				dom.push(nextNode)
		});
		return W(unique(dom));
	},
	/** 获得元素集合中的最后一个元素
	 *@param{Number} index 索引  
	 */
	last(){
		return this.eq(this.length-1)
	},
	/** 从匹配的元素集合中移除指定的元素。
	 *@param{String} selector 选择器  
	 */
	not(selector) {
		var dom = [], nodes;
		if (typeof selector == "function") {
			let domTemp = this.get().filter(selector)
			return this.not(domTemp);
		} else if ((nodes = W(selector)).length > 0) {
			
			this.get().filter(elem => {
				if(
					nodes.get().every(function(node){
						return elem !== node
					})
				)  dom.push(elem)
			})
			return W(dom);
		} else if (selector == undefined) {
			return this;
		}
		return this;
	},
	/** 从匹配的元素集合中获取指定的元素。
	 *@param{String} selector 选择器  
	 */
	filter(selector) {
		return this.not(this.not(selector));
	}
 });
export {W}