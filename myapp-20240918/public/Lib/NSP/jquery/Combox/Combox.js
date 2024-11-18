/*
* a javascript library used to mobile phone web develop
* 3q & enjoy it!
* @author 薛端阳<xueduanyang1985@163.com>
* @copyright 薛端阳  since 2011.10
*/

/**
 * Kit Js 基类，包含基本dom操作，object类型判断以及ready方法，还有事件委托等
 * @constructor $Kit
 * @param {Object} config 组件配置
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/kit.js">Source code</a>
 */

var b1, b2, b3;

var Combobox = function () {
   var inputname_i = 0;
   var inputname = new Array('academy', 'department', 'major');
$Kit = function(config) {
	var me = this;
	var defaultConfig = {
		//默认配置
	}
	me.config = me.join(config, defaultConfig);
	// -----------------------------init------------------------------------
	window[me.CONSTANTS.KIT_EVENT_STOPALLEVENT] = false;
	window[me.CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION] = false;
	// me.SYSINFO = {}
	// var inf = me.iOSInfo();
	// if(inf != null) {
	// me.merge(me.SYSINFO, inf);
	// }
	/**
	 * @namespace $kit.ui
	 */
	me.ui = {};
}
$Kit.prototype = {
	constructor : $Kit,
	//----------------------CONSTANTS----------------------
	/**
	 * KitJs内部常量
	 * @enum
	 * @const
	 * @public
	 * @type {Object}
	 */
	CONSTANTS : {
		/**
		 * 异常处理,最大循环次数
		 */
		MAX_CYCLE_COUNT : 1000,
		/**
		 * element节点
		 */
		NODETYPE_ELEMENT : 1,
		NODETYPE_ELEMENT_ATTR : 2,
		/**
		 * 文本节点
		 */
		NODETYPE_TEXTNODE : 3,
		/**
		 * 注释
		 */
		NODETYPE_COMMENT : 8,
		/**
		 * 根
		 */
		NODETYPE_ROOT : 9,
		/**
		 * doc fragment
		 */
		NODETYPE_FRAGMENT : 11,
		/**
		 * contains比较结果-同一个
		 */
		DOCUMENT_POSITION_SAME : 0, //同一个
		/**
		 * contains比较结果-不在一个文档
		 */
		DOCUMENT_POSITION_DISCONNECTED : 1, //不在一个文档
		/**
		 * contains比较结果-b在a前面
		 */
		DOCUMENT_POSITION_PRECEDING : 2, //b在a前面
		/**
		 * contains比较结果-b在a后面
		 */
		DOCUMENT_POSITION_FOLLOWING : 4, //b在a后面
		/**
		 * contains比较结果-b是a祖先
		 */
		DOCUMENT_POSITION_CONTAINS : 10, //b是a祖先
		/**
		 * contains比较结果-b是a儿子
		 */
		DOCUMENT_POSITION_CONTAINED_BY : 20, //b是a儿子
		/**
		 * contains比较结果-不常用
		 */
		DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : 32, //不常用
		/**
		 * 空格正则
		 */
		REGEXP_SPACE : /\s+/g,
		/**
		 * kit事件注册前缀
		 */
		KIT_EVENT_REGISTER : "_kit_event_register_",
		/**
		 * kit事件注册前缀
		 */
		KIT_EVENT_REGISTER_EVENT : "_kit_event_register_event",
		/**
		 * kit事件注册前缀
		 */
		KIT_EVENT_REGISTER_FUNCTION : "_kit_event_register_function",
		/**
		 * kit事件信号--立即停止所有事件
		 */
		KIT_EVENT_STOPIMMEDIATEPROPAGATION : "_kit_event_stopimmediatepropagation_",
		/**
		 * kit事件信号--停止所有事件
		 */
		KIT_EVENT_STOPALLEVENT : "_kit_event_stopallevent_",
		/**
		 * kit DOM ID 默认前缀
		 */
		KIT_DOM_ID_PREFIX : "J_Kit_"
	},
	// -----------------------------------is
	// something-----------------------------------
	/**
	 * 判断是否IE
	 * @return {Boolean}
	 */
	isIE : function() {
		return /MSIE/i.test(navigator.userAgent);
	},
	/**
	 * 是否是chrome
	 * @return {Boolean}
	 */
	isChrome : function() {
		return /Chrome/i.test(navigator.userAgent);
	},
	isWebKit : function() {
		return /WebKit/i.test(navigator.userAgent);
	},
	/**
	 * 是否是火狐
	 * @return {Boolean}
	 */
	isFirefox : function() {
		return /Firefox/i.test(navigator.userAgent);
	},
	/**
	 * 是否已定义
	 * @param {Object}
	 * @return {Boolean}
	 */
	isDefined : function(o) {
		return typeof (o) != "undefined";
	},
	/**
	 * 是否是字符串
	 * @param {Object}
	 * @return {Boolean}
	 */
	isStr : function(o) {
		return typeof (o) == "string";
	},
	/**
	 * 是否数字
	 * @param {Object}
	 * @return {Boolean}
	 */
	isNum : function(o) {
		return isFinite(o)
	},
	/**
	 * 是否是日期
	 * @param {Object}
	 * @return {Boolean}
	 */
	isDate : function(o) {
		return (null != o) && !isNaN(o) && ("undefined" !== typeof o.getDate);
	},
	/**
	 * 是否是对象类型
	 * @param {Object}
	 * @return {Boolean}
	 */
	isObj : function(o) {
		return !!(o && typeof (o) == "object" );
	},
	/**
	 * 是否是方法类型
	 * @param {Object}
	 * @return {Boolean}
	 */
	isFn : function(o) {
		return !!(o && typeof (o) == "function");
	},
	/**
	 * 是否是可以迭代
	 * @param {Object}
	 * @return {Boolean}
	 */
	isAry : function(o) {
		var me = this;
		return !!(o && (o.constructor && o.constructor.toString().indexOf("Array") > -1 || me.isNodeList(o)));
	},
	/**
	 * 是否是节点列表
	 * @param {Object}
	 * @return {Boolean}
	 */
	isNodeList : function(o) {
		return !!(o && (o.toString() == '[object NodeList]' || o.toString() == '[object HTMLCollection]' || (o.length && this.isNode(o[0]))));
	},
	/**
	 * 是否是节点
	 * @param {Object}
	 * @return {Boolean}
	 */
	isNode : function(o) {
		return !!(o && o.nodeType);
	},
	/**
	 * 一个字符串能否根据空格拆分成一个数组，数组内元素个数大于1
	 * @param {String}
	 * @return {Boolean}
	 */
	isCanSplit2Ary : function(o, sign) {
		var me = this;
		return me.isStr(o) && o.split(sign || /\s+/g).length > 1;
	},
	/**
	 * 是否为空
	 * @param {Object}
	 * @return {Boolean}
	 */
	isEmpty : function(o) {
		var me = this;
		return typeof (o) == "undefined" || o == null || (!me.isNode(o) && me.isAry(o) && o.length == 0 || (me.isStr(o) && o == ""));
	},
	// -----------------------------------string-----------------------------------
	/**
	 * 去除所有空格
	 * @param {String}
	 * @return {String}
	 */
	trimAll : function(str) {
		if(str == null) {
			return null;
		}
		str = str.toString();
		return str.replace(/\s+/ig, "");
	},
	// -----------------------------------array-----------------------------------
	/**
	 * 从一个数组里面剔除部分元素
	 * @param {String|Array}
	 * @return {Array}
	 */
	aryDel : function(ary, del) {
		var me = this;
		if(!me.isAry(ary)) {
			return;
		}
		if(me.isAry(del)) {
			for(var i = 0; i < del.length; i++) {
				me.aryDel(ary, del[i]);
			}
		} else {
			for(var j = 0; j < ary.length; j++) {
				if(ary[j] == del) {
					ary.splice(j, 1);
				}
			}
		}
		return ary;
	},
	/**
	 * 判断是否数组中是否存在参数
	 * @param {String|Array}
	 * @return {Boolean}
	 */
	inAry : function(ary, o) {
		var me = this, flag = false;
		if(!me.isAry(ary)) {
			return;
		}
		for(var i = 0; i < ary.length; i++) {
			if(me.isAry(o)) {
				for(var j = 0; j < o.length; j++) {
					if(ary[i] == o[j]) {
						flag = true;
						break;
					}
				}
			} else {
				if(ary[i] == o) {
					flag = true;
					break;
				}
			}
		}
		return flag;
	},
	// -----------------------------------find dom-----------------------------------
	/**
	 * ==document.getElementById 根据id选择
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {Element}
	 */
	el8id : function(id, root) {
		var me = this, re = document.getElementById(id);
		if(root) {
			if(me.contains(root, re)) {
				return re;
			}
			return null;
		}
		return re;
	},
	/**
	 * ==document.getElementsByClassName 根据className选择，返回第一个找到的
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {Element|Null}
	 */
	el8cls : function(cls, root) {
		var re = (root || document).getElementsByClassName(cls);
		return (re != null && re.length ) ? re[0] : null;
	},
	/**
	 * ==document.getElementsByClassName 根据className选择，返回所有找到的
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	els8cls : function(cls, root) {
		var re = (root || document).getElementsByClassName(cls);
		return re != null && re.length ? re : null;
	},
	/**
	 * ==document.getElementsByTagName 根据tagName选择，返回所有找到的
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	els8tag : function(tagName, root) {
		var re = (root || document).getElementsByTagName(tagName);
		return re != null && re.length ? re : null;
	},
	/**
	 * ==document.getElementsByTagName 根据tagName选择，返回第一个找到的
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	el8tag : function(tagName, root) {
		var me = this;
		var re = me.els8tag(tagName, root);
		return re != null && re.length ? re[0] : null;
	},
	/**
	 * ==document.getElementsByName 根据name选择，返回第一个找到的
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	el8name : function(name, root) {
		var me = this, re = document.getElementsByName(name);
		if(root) {
			for(var i = 0; i < re.length; i++) {
				if(me.contains(root, re[i])) {
					return re[i];
				}
			}
			return null;
		}
		return (re != null && re.length ) ? re[0] : null;
	},
	/**
	 * ==document.getElementsByName 根据name选择，返回所有找到的
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	els8name : function(name, root) {
		var me = this, re = document.getElementsByName(name);
		if(root) {
			var _re = [];
			for(var i = 0; i < re.length; i++) {
				if(me.contains(root, re[i])) {
					_re.push(re[i]);
				}
			}
			return _re.length ? _re : null;
		}
		return re != null && re.length ? re : null;
	},
	/**
	 * 简单Css选择器 支持#id，.className，@formName，还有tagName.className，四种格式
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	el : function(selector, root) {
		var me = this;
		if(me.isEmpty(selector)) {
			return;
		} else if(me.isNode(selector) || me.isNodeList(selector)) {
			return selector;
		}
		var selector = selector.toString().trim();
		if(selector.indexOf("#") == 0) {
			return me.el8id(selector.substring(1), root);
		} else if(selector.indexOf(".") == 0) {
			var a = me.els8cls(selector.substring(1), root), re = [];
			if(a.constructor && a.constructor.toString().indexOf("Array") > -1) {
				re = a;
			} else {
				for(var i = 0; i < a.length; i++) {
					re.push(a[i]);
				}
			}
			return re;
		} else if(selector.indexOf("@") == 0) {
			var a = me.els8name(selector.substring(1), root), re = [];
			for(var i = 0; i < a.length; i++) {
				re.push(a[i]);
			}
			return re;
		} else {
			var re = [];
			if(selector.indexOf(".") > 0 && selector.indexOf(".") < selector.length) {
				var a = me.els8tag(selector.substring(0, selector.indexOf(".")), root);
				var cls = selector.substr(selector.indexOf(".") + 1);
				for(var i = 0; !me.isEmpty(a) && i < a.length; i++) {
					if(me.hsCls(a[i], cls)) {
						re.push(a[i]);
					}
				}
			} else {
				re = me.els8tag(selector, root);
			}
			return re;
		}

	},
	// -----------------------------------dom manipulate-----------------------------------
	/**
	 * 比较element位置 如果a包含b返回true，否则返回false
	 * @param {Element}
	 * @param {Element}
	 * @reutn {Boolean}
	 */
	contains : function(a, b) {
		return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
	},
	/**
	 * 设置或者获取Element的attribute
	 * @param {Element}
	 * @param {String|Object} attr 可以为属性值，也可以为一个枚举对象，按照key,value顺序批量设置
	 * @param {String} [value]
	 * @reutn {String|Null}
	 */
	attr : function(el, attr, value) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		if(!me.isDefined(value)) {
			if(me.isObj(attr)) {
				for(var l in attr) {
					el.setAttribute(l, attr[l]);
				}
			} else {
				return el.getAttribute(attr);
			}
		} else {
			if(value == null) {
				if( attr in el) {
					try {
						el[attr] = null;
					} catch(e) {
					}
				}
				if(el.removeAttribute) {
					el.removeAttribute(attr);
				} else {
					el.setAttribute(attr, null);
				}
				try {
					delete el[attr];
				} catch(e) {
				}
			} else {
				el.setAttribute(attr, value);
			}
		}
	},
	/**
	 * 设置或者获取Element的css
	 * @param {Element}
	 * @param {String|Object} attr 可以为属性值，也可以为一个枚举对象，按照key,value顺序批量设置
	 * @param {String} [value]
	 * @reutn {String|Null}
	 */
	css : function(el, attr, value) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		if(value == null) {
			if(me.isObj(attr)) {
				for(var l in attr) {
					if(l.indexOf('-moz-') == 0) {
						var l1 = '';
						$kit.each(l.split('-'), function(o) {
							if(o.length) {
								l1 += o.substring(0, 1).toUpperCase() + o.substring(1, o.length);
							}
						});
						el.style[l1] = attr[l];
					} else {
						if(!me.isWebKit()) {
							l = me._camelCssName(l);
						}
						el.style[l] = attr[l];
					}
				}
			} else {
				var re = getComputedStyle(el, null)[this._camelCssName(attr)];
				try {
					re = isNaN(parseFloat(re)) ? re : parseFloat(re);
				} catch(e) {
					//
				}
				return re;
			}
		} else {
			if(attr.indexOf('-moz-') == 0) {
				var attr1 = '';
				$kit.each(attr.split('-'), function(o) {
					if(o.length) {
						attr1 += o.substring(0, 1).toUpperCase() + o.substring(1, o.length);
					}
				});
				el.style[attr1] = value;
			} else {
				if(!me.isWebKit()) {
					attr = me._camelCssName(attr);
				}
				el.style[attr] = value;
			}
		}
	},
	_camelCssName : function(str) {
		var a = str.split('-');
		for(var i = 1; i < a.length; i++) {
			a[i] = a[i].substr(0, 1).toUpperCase() + a[i].substr(1);
		}
		return a.join('');
	},
	/**
	 * 获取Element的cssStr
	 * @param {Element}
	 * @param {String}
	 */
	cssStr : function(el, attr) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		if(attr.indexOf('-moz-') == 0) {
			var attr1 = '';
			$kit.each(attr.split('-'), function(o) {
				if(o.length) {
					attr1 += o.substring(0, 1).toUpperCase() + o.substring(1, o.length);
				}
			});
			attr = attr1;
		} else {
			attr = this._camelCssName(attr);
		}
		var re = el.style[attr] || getComputedStyle(el, null)[attr];
		return re;
	},
	_camelCssName : function(str) {
		var firstLetter = str.substring(0, 1);
		var mainStr = str.substr(1);
		var a = mainStr.split('-');
		for(var i = 1; i < a.length; i++) {
			a[i] = a[i].substr(0, 1).toUpperCase() + a[i].substr(1);
		}
		return firstLetter.toLowerCase() + a.join('');
	},
	/**
	 * 取值 div等取innerHTML textarea等form元素取value
	 * @param {Element}
	 * @return {String}
	 */
	val : function(el) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		if(me.isNode(el) && ('value' in el)) {
			return el.value;
		} else if(me.isNodeList(el) && el.length > 1) {
			var a = [];
			for(var i = 0; i < el.length; i++) {
				if(el[i].checked && el[i].value) {
					a.push(el[i].value);
				}
			}
			return a.join(',');
		} else if(el.length == 1) {
			return me.val(el[0]);
		}
		return el.innerHTML;
	},
	/**
	 * 插入元素
	 * @param {Object} config
	 * @param {String} config.pos pos表示插入位置，有last,first,before(previous),after(nextSibling)，4种类型值
	 * @param {Element} config.where where为被插入目标Element
	 * @param {Element|String} config.what what为插入值，可以为一段HTML，也可以为一个HTML Node
	 */
	insEl : function(config) {
		var me = this, defaultConfig = {
			pos : "last",
			what : null,
			where : null
		}
		config = me.join(defaultConfig, config);
		var what = config.what, where = config.where;
		if(!me.isEmpty(what) && me.isNode(where)) {
			switch (config.pos.toString().toLowerCase()) {
				case "first" :
					if(me.isStr(what)) {
						me.insertHTML(where, "afterBegin", what);
					} else {
						me.insertNode(where, "afterBegin", what);
					}
					break;
				case "before" :
				case "previous" :
					if(me.isStr(what)) {
						me.insertHTML(where, "beforeBegin", what);
					} else {
						me.insertNode(where, "beforeBegin", what);
					}
					break;
				case "after" :
				case "nextsibling" :
					if(me.isStr(what)) {
						me.insertHTML(where, "afterEnd", what);
					} else {
						me.insertNode(where, "afterEnd", what);
					}
					break;
				case "last" :
					if(me.isStr(what)) {
						me.insertHTML(where, "beforeEnd", what);
					} else {
						me.insertNode(where, "beforeEnd", what);
					}
					break;
				default:
				//i don`t know how to do that
			}
		}
	},
	/**
	 * @private
	 */
	insertNode : function(el, where, parsedNode) {
		switch(where) {
			case "beforeBegin":
				el.parentNode.insertBefore(parsedNode, el);
				break;
			case "afterBegin":
				el.insertBefore(parsedNode, el.firstChild);
				break;
			case "beforeEnd":
				el.appendChild(parsedNode);
				break;
			case "afterEnd":
				if(el.nextSibling) {
					el.parentNode.insertBefore(parsedNode, el.nextSibling);
				} else {
					el.parentNode.appendChild(parsedNode);
				}
				break;
		}
	},
	/**
	 * @private
	 */
	insertHTML : function(el, where, html) {
		where = where.toLowerCase();
		if(el.insertAdjacentHTML) {
			switch(where) {
				case "beforebegin":
					el.insertAdjacentHTML('BeforeBegin', html);
					return el.previousSibling;
				case "afterbegin":
					el.insertAdjacentHTML('AfterBegin', html);
					return el.firstChild;
				case "beforeend":
					el.insertAdjacentHTML('BeforeEnd', html);
					return el.lastChild;
				case "afterend":
					el.insertAdjacentHTML('AfterEnd', html);
					return el.nextSibling;
			}
			throw 'Illegal insertion point -> "' + where + '"';
		}
		var range = el.ownerDocument.createRange();
		var frag;
		switch(where) {
			case "beforebegin":
				range.setStartBefore(el);
				frag = range.createContextualFragment(html);
				el.parentNode.insertBefore(frag, el);
				return el.previousSibling;
			case "afterbegin":
				if(el.firstChild) {
					range.setStartBefore(el.firstChild);
					frag = range.createContextualFragment(html);
					el.insertBefore(frag, el.firstChild);
					return el.firstChild;
				} else {
					el.innerHTML = html;
					return el.firstChild;
				}
			case "beforeend":
				if(el.lastChild) {
					range.setStartAfter(el.lastChild);
					frag = range.createContextualFragment(html);
					el.appendChild(frag);
					return el.lastChild;
				} else {
					el.innerHTML = html;
					return el.lastChild;
				}
			case "afterend":
				range.setStartAfter(el);
				frag = range.createContextualFragment(html);
				el.parentNode.insertBefore(frag, el.nextSibling);
				return el.nextSibling;
		}
		throw 'Illegal insertion point -> "' + where + '"';
	},
	/**
	 * 替换元素
	 * @param {Element}
	 * @param {Element|String} html 为一个html元素或者一段HTML string
	 */
	rpEl : function(element, html) {
		var me = this;
		if(me.isEmpty(element) || me.isEmpty(html)) {
			return;
		}
		if($kit.isStr(html)) {
			var range = element.ownerDocument.createRange();
			range.selectNodeContents(element);
			element.parentNode.replaceChild(range.createContextualFragment(html), element);
			range.detach();
		} else if($kit.isNode(html)) {
			element.parentNode.replaceChild(html, element);
		}
	},
	/**
	 * 删除元素
	 * @param {Element}
	 */
	rmEl : function(element) {
		var me = this;
		if(me.isEmpty(element)) {
			return;
		}
		if(me.isAry(element)) {
			for(var i = 0; i < element.length; i++) {
				me.rmEl(element[i]);
			}
		} else {
			me.traversal({
				root : element,
				fn : function(node) {
					me.delEv({
						el : node
					});
				}
			});
			element.parentNode.removeChild(element, true);
		}
	},
	/**
	 * 添加className
	 * @param {Element}
	 * @param {String}
	 */
	adCls : function(el, cls) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		/*
		 if(me.isAry(clss)) {
		 for(var i = 0; i < clss.length; i++) {
		 me.adCls(el, clss[i]);
		 }
		 } else {
		 var a = me.isEmpty(el.className) ? [] :
		 el.className.split(me.CONSTANTS.REGEXP_SPACE), flag = true;
		 for(var i = 0; i < a.length; i++) {
		 if(a[i] == clss) {
		 flag = false;
		 break;
		 }
		 }
		 if(flag) {
		 a.push(clss);
		 el.className = a.join(" ");
		 }
		 }*/
		var re = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		if(re.test(el.className))
			return;
		//el.className += ' ' + cls;
		el.className = el.className.split(/\s+/).join(' ') + ' ' + cls;
	},
	/**
	 * 删除ClassName
	 * @param {Element}
	 * @param {String}
	 */
	rmCls : function(el, cls) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		/*
		 var a = me.isEmpty(el.className) ? [] :
		 el.className.split(me.CONSTANTS.REGEXP_SPACE), b = [];
		 if(a.length) {
		 b = me.aryDel(a, clss);
		 }
		 if(b.length) {
		 el.className = b.join(" ");
		 } else {
		 el.className = "";
		 me.attr(el, 'class', null);
		 }*/
		var clsAry = cls.split(/\s+/g);
		var reCls = el.className;
		for(var i = 0; i < clsAry.length; i++) {
			var cls = clsAry[i];
			var re = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			if(reCls) {
				reCls = reCls.replace(re, ' ');
			}
		}
		reCls = reCls.trim();
		el.className = reCls;
	},
	/**
	 * 判断是否含有某个className
	 * @param {Element}
	 * @param {String}
	 */
	hsCls : function(el, cls) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		/*
		 if(!me.isEmpty(el.className)) {
		 var a = el.className.split(me.CONSTANTS.REGEXP_SPACE);
		 for(var i = 0; i < a.length; i++) {
		 if(a[i] == cls) {
		 flag = true;
		 break;
		 }
		 }
		 }
		 return flag;
		 */
		var re = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		return re.test(el.className);
	},
	/**
	 * 切换css，有则删，无则加
	 * @param {Element}
	 * @param {String}
	 */
	toggleCls : function(el, cls) {
		var me = this;
		if(me.hsCls(el, cls)) {
			me.rmCls(el, cls);
		} else {
			me.adCls(el, cls);
		}
	},
	/**
	 * Dom遍历
	 * @param {Object} config
	 * @param {Object} config.root 遍历的根节点，表示从哪儿开始遍历
	 * @param {Object} config.fn 每遍历一个节点，执行的方法fn(node,root)
	 */
	traversal : function(config) {
		var me = this, defaultConfig = {
			root : document.body
		}
		me.mergeIf(config, defaultConfig);
		if(me.isEmpty(config.node)) {
			config.node = config.root;
		}
		if($kit.isFn(config.fn)) {
			config.fn.apply(config.node, [config.node, config.root])
		} else {
			return;
		}
		for(var i = 0; i < config.node.childNodes.length; i++) {
			var o = config.node.childNodes[i];
			me.traversal(me.join(config, {
				node : o
			}));
		}

	},
	/**
	 * 返回当前元素满足条件的下一个元素
	 * @param {Element}
	 * @param {Function} condition 用于检测是否满足条件的方法，返回true表示满足
	 * @param {Obejct} [scope] 执行condition时候的this指针
	 * @return {Element}
	 */
	nextEl : function(el, condition, scope) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		var next = null;
		if(el.nextElementSibling != null) {
			next = el.nextElementSibling;
		} else {
			var parent = el.parentNode;
			while(parent != null && parent.parentNode != null && parent == parent.parentNode.lastElementChild) {
				parent = parent.parentNode;
			}
			var firstEl = parent.nextElementSibling.firstElementChild;
			while(firstEl != null && firstEl.children.length > 0 && firstEl.firstElementChild != null) {
				firstEl = firstEl.firstElementChild;
			}
			next = firstEl;
		}
		if(next != null) {
			var condition = condition || null, scope = scope || null;
			if(me.isFn(condition)) {
				if(condition.call(scope, next, el) == true) {
					return next;
				} else if(condition.call(scope, next, el) == false) {
					return null;
				} else {
					var allNodes = document.getElementsByTagName("*");
					if(next != allNodes[allNodes.length - 1]) {
						return me.nextEl(next, condition, scope);
					} else {
						return null;
					}
				}
			}
		}
		return next;
	},
	/**
	 * 返回当前元素满足条件的前一个元素
	 * @param {Element}
	 * @param {Function} condition 用于检测是否满足条件的方法，返回true表示满足
	 * @param {Obejct} [scope] 执行condition时候的this指针
	 * @return {Element}
	 */
	prevEl : function(el, condition, scope) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		var prev = null;
		if(el.previousElementSibling != null) {
			prev = el.previousElementSibling;
		} else {
			var parent = el.parentNode;
			while(parent != null && parent.parentNode != null && parent == parent.parentNode.firstElementChild) {
				parent = parent.parentNode;
			}
			var lastEl = parent.previousElementSibling.lastElementChild;
			while(lastEl != null && lastEl.children.length > 0 && lastEl.lastElementChild != null) {
				lastEl = lastEl.lastElementChild;
			}
			prev = lastEl;
		}
		if(prev != null) {
			var condition = condition || null, scope = scope || null;
			if(me.isFn(condition)) {
				if(condition.call(scope, prev, el) == true) {
					return prev;
				} else if(condition.call(scope, prev, el) == false) {
					return null;
				} else {
					var allNodes = document.getElementsByTagName("*");
					if(prev != allNodes[0]) {
						return me.prevEl(prev, condition, scope);
					} else {
						return null;
					}
				}
			}
		}
		return prev;
	},
	/**
	 * 返回当前元素满足条件的父元素
	 * @param {Element}
	 * @param {Function} condition 用于检测是否满足条件的方法，返回true表示满足
	 * @param {Obejct} [scope] 执行condition时候的this指针
	 * @return {Element}
	 */
	parentEl : function(el, condition, scope) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		var parent = null;
		if(el.parentNode != null && el.parentNode != el) {
			parent = el.parentNode;
			var condition = condition || null, scope = scope || null;
			if(me.isFn(condition)) {
				if(condition.call(scope, parent, el) == true) {
					return parent;
				} else if(condition.call(scope, parent, el) == false) {
					return null;
				} else {
					return me.parentEl(parent, condition, scope);
				}
			}
		}
		return parent;
	},
	/**
	 * 返回一个 documentFragment，包含了HTML
	 * @param {String}
	 * @return {DocumentFragment}
	 */
	newHTML : function(html) {
		var me = this;
		if(me.isEmpty(html)) {
			return;
		}
		var box = document.createElement("div");
		box.innerHTML = html;
		var o = document.createDocumentFragment();
		while(box.childNodes && box.childNodes.length) {
			o.appendChild(box.childNodes[0]);
		}
		box = null;
		return o;
	},
	/**
	 * 计算元素相对于doc的 绝对偏移
	 * @param {Element}
	 * @return {Number} top 距离顶部
	 * @return {Number} left 距离左边
	 * @return {Number} height 高度
	 * @return {Number} width 宽度
	 * @return {Number} bottom 底部距离顶部
	 * @return {Number} right 右边距离最左边
	 * @return {Number} middleTop 中间距离顶部
	 * @return {Number} middleLeft 中间距离最左边
	 */
	offset : function(el) {
		var me = this;
		if(me.isEmpty(el)) {
			return;
		}
		var top = el.offsetTop, //
		left = el.offsetLeft, //
		width = el.offsetWidth, //
		height = el.offsetHeight;
		while(el.offsetParent != null && el.offsetParent != el) {
			el = el.offsetParent;
			top += el.offsetTop;
			left += el.offsetLeft;
		}
		return {
			top : top,
			left : left,
			width : width,
			height : height,
			bottom : top + height,
			right : left + width,
			middleTop : top + height / 2,
			middleLeft : left + width / 2
		}
	},
	/**
	 * 计算元素相对于doc的 绝对偏移
	 * @param {Element}
	 * @return {Number} clientWidth 可视内容的宽度
	 * @return {Number} clientHeight 可视内容的高度
	 * @return {Number} scrollWidth 滚动条的宽度
	 * @return {Number} scrollHeight 滚动条的高度
	 * @return {Number} scrollLeft 滚动条距离左边的宽度
	 * @return {Number} scrollTop 滚动条距离顶部的高度
	 */
	viewport : function() {
		var cWidth, cHeight, sWidth, sHeight, sLeft, sTop;
		if(document.compatMode == "BackCompat") {
			cWidth = document.body.clientWidth;
			cHeight = document.body.clientHeight;
			sWidth = document.body.scrollWidth;
			sHeight = document.body.scrollHeight;
			sLeft = document.body.scrollLeft;
			sTop = document.body.scrollTop;
		} else {//document.compatMode == "CSS1Compat"
			cWidth = document.documentElement.clientWidth;
			cHeight = document.documentElement.clientHeight;
			sWidth = document.documentElement.scrollWidth;
			sHeight = document.documentElement.scrollHeight;
			sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
			sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
		}
		return {
			clientWidth : cWidth,
			clientHeight : cHeight,
			scrollWidth : sWidth,
			scrollHeight : sHeight,
			scrollLeft : sLeft,
			scrollTop : sTop
		}
	},
	// -----------------------------------event-----------------------------------
	// -----------------------------------event-----------------------------------
	/**
	 * kit事件注册方法
	 * kitjs的事件对象event拥有以下属性
	 * target: 当前事件触发元素
	 * currentTarget：注册该事件的元素
	 * relatedTarget: 事件触发相关的元素，当事件在两个元素之间发生时候，这个有值，兼容了toElement,fromElement
	 * offsetX/Y: 事件相当于target的x,y
	 * clientX/Y: 事件相当于viewport的x,y
	 * pageX/Y: 事件相当于doc的
	 * firstFingerClientX/Y: 移动设备的touchmove
	 * firstFingerPageX/Y: 移动设备的touchmove
	 * stopNow(): 立即停止所有
	 * stopDefault(): 停止默认事件触发
	 * stopGoOn(): 停止冒泡
	 * @param {Object} config
	 * @param {Selector|Element|NodeList} config.el 触发事件的元素，等于event.currentTarget
	 * @param {String} config.ev 事件type，如click
	 * @param {Function} config.fn 事件方法
	 * @param {Object} config.scope this指针
	 */
	ev : function(config) {
		var me = this, defaultConfig = {
			el : window,
			ev : null,
			fn : null,
			scope : null
		}
		config = me.join(defaultConfig, config);
		if(me.isAry(config.el)) {
			for(var i = 0; i < config.el.length; i++) {
				me.ev(me.join(config, {
					el : config.el[i]
				}));
			}
		} else if(me.isCanSplit2Ary(config.el)) {
			var a = config.el.split(me.CONSTANTS.REGEXP_SPACE)
			for(var i = 0; i < a.length; i++) {
				var _el = me.el8id(a[i]);
				if(!me.isEmpty(_el)) {
					me.ev(me.join(config, {
						el : _el
					}));
				}
			}
		} else if(me.isStr(config.el)) {
			var _el = me.el(config.el);
			if(me.isEmpty(_el)) {
				_el = me.el("#" + config.el);
			}
			if(!me.isEmpty(_el)) {
				me.ev(me.join(config, {
					el : _el
				}));
			}
		} else if(me.isAry(config.ev)) {
			for(var i = 0; i < config.ev.length; i++) {
				me.ev(me.join(config, {
					ev : config.ev[i]
				}));
			}
		} else if(me.isCanSplit2Ary(config.ev)) {
			var a = config.ev.split(me.CONSTANTS.REGEXP_SPACE);
			for(var i = 0; i < a.length; i++) {
				me.ev(me.join(config, {
					ev : a[i]
				}));
			}
		} else {
			if(!me.isEmpty(config.el) && !me.isEmpty(config.ev) && !me.isEmpty(config.fn)) {
				config.ev = config.ev.toString().trim();
				// -------webkit support stopImmediatePropagation, so comment
				// this template
				var evReg = config.el[me.CONSTANTS.KIT_EVENT_REGISTER] = config.el[me.CONSTANTS.KIT_EVENT_REGISTER] || {};
				var evRegEv = evReg[me.CONSTANTS.KIT_EVENT_REGISTER_EVENT] = evReg[me.CONSTANTS.KIT_EVENT_REGISTER_EVENT] || {};
				var evRegFn = evReg[me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION] = evReg[me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION] || {};
				evRegEv[config.ev] = evRegEv[config.ev] || [];
				evRegFn[config.ev] = evRegFn[config.ev] || (function() {
					/*try {*/
					// stop global event on-off
					if(window[me.CONSTANTS.KIT_EVENT_STOPALLEVENT]) {
						return;
					}
					var EV = arguments[0] || window.event;

					me.mergeIf(EV, {
						target : EV.target || EV.srcElement,
						currentTarget : config.el,
						relatedTarget : EV.relatedTarget ? EV.relatedTarget : EV.toElement || EV.fromElement
					});
					//add dragElement temp reg
					if(!$kit.isEmpty($kit.event) && $kit.isEmpty(EV.relatedTarget) && !$kit.isEmpty($kit.event.dragElement) && (EV.type.indexOf('drag') == 0 || EV.type.indexOf('drop') == 0)) {
						EV.dragElement = $kit.event.dragElement;
					}
					me.mergeIf(EV, {
						stopNow : function() {
							EV.stopPropagation && EV.stopPropagation();
							EV.preventDefault && EV.preventDefault();
							//
							EV.cancelBubble = true;
							EV.returnValue = false;
							//
							window[me.CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION] = true;
						},
						stopDefault : function() {
							EV.preventDefault && EV.preventDefault();
							EV.returnValue = false;
						},
						stopGoOn : function() {
							//EV.preventDefault && EV.preventDefault();
							EV.stopPropagation && EV.stopPropagation();
							//
							EV.cancelBubble = true;
							//EV.returnValue = false;
						}
					}, me.evExtra(EV));
					var target = config.el;
					var evQueue = target[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_EVENT][config.ev];
					var returnValue;
					for(var i = 0; i < evQueue.length; i++) {
						if(window[me.CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION]) {
							break;
						}
						var _evConfig = evQueue[i];
						returnValue = _evConfig.fn.apply(_evConfig.scope || _evConfig.el, [EV, _evConfig]);
					}
					window[me.CONSTANTS.KIT_EVENT_STOPIMMEDIATEPROPAGATION] = false;
					/*
					 } catch(e) {
					 alert(e);
					 throw e;
					 };*/
					if(returnValue != null) {
						return returnValue;
					}
				});
				if(document.attachEvent) {
					config.el.attachEvent('on' + config.ev, config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION][config.ev]);
				} else {
					config.el.addEventListener(config.ev, config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION][config.ev], false);
				}
				evRegEv[config.ev].push(config);
			} else {
				if(!me.isEmpty(config.el) && !me.isEmpty(config.ev) && me.isEmpty(config.fn)) {
					if(window[me.CONSTANTS.KIT_EVENT_STOPALLEVENT]) {
						return;
					}
					// var evt = document.createEvent('Event');
					// evt.initEvent(config.ev, true, true);
					// config.el.dispatchEvent(evt);
					me.newEv({
						el : config.el,
						type : 'Events',
						ev : config.ev,
						bubbles : true,
						cancelable : true
					});
				}
			}
		}
	},
	/**
	 * kit事件注销方法
	 * @param {Object} config
	 * @param {Selector|Element|NodeList} config.el 触发事件的元素，等于event.currentTarget
	 * @param {String} [config.ev] 事件type，如无，则注销该元素下所有类型的事件
	 * @param {Function} [config.fn] 事件方法，如有，则根据toString对比，找到后注销，如无，则注销该事件下所有的方法
	 */
	delEv : function(config) {
		var me = this, defaultConfig = {
			el : window,
			ev : null,
			fn : null
		}
		config = me.join(defaultConfig, config);
		if(me.isAry(config.el)) {
			for(var i = 0; i < config.el.length; i++) {
				me.delEv(me.join(config, {
					el : config.el[i]
				}));
			}
		} else if(me.isCanSplit2Ary(config.el)) {
			var a = config.el.split(me.CONSTANTS.REGEXP_SPACE)
			for(var i = 0; i < a.length; i++) {
				var _el = me.el8id(a[i]);
				if(!me.isEmpty(_el)) {
					me.delEv(me.join(config, {
						el : _el
					}));
				}
			}
		} else if(me.isStr(config.el)) {
			var _el = me.el8id(config.el);
			if(me.isEmpty(_el)) {
				_el = me.el("#" + config.el);
			}
			if(!me.isEmpty(_el)) {
				me.delEv(me.join(config, {
					el : _el
				}));
			}
		} else if(me.isAry(config.ev)) {
			for(var i = 0; i < config.ev.length; i++) {
				me.delEv(me.join(config, {
					ev : config.ev[i]
				}));
			}
		} else if(me.isCanSplit2Ary(config.ev)) {
			var a = config.ev.split(me.CONSTANTS.REGEXP_SPACE)
			for(var i = 0; i < a.length; i++) {
				me.delEv(me.join(config, {
					ev : a[i]
				}));
			}
		} else if(!me.isEmpty(config.el)) {
			if(!me.isEmpty(config.ev)) {
				config.ev = config.ev.toString().trim();
				if(!me.isEmpty(config.fn)) {
					var evQueue = config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_EVENT][config.ev];
					for(var i = 0; i < evQueue.length; i++) {
						var _config = evQueue[i];
						if(_config.fn == config.fn || _config.fn.toString() == config.fn.toString() || me.trimAll(_config.fn.toString()) == me.trimAll(config.fn.toString())) {
							evQueue.splice(i, 1);
						}
					}
					if(evQueue.length == 0) {
						delete config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_EVENT][config.ev];
						rmEv(config.el, config.ev, config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION][config.ev]);
						delete config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION][config.ev];
					}
				} else {
					delete config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_EVENT][config.ev];
					rmEv(config.el, config.ev, config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION][config.ev]);
					delete config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION][config.ev];
				}
			} else {
				if($kit.isEmpty(config.el[me.CONSTANTS.KIT_EVENT_REGISTER]) || $kit.isEmpty(config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_EVENT])) {
					return;
				}
				for(var _ev in config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_EVENT]) {
					rmEv(config.el, _ev, config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION][_ev]);
				}
				delete config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_EVENT];
				delete config.el[me.CONSTANTS.KIT_EVENT_REGISTER][me.CONSTANTS.KIT_EVENT_REGISTER_FUNCTION];
			}
		}
		function rmEv(el, e, fn) {
			if(document.attachEvent) {
				el.detachEvent('on' + e, fn);
			} else {
				el.removeEventListener(e, fn, false);
			}
		}

	},
	/**
	 * 触发事件
	 * @param {Object} config
	 * @param {Element} config.el 触发元素
	 * @param {String} [config.ev] 事件类型
	 */
	newEv : function(config) {
		var me = this, defaultConfig = {
			el : window,
			type : 'Events',
			ev : null,
			bubbles : false,
			cancelable : false
		}
		config = me.join(defaultConfig, config);
		if(!$kit.isEmpty(config.ev)) {
			if(document.createEvent) {
				var e = document.createEvent(config.type);
				e.initEvent(config.ev, config.bubbles, config.cancelable);
				config.el.dispatchEvent(e);
			} else {
				config.el.fireEvent('on' + config.ev);
			}
		}
	},
	/**
	 * set event extra info
	 * @param {Event}
	 * @private
	 */
	evExtra : function(ev) {
		var me = this;
		var pageX = ev.pageX || ev.clientX + me.viewport().scrollLeft;
		var pageY = ev.pageY || ev.clientY + me.viewport().scrollTop;
		var offsetX = ev.offsetY || ev.layerX;
		var offsetY = ev.offsetY || ev.layerY;
		return me.merge({
			pageX : pageX,
			pageY : pageY,
			offsetX : offsetX,
			offsetY : offsetY
		}, me.evPos(ev))
	},
	/**
	 * get event coordinate info
	 * @param {Event}
	 * @private
	 */
	evPos : function(ev) {
		if(ev.type.indexOf("touch") == 0 && ev.targetTouches && ev.targetTouches.length) {
			return {
				firstFingerClientX : ev.targetTouches[0].clientX,
				firstFingerClientY : ev.targetTouches[0].clientY,
				firstFingerPageX : ev.targetTouches[0].pageX,
				firstFingerPageY : ev.targetTouches[0].pageY
			}
		}
		return {
			firstFingerClientX : ev.clientX,
			firstFingerClientY : ev.clientY,
			firstFingerPageX : ev.pageX,
			firstFingerPageY : ev.pageY
		}
	},
	// -----------------------------------object manipulate-----------------------------------
	/**
	 * 合并对象，生成一个新的对象
	 * @param {Object ...}
	 * @return {Object}
	 */
	join : function() {
		var a = arguments, b = {};
		if(a.length == 0) {
			return;
		}
		for(var i = 0; i < a.length; i++) {
			for(var r in a[i]) {
				if(!$kit.isEmpty(a[i][r])) {
					b[r] = a[i][r];
				}
			}
		}
		return b;
	},
	/**
	 * 合并对象，后面所有的对象的属性都加到第一个身上
	 * @param {Object ...}
	 * @return {Object}
	 */
	merge : function() {
		var a = arguments;
		if(a.length < 2) {
			return;
		}
		if(a[0] != null) {
			for(var i = 1; i < a.length; i++) {
				for(var r in a[i]) {
					a[0][r] = a[i][r];
				}
			}
		}
		return a[0];
	},
	/**
	 * 合并对象，后面所有的对象的属性都加到第一个身上，注意，如果第一个有了，则不覆盖
	 * @param {Object ...}
	 * @return {Object}
	 */
	mergeIf : function() {
		var a = arguments;
		if(a.length < 2) {
			return;
		}
		for(var i = 1; i < a.length; i++) {
			for(var r in a[i]) {
				if(a[0][r] == null) {
					a[0][r] = a[i][r];
				}
			}
		}
		return a[0];
	},
	/**
	 * is collection include object
	 */
	/*
	has : function(collection, object, ignoreCase) {
	if( typeof (collection) == "undefined" || typeof (object) == "undefined") {
	return false;
	}
	var me = this, flag = false, ignoreCase = (ignoreCase == true ? ignoreCase : false);
	if(me.isAry(collection)) {
	for(var i = 0; i < collection.length; i++) {
	if(collection[i] == object || (ignoreCase && collection[i].toLowerCase() == object.toLowerCase())) {
	flag = true;
	break;
	}
	}
	} else {
	if(collection != null) {
	if( object in collection) {
	flag = true;
	} else if(ignoreCase) {
	for(var p in collection) {
	if(p.toString().toLowerCase() == object.toString().toLowerCase()) {
	flag = true;
	break;
	}
	}
	}
	}
	}
	return flag;
	},*/

	// -----------------------------------log-----------------------------------
	/**
	 * 简单的log
	 * @param {String} info
	 * @param {Object} config
	 */
	log : function(info, config) {
		try {
			var me = this;
			config = me.merge({
				borderColor : "#000",
				container : null
			}, config);
			if(me.isAry(info)) {
				info = info.join("");
			}
			if(document.body) {
				var div;
				if(config.container == null) {
					div = document.body.appendChild(document.createElement("div"));
				} else {
					div = config.container.appendChild(document.createElement("div"));
				}
				div.className = "J_Debug_Info";
				div.style.borderBottom = "1px solid " + config.borderColor || "#000";
				try {
					div.innerHTML += info;
				} catch (e) {
					div.innerHTML += e.toString();
				}
			} else {
				alert(info);
			}
		} catch(e) {
			alert("error!" + e);
			throw e;
		}
	},
	/**
	 * 清空log
	 */
	clsLog : function() {
		var me = this;
		var a = me.els8cls("J_Debug_Info");
		while(a.length) {
			a[0].parentNode.removeChild(a[0]);
		}
	},
	// -----------------------------------else-----------------------------------
	/**
	 * 返回随机数
	 * @private
	 */
	only : function() {
		var rnd = Math.random(10000);
		return new Date().getTime().toString() + '_' + rnd.toString().substr(2, 10);
	},
	/**
	 * generate unique DOM id
	 * @return {String}
	 */
	onlyId : function() {
		var me = this;
		var id = me.CONSTANTS.KIT_DOM_ID_PREFIX + me.only();
		var count;
		if(arguments.length == 1) {
			count = arguments[0];
		} else {
			count = 0;
		}
		count++;
		if(count > me.CONSTANTS.MAX_CYCLE_COUNT) {
			throw "error!";
		}
		if(!me.isEmpty(me.el8id(id))) {
			return me.onlyId(count);
		}
		return id
	},
	/**
	 * 判断iOS版本信息
	 * @return {Object}
	 */
	iOSInfo : function() {
		var me = this, regExp_appleDevice = /\(([a-z; ]+)CPU ([a-z ]*)OS ([\d_]+) like Mac OS X/i;
		var ver, device, re;
		if(regExp_appleDevice.test(navigator.userAgent)) {
			var a = navigator.userAgent.match(regExp_appleDevice);
			ver = a[3].toString().trim();
			ver = ver.replace(/_/g, ".");
			device = a[1].toString().trim();
			device = device.substring(0, device.indexOf(";"));
			re = {
				device : device,
				ver : ver
			}
		}
		return re;
	},
	// each : function(config) {
	// var me = this;
	// var a = config.array;
	// for(var i = 0; i < a.length; i++) {
	// if(me.inAry(config.exclude, a[i])) {
	// continue;
	// } else {
	// config.fn.call(config.scope || this, a[i], i, a);
	// }
	// }
	// },
	/**
	 * 数组遍历
	 * @param {Array|NodeList}
	 * @param {Function} fn 遍历执行方法，执行方法中返回false值，则停止继续遍历
	 * @param {Object} [scope] 执行方法的this指针
	 */
	each : function(ary, fn, scope) {
		if(ary == null) {
			return;
		}
		var me = this;
		if(me.isFn(fn)) {
			if(me.isAry(ary)) {
				for(var i = 0; i < ary.length; i++) {
					var re = fn.call(scope || window, ary[i], i, ary);
					if(re == false) {
						break;
					}
				}
			} else if(me.isObj(ary)) {
				var i = 0;
				for(var k in ary) {
					i++;
					var re = fn.call(scope || window, ary[k], k, ary, i);
					if(re == false) {
						break;
					}
				}
			}
		}
	},
	/**
	 * 合并字符串
	 * @param {Array|Map}
	 * @param {String} connectStr 链接每个属性的字符
	 * @param {String} 遍历Map的时候，链接key与value的字符
	 * @return {String}
	 */
	concat : function(o, connectStr, connectOper) {
		if($kit.isStr(o)) {
			return o;
		}
		var connectStr = '&' || connectStr;
		var connectOper = '=' || connectOper;
		if($kit.isAry(o)) {
			return o.join(connectStr);
		}
		var reStr = [];
		this.each(o, function(v, k) {
			reStr.push(k + connectOper + v);
		});
		return reStr.join(connectStr);
	},
	/**
	 * 简单继承subClass inherit superClass
	 * @param {Object} config
	 * @param {Object} config.child 子类
	 * @param {Object} config.father 父类
	 */
	inherit : function(config) {
		var me = this, child = config.child, father = config.father;
		
		var _arguments = undefined || config.arguments;
		try {
			_arguments = arguments.callee.caller.arguments;
		} catch(e) {
			//don`t pass arguments of constructor
		}
		me.mergeIf(child.prototype, new father(_arguments));
		child.prototype.constructor = child;
		child.superClass = father;
	},
	/**
	 * 模板的简单实现
	 * @param {String} templ 模板文本
	 * @param {Map} data 替换对象
	 * <pre>
	 * render('this is ${obj}', {
	 * 	obj : 'car'
	 * });
	 * 结果：this is car
	 * </pre>
	 */
	tpl : function(templ, data) {
		// 充分利用变量，为单个节点提速
		// 正则尽快匹配失败
		// 理论上可以作为JSON的key，支持很多字符
		return templ.replace(/(\$)(\{([^}]*)\})/gm, function(value, clear, origin, key) {
			key = key.split('.');
			value = data[key.shift()];
			for(var i = 0; i < key.length; i++) {
				value = value[key[i]];
			}
			return (value === null || value === undefined) ? (!!clear ? '' : origin) : value;
		});
	}
}
/**
 * $Kit的实例，直接通过这个实例访问$Kit所有方法
 * @type $Kit
 */
$kit = new $Kit();
/**
 * dom ready event
 * @memberOf $Kit
 * @member $
 * @function
 * @instance
 * @param {Function}
 */
$kit.$ = function(fn) {
	document.addEventListener('DOMContentLoaded', fn, false);
}

/**
 * Dom扩展
 * @class $Kit.Dom
 * @requires kit.js
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/dom.js">Source code</a>
 */
$Kit.Dom = function() {
	//
}
$kit.merge($Kit.Dom.prototype,
/**
 * @lends $Kit.Dom.prototype
 */
{
	/**
	 * 根据tagName查找父元素
	 * @param {Element}
	 * @param {String}
	 * @param {Element} [topEl] 到topEl停止查找
	 * @return {Element|Null}
	 */
	parentEl8tag : function(el, tagName, topEl) {
		var topEl = topEl || document.body;
		return $kit.parentEl(el, function(p) {
			if(p.tagName && p.tagName.toLowerCase() == tagName.toLowerCase()) {
				return true;
			}
			if(p == topEl) {
				return false;
			}
		}, topEl);
	},
	/**
	 * 根据className查找父元素
	 * @param {Element}
	 * @param {String}
	 * @param {Element} [topEl] 到topEl停止查找
	 * @return {Element|Null}
	 */
	parentEl8cls : function(el, cls, topEl) {
		var topEl = topEl || document.body;
		return $kit.parentEl(el, function(p) {
			if($kit.hsCls(p, cls)) {
				return true;
			}
			if(p == topEl) {
				return false;
			}
		}, topEl);
	},
	/**
	 * 注入script块
	 * @param {Object} config
	 * @param {String} config.id 注入script的id，自定义，只要与现有dom里面的元素id不相同即可
	 * @param {String} [config.url] 注入script的加载url
	 * @param {String} [config.text] 注入script的script内容
	 * @param {String} [config.then] 注入script的加载完毕的回调方法
	 * @param {String} [config.scope] 注入script的回调方法的this指针
	 * @return {Element} script
	 */
	injectJs : function() {
		if(arguments.length == 1) {
			var config = arguments[0];
			if(config.id && $kit.el8id(config.id)) {
				return;
			}
			config.id = config.id || $kit.onlyId();
			var where = config.where || window.document.body;
			var script = document.createElement('script');
			$kit.attr(script, 'type', 'text/javascript');
			if(config.id) {
				$kit.attr(script, 'id', config.id);
			}
			if(!$kit.isEmpty(config.url)) {
				script.src = config.url;
				if(!$kit.isEmpty(config.then)) {
					var scope = config.scope || window;
					script.onload = function() {
						config.then.call(scope, script);
					}
				}
			} else if(!$kit.isEmpty(config.text)) {
				script.innerHTML = config.text;
				if(!$kit.isEmpty(config.then)) {
					setTimeout(function() {
						config.then.call(scope, script);
					}, 0);
				}
			}
			where.appendChild(script);
			return script;
		}
	},
	/**
	 * 注入css
	 * @param {Object} config
	 * @param {String} config.id 注入css的id，自定义，只要与现有dom里面的元素id不相同即可
	 * @param {String} [config.url] 注入css的url
	 * @param {String} [config.text] 如果没有url的话，写入style的文本
	 * @return {Element} css
	 */
	injectCss : function() {
		if(arguments.length == 1) {
			var config = arguments[0];
			if(config.id && $kit.el8id(config.id)) {
				return;
			}
			// Takes a string of css, inserts it into a `<style>`, then injects it in at the very top of the `<head>`. This ensures any user-defined styles will take precedence.
			var where = config.where || document.getElementsByTagName('head')[document.getElementsByTagName('head').length - 1];
			var css;
			if(!$kit.isEmpty(config.url)) {
				css = document.createElement('link');
				config.id && $kit.attr(css, 'id', config.id);
				$kit.attr(css, {
					rel : 'stylesheet',
					href : config.url
				});
			} else if(!$kit.isEmpty(config.text)) {
				css = document.createElement('style');
				config.id && $kit.attr(css, 'id', config.id);
				$kit.attr(css, 'type', 'text/css');
				css.innerHTML = config.text;
			}
			if(css) {
				$kit.insEl({
					pos : 'last',
					what : css,
					where : where
				});
			}
			return css;
		}
	},
	/**
	 * 删除所有样式
	 * @param {String}
	 * @param {Element}
	 */
	rmClsAll : function(cls, top) {
		var a = $kit.el8cls(cls, top);
		while(a) {
			$kit.rmCls(a, cls);
			a = $kit.el8cls(cls, top);
		}
	},
	/**
	 * 通过className前缀取className
	 * @param {Element}
	 * @param {String}
	 * @return {NodeList||Null}
	 */
	getClassNameByPrefix : function(el, prefixCls) {
		var clsAry = el.className.split(/\s+/);
		var re = null;
		if(clsAry && clsAry.length) {
			$kit.each(clsAry, function(o) {
				if(o.indexOf(prefixCls) == 0) {
					re = o;
					return false;
				}
			});
		}
		return re;
	},
	/**
	 * innerText
	 * @param {Element}
	 * @param {String} [text]
	 * @return {String|Null}
	 */
	text : function(el, text) {
		if(el != null && 'innerText' in el) {
			if(text) {
				el.innerText = text;
			} else {
				return el.innerText;
			}
		} else {
			if(text) {
				el.textContent = text;
			} else {
				return el.textContent;
			}
		}
	},
	/**
	 * innerHTML
	 * @param {Element}
	 * @param {String} [html]
	 * @return {String|Null}
	 */
	html : function(el, html) {
		if(html) {
			if(el != null && 'innerHTML' in el) {
				el.innerHTML = html;
			}
		} else {
			return el.innerHTML;
		}
	},
	/**
	 * clone a node
	 * @param {Element}
	 * @return {Element}
	 */
	clone : function(node) {
		if(document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>") {
			return node.cloneNode(true);
		} else {
			var fragment = document.createDocumentFragment(), //
			doc = fragment.createElement ? fragment : document;
			doc.createElement(node.tagName);
			var div = doc.createElement('div');
			fragment.appendChild(div);
			div.innerHTML = node.outerHTML;
			return div.firstChild;
		}
	},
	/**
	 * height
	 * @param {Element}
	 * @param {Number} [value]
	 * @return {Number|Null}
	 */
	height : function(node, value) {
		var me = this;
		if(node != null) {
			if(value == null) {
				return $kit.offset(node).height;
			}
			if(document.compatMode == "BackCompat") {
				node.style.height = value;
			} else {
				node.style.height = value//
				- ($kit.css(node, 'border-top-width') || 0)//
				- ($kit.css(node, 'border-bottom-width') || 0)//
				- ($kit.css(node, 'padding-top-width') || 0)//
				- ($kit.css(node, 'padding-bottom-width') || 0)//
				;
			}
		}
		return $kit.viewport().clientHeight;
	},
	/**
	 * width
	 * @param {Element}
	 * @param {Number} [value]
	 * @return {Number|Null}
	 */
	width : function(node, value) {
		var me = this;
		if(node != null) {
			if(value == null) {
				return $kit.offset(node).width;
			}
			if(document.compatMode == "BackCompat") {
				node.style.width = value;
			} else {
				node.style.width = value//
				- ($kit.css(node, 'border-left-width') || 0)//
				- ($kit.css(node, 'border-right-width') || 0)//
				- ($kit.css(node, 'padding-left-width') || 0)//
				- ($kit.css(node, 'padding-right-width') || 0)//
				;
			}
		}
		return $kit.viewport().clientHeight;
	},
	/**
	 * height + padding
	 * @param {Element}
	 * @return {Number}
	 */
	innerHeight : function(node) {
		var me = this;
		if(document.compatMode == "BackCompat") {
			return $kit.css(node, 'height') - ($kit.css(node, 'border-top-width') || 0) - ($kit.css(node, 'border-bottom-width') || 0);
		}
		return $kit.css(node, 'height') + ($kit.css(node, 'padding-top-width') || 0) - ($kit.css(node, 'padding-bottom-width') || 0);
	},
	/**
	 * width + padding
	 * @param {Element}
	 * @return {Number}
	 */
	innerWidth : function(node) {
		var me = this;
		if(document.compatMode == "BackCompat") {
			return $kit.css(node, 'width') - ($kit.css(node, 'border-left-width') || 0) - ($kit.css(node, 'border-right-width') || 0);
		}
		return $kit.css(node, 'width') + ($kit.css(node, 'padding-left-width') || 0) - ($kit.css(node, 'padding-right-width') || 0);
	},
	/**
	 * height + padding + border
	 * @param {Element}
	 * @return {Number}
	 */
	outerHeight : function(node) {
		var me = this;
		if(document.compatMode == "BackCompat") {
			return $kit.css(node, 'height');
		}
		return $kit.css(node, 'height') + ($kit.css(node, 'padding-top-width') || 0) - ($kit.css(node, 'padding-bottom-width') || 0)//
		+ ($kit.css(node, 'border-top-width') || 0) + ($kit.css(node, 'border-bottom-width') || 0);
	},
	/**
	 * width + padding + border
	 * @param {Element}
	 * @return {Number}
	 */
	outerWidth : function(node) {
		var me = this;
		if(document.compatMode == "BackCompat") {
			return $kit.css(node, 'width');
		}
		return $kit.css(node, 'width') + ($kit.css(node, 'padding-left-width') || 0) - ($kit.css(node, 'padding-right-width') || 0)//
		+ ($kit.css(node, 'border-left-width') || 0) + ($kit.css(node, 'border-right-width') || 0);
	},
	/**
	 * 包围一个html
	 * @param {Element}
	 * @param {String}
	 */
	wrap : function(node, html) {
		if($kit.isNode(html)) {
			//
		} else if($kit.isStr(html)) {
			html = $kit.newHTML(html).childNodes[0];
		} else {
			return;
		}
		$kit.insEl({
			where : node,
			what : html,
			pos : 'before'
		});
		html.appendChild(node);
		return html;
	},
	/**
	 * 序列化form元素
	 * @param {Element}
	 * @param {String}
	 * @return {String}
	 */
	serialize : function(form) {
		if($kit.isNode(form)) {
			if(form.tagName.toLowerCase() == 'form') {
				var formEls = {};
				$kit.each($kit.el('input', form), function(o) {
					if(o.type && o.type.toString.toLowerCase() == 'text') {
						formEls[o.name] = o.value;
					} else if(o.type && o.type.toString().toLowerCase() == 'radio') {
						if(o.checked) {
							formEls[o.name] = o.value;
						}
					} else if(o.type && o.type.toString().toLowerCase() == 'checkbox') {
						if(o.checked) {
							if(!$kit.isAry(formEls[o.name])) {
								formEls[o.name] = [formEls[o.name]];
							}
							formEls[o.name].push(o.value);
						}
					}
				});
				$kit.each($kit.el('textarea', form), function(o) {
					formEls[o.name] = o.value;
				});
				$kit.each($kit.el('select', form), function(o) {
					formEls[o.name] = o.options[o.selectedIndex].value;
				});
				var re = [];
				for(var key in formEls) {
					if($kit.isAry(formEls[key])) {
						re.push(key + '=' + encodeURIComponent(formEls[key].join(',')));
					} else {
						re.push(key + '=' + encodeURIComponent(formEls[key]));
					}
				}
				return re.join('');
			}
			return form.name + '=' + encodeURIComponent($kit.val(form));
		}
	},
	/**
	 * 计算元素相对于他的offsetParent的偏移
	 * @param {Element}
	 * @return {Number} top 距离顶部
	 * @return {Number} left 距离左边
	 * @return {Number} height 高度
	 * @return {Number} width 宽度
	 * @return {Number} bottom 底部距离顶部
	 * @return {Number} right 右边距离最左边
	 * @return {Number} middleTop 中间距离顶部
	 * @return {Number} middleLeft 中间距离最左边
	 */
	position : function(el) {
		var me = this;
		if($kit.isEmpty(el)) {
			return;
		}
		var top = el.offsetTop, //
		left = el.offsetLeft, //
		width = el.offsetWidth, //
		height = el.offsetHeight;
		return {
			top : top,
			left : left,
			width : width,
			height : height,
			bottom : top + height,
			right : left + width,
			middleTop : top + height / 2,
			middleLeft : left + width / 2
		}
	},
	/**
	 * 计算元素相对于他的可视区的偏移
	 * @param {Element}
	 * @return {Number} top 距离顶部
	 * @return {Number} left 距离左边
	 * @return {Number} height 高度
	 * @return {Number} width 宽度
	 * @return {Number} bottom 底部距离顶部
	 * @return {Number} right 右边距离最左边
	 * @return {Number} middleTop 中间距离顶部
	 * @return {Number} middleLeft 中间距离最左边
	 */
	clientOffset : function(el) {
		var me = this;
		if($kit.isEmpty(el)) {
			return;
		}
		var offset = $kit.offset(el);
		var viewport = $kit.viewport();
		return {
			top : offset.top - viewport.scrollTop,
			left : offset.left - viewport.scrollLeft,
			width : offset.width,
			height : offset.height,
			bottom : offset.bottom - viewport.scrollTop,
			right : offset.right - viewport.scrollLeft,
			middleTop : offset.top - viewport.scrollTop + offset.height / 2,
			middleLeft : offset.left - viewport.scrollLeft + offset.width / 2
		}
	},
	/**
	 * 获取当一个元素居中的时候，他相对于doc绝对值的top,bottom,left,right等等
	 * @param {Element}
	 * @return {Number} top 距离顶部
	 * @return {Number} left 距离左边
	 * @return {Number} height 高度
	 * @return {Number} width 宽度
	 * @return {Number} bottom 底部距离顶部
	 * @return {Number} right 右边距离最左边
	 * @return {Number} middleTop 中间距离顶部
	 * @return {Number} middleLeft 中间距离最左边
	 */
	offsetCenter : function(el) {
		var me = this;
		var viewport = $kit.viewport();
		var offset = $kit.offset(el);
		return {
			top : viewport.clientHeight / 2 + viewport.scrollTop - offset.height / 2,
			left : viewport.clientWidth / 2 + viewport.scrollLeft - offset.width / 2,
			right : viewport.clientWidth / 2 + viewport.scrollLeft + offset.width / 2,
			bottom : viewport.clientHeight / 2 + viewport.scrollTop + offset.height / 2,
			middleTop : viewport.clientHeight / 2 + viewport.scrollTop,
			middleLeft : viewport.clientWidth / 2 + viewport.scrollLeft
		}
	},
	/**
	 * 获取当一个元素居中的时候，他相对于可视区域的top,bottom,left,right等等
	 * @param {Element}
	 * @return {Number} top 距离顶部
	 * @return {Number} left 距离左边
	 * @return {Number} height 高度
	 * @return {Number} width 宽度
	 * @return {Number} bottom 底部距离顶部
	 * @return {Number} right 右边距离最左边
	 * @return {Number} middleTop 中间距离顶部
	 * @return {Number} middleLeft 中间距离最左边
	 */
	clientOffsetCenter : function(el) {
		var me = this;
		var viewport = $kit.viewport();
		var offset = $kit.offset(el);
		return {
			top : (viewport.clientHeight / 2 - offset.height / 2),
			left : (viewport.clientWidth / 2 - offset.width / 2),
			right : (viewport.clientWidth / 2 + offset.width / 2),
			bottom : (viewport.clientHeight / 2 + offset.height / 2),
			middleTop : (viewport.clientHeight / 2),
			middleLeft : (viewport.clientWidth / 2)
		}
	},
	/**
	 * 获取当一个元素居中的时候，他相对于可视区域的top,bottom,left,right等等
	 * @param {Element}
	 * @return {Number} top 距离顶部
	 * @return {Number} left 距离左边
	 * @return {Number} height 高度
	 * @return {Number} width 宽度
	 * @return {Number} bottom 底部距离顶部
	 * @return {Number} right 右边距离最左边
	 * @return {Number} middleTop 中间距离顶部
	 * @return {Number} middleLeft 中间距离最左边
	 */
	clientPos : function(el) {
		var me = this;
		var viewport = $kit.viewport();
		var offset = $kit.offset(el);
		return {
			top : viewport.clientHeight / 2 + viewport.scrollTop - offset.height / 2,
			left : viewport.clientWidth / 2 + viewport.scrollLeft - offset.width / 2,
			right : viewport.clientWidth / 2 + viewport.scrollLeft + offset.width / 2,
			bottom : viewport.clientHeight / 2 + viewport.scrollTop + offset.height / 2,
			middleTop : viewport.clientHeight / 2 + viewport.scrollTop,
			middleLeft : viewport.clientWidth / 2 + viewport.scrollLeft
		}
	},
	/**
	 * 交换两个element的位置
	 */
	switchPos : function(origin, target) {
		var targetPos;
		if(target.previousSibling) {
			targetPos = {
				pos : 'after',
				where : target.previousSibling
			}
		} else {
			targetPos = {
				pos : 'first',
				where : target.parentNode
			}
		}
		$kit.insEl({
			pos : 'after',
			where : origin,
			what : target
		});
		$kit.insEl($kit.merge({
			what : origin
		}, targetPos));
	}
});
/**
 * $Kit.Dom的实例，直接通过这个实例访问$Kit.Dom所有方法
 * @global
 * @name $kit.dom
 * @alias $kit.d
 * @type $Kit.Dom
 */
$kit.dom = $kit.d = new $Kit.Dom();

/**
 * 事件扩展，加载该js之后，$kit.ev事件既可以支持全浏览器拖拽
 * @class $Kit.Event
 * @requires kit.js
 * @requires dom.js
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/event.js">Source code</a>
 */
$Kit.Event = function() {
	//
	/**
	 * 原始的ev事件
	 * @member _ev
	 * @instance
	 * @memberOf $Kit.Event
	 */
	this._ev = function() {
		$Kit.prototype.ev.apply($kit, arguments);
	}
	/**
	 * 当前拖拽事件的拖拽元素
	 * @member dragElement
	 * @instance
	 * @memberOf $Kit.Event
	 */
	this.dragElement = undefined;
	/*$kit.ev = function() {
	 $kit.event.ev.apply($kit.event, arguments);
	 }*/
	this.eventExtraInfoFnArray = [];
	this.registExtraEventInfo(function() {
		return $Kit.prototype.evExtra.apply($kit, arguments);
	});
	this.registExtraEventInfo(function() {
		return {
			dragElement : this.dragElement
		};
	});
	this.registExtraEventInfo(function() {
		return {
			dragStartEventInfo : this.dragStartEventInfo
		};
	});
}
$kit.merge($Kit.Event.prototype,
/**
 * @lends $Kit.Event.prototype
 * @enum
 */
{
	KEYCODE_UP : 38,
	KEYCODE_DOWN : 40,
	KEYCODE_LEFT : 37,
	KEYCODE_RIGHT : 39,
	//
	KEYCODE_ADD : 107,
	KEYCODE_SUB : 109,
	KEYCODE_MULTIPLY : 106,
	KEYCODE_DIVIDE : 111,
	//
	KEYCODE_ENTER : 13,
	KEYCODE_ESC : 27,
	KEYCODE_BACKSPACE : 8,
	KEYCODE_TAB : 9,
	//
	KEYCODE_SHIFT : 16,
	KEYCODE_CTRL : 17,
	KEYCODE_ALT : 18,
	//
	KEYCODE_INSERT : 45,
	KEYCODE_DELETE : 46,
	//
	KEYCODE_PAGEUP : 33,
	KEYCODE_PAGEDOWN : 34
},
/**
 * @lends $Kit.Event.prototype
 */
{
	//event增强start
	/**
	 * 递归
	 * @private
	 */
	recurEv : function(evCfg, fn) {
		var me = this;
		if($kit.isAry(evCfg.el)) {
			$kit.each(evCfg.el, function(el) {
				fn.call(me, $kit.join(evCfg, {
					el : el
				}));
			});
		} else if($kit.isCanSplit2Ary(evCfg.el)) {
			me.recurEv($kit.join(evCfg, {
				el : evCfg.el.split($kit.CONSTANTS.REGEXP_SPACE)
			}), fn);
		} else if($kit.isStr(evCfg.el)) {
			var _el = $kit.el(evCfg.el);
			if($kit.isEmpty(_el)) {
				_el = $kit.el("#" + evCfg.el);
			}
			if(!$kit.isEmpty(_el)) {
				fn.call(me, $kit.join(evCfg, {
					el : _el
				}));
			}
		} else if($kit.isAry(evCfg.ev)) {
			$kit.each(evCfg.ev, function(ev) {
				fn.call(me, $kit.join(evCfg, {
					ev : ev
				}));
			});
		} else if($kit.isCanSplit2Ary(evCfg.ev)) {
			me.recurEv($kit.join(evCfg, {
				ev : evCfg.ev.split($kit.CONSTANTS.REGEXP_SPACE)
			}), fn);
		} else {
			return true;
		}
	},
	/**
	 * kit事件注册方法，支持拖拽
	 * @param {Object} config
	 * @param {Selector|Element|NodeList} config.el 触发事件的元素，等于event.currentTarget
	 * @param {String} config.ev 事件type，如click
	 * @param {Function} config.fn 事件方法
	 * @param {Object} config.scope this指针
	 */
	ev : function(config) {
		var me = this, defaultConfig = {
			el : null,
			ev : null,
			fn : null
		}
		config = $kit.join(defaultConfig, config);
		if($kit.isEmpty(config.el) || $kit.isEmpty(config.ev) || !$kit.isFn(config.fn)) {
			return;
		}
		if(me.recurEv(config, me.ev)) {
			var ev = config.ev.trim(), el = config.el;
			if('ondrag' in el) {
				//使用IE自带的drag事件，考虑到HTML5的普及，直接使用现成的
				if(me._isDragEv(ev) && el._flag_kitjs_drag_regist != true) {
					el._flag_kitjs_drag_regist = true;
					el.style.cursor = 'move';
					$kit.attr(el, 'draggable', 'true');
					if($kit.isIE()) {
						//如果是IE
						me._ev({
							el : el,
							ev : 'mousedown',
							fn : function(e) {
								var el = e.currentTarget;
								el.dragDrop && el.dragDrop();
								el._kitjs_dd_mousedown = true;
								//el._kitjs_dd_origin_positoin = $kit.css(el, 'position');
							}
						});
						me._ev({
							el : el,
							ev : 'dragstart',
							fn : function(e) {
								var el = e.currentTarget;
								//e.dataTransfer.effectAllowed = "all";
								me.dragElement = e.currentTarget;
								me.dragStartEventInfo = {
									clientX : e.clientX,
									clientY : e.clientY,
									offsetTarget : e.target.offsetParent,
									offsetTargetOffset : $kit.offset(e.target.offsetParent),
									offsetTargetClientOffset : $kit.dom.clientOffset(e.target.offsetParent)
								}
								e.dataTransfer.setData("text", e.currentTarget.innerHTML);
								//e.dataTransfer.setDragImage(e.target, 0, 0);
								if(el._kitjs_dd_start != true) {
									//
									// var cloneNode = document.createElement('div');
									// $kit.css(cloneNode, {
									// position : 'absolute',
									// display : 'block',
									// width : $kit.offset(el).width,
									// height : $kit.offset(el).height,
									// border : '2px dashed #aaa',
									// backgroundColor : 'transparent',
									// opacity : 0.5
									// });
									// document.body.appendChild(cloneNode);
									// $kit.css(cloneNode, {
									// top : e.pageY - 2,
									// left : e.pageX - 2
									// });
									// $kit.css(el, {
									// position : 'absolute',
									// top : el.offsetTop,
									// left : el.offsetLeft
									// });

									el._kitjs_dd_start = true;
									el._kitjs_dd_drag = true;
									//el._kitjs_dd_cloneNode = cloneNode;
								}
							}
						});
						me._ev({
							el : el,
							ev : 'drag',
							fn : function(e) {
								var el = e.currentTarget;
								//e.dataTransfer.effectAllowed = "all";
								if(el._kitjs_dd_mousedown == true) {
									// $kit.css(el._kitjs_dd_cloneNode, {
									// position : 'absolute',
									// display : 'block',
									// top : e.pageY - 2,
									// left : e.pageX - 2
									// });
									el._kitjs_dd_drag = true;
								}
							}
						});
						me._ev({
							el : el,
							ev : 'dragend',
							fn : function(e) {
								me.dragElement = null;
								me.dragStartEventInfo = null;
								var el = e.currentTarget;
								el._kitjs_dd_mousedown = false;
								el._kitjs_dd_drag = false;
								el._kitjs_dd_start = false;

								// $kit.css(el._kitjs_dd_cloneNode, {
								// display : 'none',
								// 'z-index' : -1
								// });

							}
						});
						el._kitjs_dd_init = true;
						el._kitjs_dd_start = false;
						el._kitjs_dd_drag = false;
						el._kitjs_dd_mousedown = true;
					} else {
						//非IE
						me._ev({
							el : el,
							ev : 'dragstart',
							fn : function(e) {
								var el = e.currentTarget;
								//e.dataTransfer.dropEffect = 'move';
								//e.dataTransfer.effectAllowed = "all";
								//e.dataTransfer.setDragImage(ev.target, 0, 0);
								me.dragElement = e.currentTarget;
								e.dataTransfer.setData("text", e.currentTarget.innerHTML);
								me.dragStartEventInfo = {
									clientX : e.clientX,
									clientY : e.clientY,
									screenX : e.screenX,
									screenY : e.screenY,
									layerX : e.layerX,
									layerY : e.layerY,
									offsetTarget : e.target.offsetParent,
									offsetTargetOffset : $kit.offset(e.target.offsetParent),
									offsetTargetClientOffset : $kit.dom.clientOffset(e.target.offsetParent)
								}
							}
						});
						me._ev({
							el : el,
							ev : 'drag',
							fn : function(e) {
								//e.dataTransfer.effectAllowed = "all";
							}
						});
						me._ev({
							el : el,
							ev : 'dragend',
							fn : function(e) {
								me.dragElement = null;
							}
						});
					}
				} else if(me._isDropEv(ev) && el._flag_kitjs_drop_regist != true) {
					el._flag_kitjs_drop_regist = true;
					me._ev({
						el : el,
						ev : 'dragover',
						fn : function(e) {
							e.stopDefault();
						}
					});
				} else {
					//mousemove代替drag事件，暂时hold
					/*
					 if(!el._kitjs_dd_init) {
					 me._ev({
					 el : el,
					 ev : 'mousedown',
					 fn : function(e) {
					 var el = e.currentTarget;
					 if(el._kitjs_dd_init) {
					 el._kitjs_dd_start = false;
					 el._kitjs_dd_drag = false;
					 el._kitjs_dd_mousedown = true;
					 }
					 }
					 });
					 el._kitjs_dd_init = true;
					 me._ev({
					 el : el,
					 ev : 'mousemove',
					 fn : function(e) {
					 var el = e.currentTarget;
					 if(el._kitjs_dd_init == true && el._kitjs_dd_mousedown == true) {
					 if(el._kitjs_dd_start != true) {
					 $kit.newEv({
					 el : el,
					 ev : 'dragstart'
					 });
					 el._kitjs_dd_start = true;
					 }
					 el._kitjs_dd_drag = true;
					 $kit.newEv({
					 el : el,
					 ev : 'drag'
					 });
					 }
					 }
					 });
					 me._ev({
					 el : el,
					 ev : 'mouseup',
					 fn : function(e) {
					 var el = e.currentTarget;
					 if(el._kitjs_dd_drag == true && el._kitjs_dd_init == true) {
					 $kit.newEv({
					 el : el,
					 ev : 'dragend'
					 });
					 el._kitjs_dd_drag = false;
					 el._kitjs_dd_start = false;
					 el._kitjs_dd_mousedown = false;
					 }
					 }
					 });
					 }
					 */
				}
				//
			}
			me._ev(config);
		}
	},
	_isDragEv : function(ev) {
		var ev = ev.toLowerCase().trim();
		if(ev == 'dragstart'//
		|| ev == 'drag'//
		|| ev == 'dragend'//
		) {
			return true;
		}
		return false;
	},
	_isDropEv : function(ev) {
		var ev = ev.toLowerCase().trim();
		if(ev == 'dragenter'//
		|| ev == 'dragleave'//
		|| ev == 'dragover'//
		|| ev == 'drop'//
		) {
			return true;
		}
		return false;
	},
	//event增强end
	draggable : function(el) {
		var me = this;
		if(el['kitjs-draggable']) {
			return;
		}
		el['kitjs-draggable'] = true;
		me.ev({
			el : el,
			ev : 'drag',
			fn : function(e, cfg) {
				//e.dataTransfer.setDragImage(e.target, 0, 0);//设置拖拽图片
				if(e.dragStartEventInfo && e.dragStartEventInfo.offsetTarget != document.body) {
					var position = $kit.css(e.dragStartEventInfo.offsetTarget, 'position');
					var distanceX = 0, distanceY = 0;
					/*
					 if(e.clientX == 0 && e.screenX > 0) {
					 distanceX = e.screenX - e.dragStartEventInfo.screenX;
					 } else if(e.clientX == 0 && e.screenX == 0 && e.layerX > 0) {
					 distanceX = e.layerX - e.dragStartEventInfo.layerX;
					 } else {
					 distanceX = e.clientX - e.dragStartEventInfo.clientX;
					 }
					 if(e.clientY == 0 && e.screenY > 0) {
					 distanceY = e.screenY - e.dragStartEventInfo.screenY;
					 } else if(e.clientY == 0 && e.screenY == 0 && e.layerY > 0) {
					 distanceY = e.layerY - e.dragStartEventInfo.layerY;
					 } else {
					 distanceY = e.clientY - e.dragStartEventInfo.clientY;
					 }*/
					if(e.clientX == 0 && e.screenX > 0) {
						distanceX = e.screenX - e.dragStartEventInfo.screenX;
					} else if(e.clientX > 0) {
						distanceX = e.clientX - e.dragStartEventInfo.clientX;
					}
					if(e.clientY == 0 && e.screenY > 0) {
						distanceY = e.screenY - e.dragStartEventInfo.screenY;
					} else if(e.clientY > 0) {
						distanceY = e.clientY - e.dragStartEventInfo.clientY;
					}
					if(distanceY != 0 || distanceX != 0) {
						if(position && position.toLowerCase() == 'fixed') {
							var pos = {
								top : e.dragStartEventInfo.offsetTargetClientOffset.top + distanceY + 'px',
								left : e.dragStartEventInfo.offsetTargetClientOffset.left + distanceX + 'px'
							};
							$kit.css(e.dragStartEventInfo.offsetTarget, pos);
						} else if(position && position.toLowerCase() == 'absolute') {
							var pos = {
								top : e.dragStartEventInfo.offsetTargetOffset.top + distanceY + 'px',
								left : e.dragStartEventInfo.offsetTargetOffset.left + distanceX + 'px'
							};
							$kit.css(e.dragStartEventInfo.offsetTarget, pos);
						}
					}
				}
			},
			scope : el
		});
		me.ev({
			el : el,
			ev : 'dragend',
			fn : function(e, cfg) {
				if(e.dragStartEventInfo && e.dragStartEventInfo.offsetTarget != document.body) {
					var position = $kit.css(e.dragStartEventInfo.offsetTarget, 'position');
					var distanceX = 0, distanceY = 0;
					if(e.clientX == 0 && e.screenX > 0) {
						distanceX = e.screenX - e.dragStartEventInfo.screenX;
					} else {
						distanceX = e.clientX - e.dragStartEventInfo.clientX;
					}
					if(e.clientY == 0 && e.screenY > 0) {
						distanceY = e.screenY - e.dragStartEventInfo.screenY;
					} else {
						distanceY = e.clientY - e.dragStartEventInfo.clientY;
					}
					if(distanceY != 0 || distanceX != 0) {
						if(position && position.toLowerCase() == 'fixed') {
							$kit.css(e.dragStartEventInfo.offsetTarget, {
								top : e.dragStartEventInfo.offsetTargetClientOffset.top + distanceY + 'px',
								left : e.dragStartEventInfo.offsetTargetClientOffset.left + distanceX + 'px'
							});
						} else if(position && position.toLowerCase() == 'absolute') {
							$kit.css(e.dragStartEventInfo.offsetTarget, {
								top : e.dragStartEventInfo.offsetTargetOffset.top + distanceY + 'px',
								left : e.dragStartEventInfo.offsetTargetOffset.left + distanceX + 'px'
							});
						}
					}
				}
			},
			scope : el
		});
	},
	evExtra : function(ev) {
		var me = this;
		var re = {};
		for(var i = 0; i < $kit.event.eventExtraInfoFnArray.length; i++) {
			if($kit.isFn(me.eventExtraInfoFnArray[i])) {
				$kit.merge(re, me.eventExtraInfoFnArray[i].call(me, ev));
			} else {
				$kit.merge(re, me.eventExtraInfoFnArray[i]);
			}
		}
		return re;
	},
	registExtraEventInfo : function(fn) {
		this.eventExtraInfoFnArray.push(fn);
	}
});
/**
 * $Kit.Event的实例，直接通过这个实例访问$Kit.Event所有方法
 * @global
 * @type $Kit.Event
 */

$kit.event = new $Kit.Event();
/*$kit.ev = function() {
	$kit.event.ev.apply($kit.event, arguments);
};*/
$kit.evExtra = function() {
	return $Kit.Event.prototype.evExtra.apply($kit.event, arguments);
};

/**
 * 树状字典，加速下拉菜单读取速度
 * @class TreeDict
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/TreeDict.js">Source code</a>
 * @modify
 * 2012/04/09
 * 清明休假想到的，如果遇到“北京”和“北京市”，这两个作为key存入字典，时，按照现在的逻辑，北京市会把北京盖掉，
 * 现在改为对于同前缀的key，加入结束标记作为区分，这样时间存在字典里面的是"北京endSing"和北京市endSign，这样就可以区分开了
 */
var TreeDict = function(config) {
	var me = this;
	me.config = $kit.join(arguments.callee.defaultConfig, config);
	me.size = 0;
	me.deep = me.config.deep;
	me.data = {};
}
/**
 * @member
 * @enum
 */
TreeDict.defaultConfig = {
	deep : 30, //嵌套深度，此参数影响词典内存对象大小，也影响search索引性能
	data : undefined,
	endSign : '$end$'//避免"北京"作为key被"北京市"覆盖掉，现引用结束标记概念，以区别ab和abc这样的字符
}
TreeDict.prototype = {
	constructor : TreeDict,
	/**
	 * 判断是否存在
	 * @param {String}
	 * @return {Boolean}
	 */
	hs : function(key) {
		var key = key || null, me = this;
		if(key == null) {
			var beginIndex = 0, recurDeep = 0, //
			lookfor = me.data, index, lastLookfor, find;
			while(beginIndex < key.length) {
				if(recurDeep < me.deep - 1) {
					index = key.substring(beginIndex, beginIndex + 1);
					find = lookfor[index];
				} else {
					index = key.substring(beginIndex);
					find = lookfor[index];
				}
				if($kit.isEmpty(find)) {
					return false;
				} else {
					if(beginIndex == key.length - 1 || recurDeep == me.deep - 1) {
						return true;
					}
				}
				lookfor = find;
				beginIndex++;
				recurDeep++;
			}
			return false;
		}
	},
	/**
	 * 添加
	 * @param {String}
	 * @param {String}
	 */
	ad : function(key, value) {
		var value = value || null;
		var key = key || null;
		var me = this;
		if(key == null || value == null) {
			return;
		}
		var beginIndex = 0, recurDeep = 0, //
		lookfor = me.data, index, lastLookfor, find;
		while(beginIndex < key.length) {
			if(recurDeep < me.deep - 1) {
				index = key.substring(beginIndex, beginIndex + 1);
				find = lookfor[index];
			} else {
				index = key.substring(beginIndex);
				find = lookfor[index];
			}
			if($kit.isEmpty(find)) {//如果找不到key了
				if(beginIndex == key.length - 1 || recurDeep == me.deep - 1) {
					lookfor[index] = {};
					lookfor[index][me.config.endSign] = value;
					find = lookfor[index];
				} else {
					find = lookfor[index] = {};
				}
			} else {
				if(beginIndex == key.length - 1 || recurDeep == me.deep - 1) {
					find[me.config.endSign] = value;
				}
			}
			lookfor = find;
			beginIndex++;
			recurDeep++;
		}
	},
	/**
	 * 删除
	 * @param {String}
	 */
	rm : function(key) {
		var key = key || null;
		var me = this;
		if(key == null) {
			return;
		}
		var beginIndex = 0, recurDeep = 0, //
		lookfor = me.data, index, lastLookfor, find;
		while(beginIndex < key.length) {
			if(recurDeep < me.deep - 1) {
				index = key.substring(beginIndex, beginIndex + 1);
				find = lookfor[index];
			} else {
				index = key.substring(beginIndex);
				find = lookfor[index];
			}
			if($kit.isEmpty(find)) {
				return false;
			} else {
				if(beginIndex == key.length - 1 || recurDeep == me.deep - 1) {
					delete lookfor[index][me.config.endSign];
					//有没别的索引，没有就斩草除根!!!
					var deleteIndex = false;
					for(var p in lookfor[index]) {
						deleteIndex = true;
						break;
					}
					if(deleteIndex) {
						delete lookfor[index];
					}
				}
			}
			lookfor = find;
			beginIndex++;
			recurDeep++;
		}
	},
	/**
	 * 存放数据总数
	 * @return {Number}
	 */
	size : function() {
		this.size = this.count(0, this.data);
		return this.size;
	},
	count : function(size, o) {
		var me = this;
		size = size || 0;
		for(var p in o) {
			if(o[p][me.config.endSign]) {
				size++;
			} else {
				size += this.count(size, o[p]);
			}
		}
		return size;
	},
	/**
	 * 从字典中取出符合key的value值
	 * @param {String}
	 * @return {String}
	 */
	get : function(key) {
		var value = value || null;
		var key = key || null;
		var me = this;
		if(key == null) {
			return;
		}
		var beginIndex = 0, recurDeep = 0, //
		lookfor = me.data, index, lastLookfor, find;
		while(beginIndex < key.length) {
			if(recurDeep < me.deep - 1) {
				index = key.substring(beginIndex, beginIndex + 1);
				find = lookfor[index];
			} else {
				index = key.substring(beginIndex);
				find = lookfor[index];
			}
			if($kit.isEmpty(find)) {//如果找不到key了
				return null;
			} else {
				if(beginIndex == key.length - 1 || recurDeep == me.deep - 1) {
					return find[me.config.endSign];
				}
			}
			lookfor = find;
			beginIndex++;
			recurDeep++;
		}
		return null;
	},
	/**
	 * 按首字符匹配原则查询，返回
	 * [{key: 'key', value: 'value'}, {key: 'key', value: 'value'}]格式数组
	 * @param {String}
	 * @return {Array}
	 */
	search : function(key) {
		var value = value || null;
		var key = key || null;
		var me = this;
		if(key == null || key == '') {
			var re = [];
			me.travel(me.data, re);
			return re;
		}
		var beginIndex = 0, recurDeep = 0, //
		lookfor = me.data, index, lastLookfor, find;
		var keyArray = [];
		while(beginIndex < key.length) {
			if(recurDeep < me.deep - 1) {
				index = key.substring(beginIndex, beginIndex + 1);
				find = lookfor[index];
			} else {
				index = key.substring(beginIndex);
				find = lookfor[index];
			}
			if($kit.isEmpty(find)) {//如果找不到key了
				return null;
			} else {
				keyArray.push(index);
				if(beginIndex == key.length - 1 || recurDeep == me.deep - 1) {
					break;
				}
			}
			lookfor = find;
			beginIndex++;
			recurDeep++;
		}
		var re = [];
		var beginData;
		beginData = me.data[keyArray[0]];
		for(var i = 1; i < keyArray.length; i++) {
			beginData = beginData[keyArray[i]];
		}
		me.travel(beginData, re, keyArray.join(''));
		return re;
	},
	/**
	 * @private
	 */
	travel : function(tree, array, key, currentKey) {
		var me = this;
		if(tree == null) {
			return;
		}
		key = key || '';
		array = array || [];
		if(tree[me.config.endSign]) {
			array.push({
				key : key,
				value : tree[me.config.endSign]
			});
		}
		for(var k in tree) {
			if(k != me.config.endSign) {
				me.travel(tree[k], array, key + k, k);
			}
		}
	}
};
/**
 * @class $kit.TreeDict
 * @extends TreeDict
 */
$kit.TreeDict = TreeDict;

/**
 * 数组扩展
 * @class $Kit.Math
 * @requires kit.js
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/math.js">Source code</a>
 */
$Kit.Math = function() {
	//
}
$kit.merge($Kit.Math.prototype,
/**
 * @lends $Kit.Math.prototype
 */
{
	/**
	 * 前面补0
	 * @param {Number|String}
	 * @param {Number}
	 * @return {String}
	 */
	padZero : function(num, length) {
		var re = num.toString();
		do {
			var l1 = re.indexOf(".") > -1 ? re.indexOf(".") : re.length;
			if(l1 < length) {
				re = "0" + re;
			}
		} while (l1 < length);
		return re;
	},
	/**
	 * 返回min与max之间的随机数，没有max，则返回0~min之间
	 * @param {Number}
	 * @param {Number} [max]
	 * @return {Number}
	 */
	rand : function(min, max) {
		max = max || min || 100;
		min = min || 0;
		var rnd = Math.round(Math.random() * max);
		if(min != 0 && max != min) {
			if(min > max) {
				max = min;
			}
			if(min < 0) {
				rnd = this.positiveOrNegative() * rnd;
			}
			while(rnd < min) {
				rnd = this.positiveOrNegative() * Math.round(Math.random() * max)
			}
		}
		return rnd;
	},
	/**
	 * 随机返回0或者1
	 * @return {Number}
	 */
	oneOrZero : function() {
		return Math.round(Math.random());
	},
	/**
	 * 随机返回正或者负，return -1 || +1
	 * @return {Number}
	 */
	positiveOrNegative : function() {
		var flag = this.oneOrZero();
		if(flag) {
			return 1;
		}
		return -1;
	},
	/**
	 * 取多少位的随机数，返回string
	 * @param {Number}
	 * @return {String}
	 */
	randUnit : function(length) {
		length = length || 3;
		return this.padZero(Math.round(Math.random() * Math.pow(10, length)), length);
	},
	/**
	 * 取多少位的随机数，开头非0，返回数字
	 * @param {Number}
	 * @return {String}
	 */
	randUnitNotZeroBefore : function(length) {
		length = length || 3;
		var re = Math.round(Math.random() * Math.pow(10, length));
		while(re < Math.pow(10, length - 1)) {
			re = Math.round(Math.random() * Math.pow(10, length));
		}
		return re;
	},
	/**
	 * 进制转换
	 * @param {Number|String}
	 * @param {Number|String}
	 * @param {Number|String}
	 * @return {String}
	 */
	convert : function(str, oldHex, newHex) {
		var num = new String(str);
		num = parseInt(num, parseInt(oldHex));
		return num.toString(parseInt(newHex));
	},
	/**
	 * 给数字添加逗号分割
	 * @param {Number}
	 * @param {String} [sign] 分隔符号，默认是,
	 * @param {Number} [n] 默认以千位分割，默人是3，10的3次方
	 * @return {String}
	 */
	splitNumberWithComma : function(num, sign, n) {
		if(sign == null && n == null) {
			sign = ',';
			n = 3;
		} else {
			if(n == null) {
				if( typeof sign != 'number') {
					//
					n = 3;
				} else {
					sign = ',';
					n = parseInt(sign);
				}
			}
		}
		var s = num.toString().split('');
		var a = [], b = [];
		for(var i = 0; i < s.length; i++) {
			if((s.length - i - 1) % n > 0) {
				b.push(s[i]);
			} else {
				b.push(s[i]);
				a.push(b.join(''));
				b = [];
			}
		}
		return a.join(sign);
	}
});
/**
 * $Kit.Math的实例，直接通过这个实例访问$Kit.Math所有方法
 * @global
 * @type $Kit.Math
 */
$kit.math = new $Kit.Math();

/**
 * fom组件
 * @class $kit.ui.Form
 * @requires kit.js
 * @requires ieFix.js
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/widget/Form/form.js">Source code</a>
 */
$kit.ui.Form = function(config) {
	var me = this;
	me.config = $kit.join(me.constructor.defaultConfig, config);
};
$kit.merge($kit.ui.Form,
/**
 * @lends $kit.ui.Form
 */
{
	/**
	 * @enum
	 */
	defaultConfig : {
		kitWidgetName : "kitForm"
	}
});
$kit.merge($kit.ui.Form.prototype,
/**
 * @lends $kit.ui.Form.prototype
 */
{
	/**
	 * 注册自定义事件
	 * @param {Object} config
	 * @param {String} config.ev
	 * @param {Function} config.fn
	 */
	ev : function() {
		if(arguments.length == 1) {
			var evCfg = arguments[0];
			var scope = evCfg.scope || this;
			if($kit.isFn(evCfg.fn) && $kit.isStr(evCfg.ev)) {
				var evCfg = {
					ev : evCfg.ev,
					fn : evCfg.fn,
					scope : this
				};
				this.event = this.event || {};
				this.event[evCfg.ev] = this.event[evCfg.ev] || [];
				this.event[evCfg.ev].push(evCfg);
			}
		}
	},
	/**
	 * 触发自定义事件
	 * @param {Object} config
	 * @param {String} config.ev
	 */
	newEv : function() {
		if(arguments.length == 1 && !$kit.isEmpty(this.event)) {
			var evAry, evCfg, _evCfg = {};
			if($kit.isStr(arguments[0])) {
				var ev = arguments[0];
				evAry = this.event[ev];
			} else if($kit.isObj(arguments[0])) {
				_evCfg = arguments[0];
				evAry = this.event[_evCfg.ev];
			}
			if(!$kit.isEmpty(evAry)) {
				for(var i = 0; evAry != null && i < evAry.length; i++) {
					evCfg = $kit.merge(evAry[i], _evCfg);
					var e = {
						target : this,
						type : evCfg.ev
					}
					evCfg.fn.call(evCfg.scope, e, evCfg);
				}
			}
		}
	}
});

/**
 * combobox
 * @class $kit.ui.Form.ComboBox
 * @extends $kit.ui.Form
 * @requires kit.js
 * @requires ieFix.js
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/widget/Form/combobox.js">Source code</a>
 * @example
 * <a href="http://xueduany.github.com/KitJs/KitJs/demo/Combobox/combobox.html">Demo</a><br/>
 * <img src="http://xueduany.github.com/KitJs/KitJs/demo/Combobox/demo.png">
 */
$kit.ui.Form.ComboBox = function(config) {
	$kit.inherit({
		child : $kit.ui.Form.ComboBox,
		father : $kit.ui.Form
	});
	var me = this;
	me.config = $kit.join(me.constructor.defaultConfig, config);
	me.init();
}
$kit.merge($kit.ui.Form.ComboBox,
/**
 * @lends $kit.ui.Form.ComboBox
 */
{
	/**
	 * @enum
	 */
	defaultConfig : {
		el : undefined,
		kitWidgetName : 'kitFormComboBox',
		transformCls : 'kitjs-form-combobox',
		inputCls : 'kitjs-form-combobox-input',
		wrapperCls : 'kitjs-form-combox-wrapper',
		/**
		 * 延时
		 * @type {Number}
		 */
		suggestDelay : 100
	}
});
$kit.merge($kit.ui.Form.ComboBox.prototype,
/**
* @lends $kit.ui.Form.ComboBox.prototype
*/
{
/**
* 初始化
*/
init: function () {
    var me = this;
    //me.transform();
},
/**
* 变形为comboBox
*/

transform: function () {
    var me = this;

    this.wrapper = document.createElement('div');
    $kit.adCls(this.wrapper, this.config.wrapperCls);
    this.inputEl = document.createElement('input');
    this.inputEl.className = me.config.inputCls;
    this.inputEl.type = 'text';
    this.inputEl.name = inputname[inputname_i];
     inputname_i == 2 ? 0 : inputname_i++;
    //formEl
    this.formEl = document.createElement('input');
    this.formEl.type = 'hidden';
    if (me.config.el.name) {
        this.formEl.name = me.config.el.name;
    }
    //
    this.wrapper.appendChild(me.inputEl);
    this.wrapper.appendChild(me.formEl);
    $kit.rpEl(this.config.el, this.wrapper);
    //
    this.fillData();
    this.list = new $kit.ui.Form.List({
        where: me.wrapper,
        list: me.config.data.search(''),
        triggleEl: me.inputEl,
        formEl: me.formEl,
        setValue: function (key, value) {
            me.setValue(key, value, me.list.selectedLi);
            me.newEv({
                ev: 'change'
            });
        }
    });
    $kit.ev({
        el: me.inputEl,
        ev: 'input change',
        fn: function (e) {
            var me = this;
            me._inputChange();
        },
        scope: me
    });
    $kit.ev({
        el: me.inputEl,
        ev: 'propertychange',
        fn: function (e) {
            var me = this;
            if (e.propertyName.toLowerCase() == 'value') {
                me._inputChange();
            }
        },
        scope: me
    });
    $kit.ev({
        el: me.inputEl,
        ev: 'focus',
        fn: function (e) {
            var me = this;
            me.hasFocus = true;
        },
        scope: me
    });
    $kit.ev({
        el: me.inputEl,
        ev: 'blur',
        fn: function (e) {
            var me = this;
            me.hasFocus = false;
            $('#academy').val($('#academy').prev().val());
            $('#department').val($('#department').prev().val());
            $('#major').val($('#major').prev().val());
            if ($('#academy').val() != "" && $('#department').val() != "" && $('#major').val() != "")
                Checkform_Combobox();
            else if ($('#academy').val() == "" && $('#department').val() == "" && $('#major').val() == "") {
                $('#academy').prev().removeAttr('style');
                $('#department').prev().removeAttr('style');
                $('#major').prev().removeAttr('style');
                $("#combobox-tip").html('');
                $("#combobox-tip").slideUp("fast");
            }
            me._blur && me._blur();
            me._inputChange();
        },
        scope: me
    });
    //
},
_inputChange: function () {
    var me = this;
    clearTimeout(me._timeout_suggest);
    me._timeout_suggest = setTimeout(function () {
        me.suggest();
        me._setFormValue();
        me.newEv({
            ev: 'change'
        });
    }, me.config.suggestDelay);
},
/**
* 给隐藏表单元素赋值
* @private
*/
_setFormValue: function () {
    var me = this;
    if (me.list.listItemCount == 1 && me.inputEl.value == $kit.attr($kit.el8cls(me.list.config.listItemCls, me.list.listEl), 'key')) {
        me.formEl.value = $kit.attr($kit.el8cls(me.list.config.listItemCls, me.list.listEl), 'value');
    } else {
        me.formEl.value = me.inputEl.value;
    }
},
/**
* 填充数据
*/
fillData: function () {
    if ($kit.isEmpty(this.config.data)) {
        this.config.data = new $kit.TreeDict();
        if (this.config.el.tagName && this.config.el.tagName.toLowerCase() == 'select') {
            var select = this.config.el;
            for (var i = 0; i < select.options.length; i++) {
                var option = select.options[i];
                this.config.data.ad(option.text, option.value);
            }
        }
    }
},
/**
* 智能提示
*/
suggest: function () {
    var me = this;
    $kit.adCls(me.wrapper, 'suggesting');
    setTimeout(function () {
        me.list.buildList(me.config.data.search(me.inputEl.value));
        if (me.hasFocus && me.list._flag_listEl_mousedown_ev != true) {
            if (me.list.listItemCount == 1) {
                var li = $kit.el8cls(me.list.config.listItemCls, me.list.listEl);
                if (me.inputEl.value == $kit.attr(li, 'key')) {
                    me.list.selectedLi = li;
                    $kit.adCls(me.list.selectedLi, me.list.config.selectedCls);
                }
            }
            me.list.show();
        }
        if (me.list._flag_listEl_mousedown_ev == true) {
            me.list._flag_listEl_mousedown_ev = false;
        }
        setTimeout(function () {
            $kit.rmCls(me.wrapper, 'suggesting')
        }, 200);
    }, 0);
},
/**
* js赋值API
*/
setValue: function (key, value, selectedLi) {
    var me = this;
    if (key == null) {
        return;
    }
    me.inputEl.value = key;
    value = value || null;
    if (value == null) {
        value = this.data.get(key);
    }
    me.formEl.value = value;
    selectedLi = selectedLi || null;
    if (selectedLi == null) {
        var a = [];
        if (me.list.listEl.getElementsByClassName) {
            a = $kit.els8cls(me.list.config.listItemCls);
        } else {
            a = me.list.listEl.childNodes;
        }
        for (var i = 0; i < a.length; i++) {
            if ($kit.hsCls(a[i], me.list.listItemCls)) {
                if ($kit.attr(a[i], 'key') == key) {
                    selectedLi = a[i];
                }
            }
        }
    }
    me.list.selectedLi = selectedLi;
},
_blur: function () {
    //
}
});

/**
 * 带自动完成的select
 * @class $kit.ui.Form.ComboBox.Select
 * @extends $kit.ui.Form.ComboBox
 * @requires kit.js
 * @requires ieFix.js
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/widget/Form/suggestselect.js">Source code</a>
 * @example
 * <a href="http://xueduany.github.com/KitJs/KitJs/demo/LinkageSelect/demo.html">Demo</a><br/>
 * <img src="http://xueduany.github.com/KitJs/KitJs/demo/LinkageSelect/demo.png">
 */
$kit.ui.Form.ComboBox.Select = function(config) {
	$kit.inherit({
		child : $kit.ui.Form.ComboBox.Select,
		father : $kit.ui.Form.ComboBox
	});
	var me = this;
	me.config = $kit.join(me.constructor.defaultConfig, config);
	me.init();
}
$kit.merge($kit.ui.Form.ComboBox.Select,
/**
 * @lends $kit.ui.Form.ComboBox.Select
 */
{
	/**
	 * @enum
	 */
	defaultConfig : {
		el : undefined,
		kitWidgetName : 'kitFormSuggestSelect',
		transformCls : 'kitjs-form-suggestselect',
		inputCls : 'kitjs-form-suggestselect-input',
		wrapperCls : 'kitjs-form-suggestselect-wrapper',
		suggestDelay : 100
	}
});
$kit.merge($kit.ui.Form.ComboBox.Select.prototype,
/**
 * @lends $kit.ui.Form.ComboBox.Select.prototype
 */
{
	/**
	 * 给隐藏表单元素赋值
	 */
	_setFormValue : function() {
		var me = this;
		if(me.list.listItemCount == 1 && me.inputEl.value == $kit.attr($kit.el8cls(me.list.config.listItemCls, me.list.listEl), 'key')) {
			var li = $kit.el8cls(me.list.config.listItemCls, me.list.listEl);
			me.formEl.value = $kit.attr(li, 'value');
		}
	},
	_blur : function() {
		var me = this;
		if($kit.isEmpty(me.list.selectedLi)) {
			//me.inputEl.value = '';
		} else {
			me.inputEl.value = $kit.attr(me.list.selectedLi, 'key');
		}
	}
});

/**
 * 鼠标键盘操作的列表，常用于input的下拉
 * @class $kit.ui.Form.List
 * @extends $kit.ui.Form
 * @requires kit.js
 * @requires ieFix.js
 * @requires dom.js
 * @see <a href="https://github.com/xueduany/KitJs/blob/master/KitJs/src/js/widget/Form/list.js">Source code</a>
 */
$kit.ui.Form.List = function(config) {
	$kit.inherit({
		child : $kit.ui.Form.List,
		father : $kit.ui.Form
	});
	var me = this;
	me.config = $kit.join(me.constructor.defaultConfig, config);
	me.init();
}
$kit.merge($kit.ui.Form.List,
/**
 * @lends $kit.ui.Form.List
 */
{
	/**
	 * @enum
	 */
	defaultConfig : {
		where : undefined,
		pos : 'last',
		what : [//
		'<ul class="${listCls}">', //
		'</ul>'//
		].join(''),
		kitWidgetName : 'kitFormList',
		listCls : 'kitjs-form-list',
		listItemCls : 'kitjs-form-listItem',
		oddListItemCls : 'kitjs-form-listItem-odd',
		evenListItemCls : 'kitjs-form-listItem-even',
		listItemHTML : [//
		'<li class="${listItemCls} ${oddOrEven}" value="${value}" key="${key}">', //
		'${text}', //
		'</li>'//
		].join(''),
		list : undefined,
		selectedCls : 'selected',
		triggleEl : undefined, //事件触发元素
		template : {
			initHTML : '<div class="kitjs-form-list-loading"><i></i>初始化数据中...</div>',
			errorHTML : '<div class="kitjs-form-list-error">抱歉，没有数据!</div>'
		},
		setValue : undefined
	}
});
$kit.merge($kit.ui.Form.List.prototype,
/**
* @lends $kit.ui.Form.List.prototype
*/
{
/*
* 初始化
*/
init: function () {
    $kit.insEl({
        where: this.config.where,
        pos: this.config.pos,
        what: $kit.tpl(this.config.what, this.config)
    });
    this.listItemCount = 0;
    this.listEl = $kit.el8cls(this.config.listCls, this.config.where);
    this.buildList(this.config.list);
    this.bindEv();
    this.hide();
},
/**
* 创建列表
*/
buildList: function (list) {
    var me = this;
    this.listItemCount = 0;
    this.selectedLi = null;
    if (list && list.length) {
        this.listEl.innerHTML = this.config.template.initHTML;
        var fragment = document.createDocumentFragment();
        $kit.each(list, function (o, idx) {
            fragment.appendChild($kit.newHTML($kit.tpl(me.config.listItemHTML, $kit.join(me.config, o, {
                oddOrEven: idx % 2 == 0 ? me.config.evenListItemCls : me.config.oddListItemCls
            }, {
                text: '<b>' + me.config.triggleEl.value + '</b>' + o.key.substring(me.config.triggleEl.value.length)
            }))));
            me.listItemCount++;
        });
        me.listEl.innerHTML = '';
        me.listEl.appendChild(fragment);
    } else {
        this.listEl.innerHTML = this.config.template.errorHTML;
    }
},
/**
* 绑定事件
*/
bindEv: function () {
    var me = this;
    /**
    * 失去焦点，关闭列表
    */
    $kit.ev({
        el: me.config.triggleEl,
        ev: 'blur',
        fn: function (e) {
            var me = this;
            if (me._flag_listEl_mousedown_ev == true) {
            } else {
                me.hide();
            }
        },
        scope: me
    });
    /**
    * 获得焦点，展开列表
    */
    $kit.ev({
        el: me.config.triggleEl,
        ev: 'focus',
        fn: function () {
            var me = this;
            if (me.listItemCount > 0 && me._flag_listEl_mousedown_ev != true) {
                me.show();
            }
        },
        scope: me
    });
    /**
    * 鼠标选择
    */
    $kit.ev({
        el: me.listEl,
        ev: 'mouseover',
        fn: function (e) {
            var me = this;
            var li;
            if ($kit.hsCls(e.target, me.config.listItemCls)) {
                li = e.target;
            } else {
                li = $kit.dom.parentEl8cls(e.target, me.config.listItemCls, me.listEl);
            }
            if (li) {
                if (me.selectedLi) {
                    $kit.rmCls(me.selectedLi, me.config.selectedCls);
                }
                $kit.adCls(li, me.config.selectedCls);
                me.selectedLi = li;
            }
        },
        scope: me
    });
    /**
    * 鼠标移出列表区，inputEl聚焦
    */
    $kit.ev({
        el: me.listEl,
        ev: 'mouseout',
        fn: function (e) {
            var me = this;
            if (!$kit.contains(me.listEl, e.relatedTarget)) {
                me.config.triggleEl.focus();
            }
        },
        scope: me
    });
    $kit.ev({
        el: me.listEl,
        ev: 'mousedown',
        fn: function (e) {
            var me = this;
            me._flag_listEl_mousedown_ev = true;
            if (e.button < 2) {
                var li;
                if ($kit.hsCls(e.target, me.config.listItemCls)) {
                    li = e.target;
                } else {
                    li = $kit.dom.parentEl8cls(e.target, me.config.listItemCls, me.listEl);
                }
                if (li) {
                    me.hide();
                    me.selectedLi = li;
                    me.config.setValue && me.config.setValue($kit.attr(li, 'key'), $kit.attr(li, 'value'), li);
                }
            }
        },
        scope: me
    });
    /**
    * 键盘事件响应
    */
    $kit.ev({
        el: me.config.triggleEl,
        ev: 'keydown',
        fn: function (e) {
            var me = this;
            if ($kit.event.KEYCODE_DOWN == e.keyCode//下
				|| $kit.event.KEYCODE_UP == e.keyCode//上
				|| $kit.event.KEYCODE_ENTER == e.keyCode//回车
				|| $kit.event.KEYCODE_ESC == e.keyCode//esc
				|| $kit.event.KEYCODE_PAGEDOWN == e.keyCode//pagedown
				|| $kit.event.KEYCODE_PAGEUP == e.keyCode//pageup
				) {
                //var selectedLi = $kit.el8cls('selected', me.listEl);
                var selectedLi = me.selectedLi;
                var firstLi = $kit.el8cls(me.config.listItemCls, me.listEl);
                if ($kit.event.KEYCODE_DOWN == e.keyCode && me.listEl.childNodes.length) {
                    /**
                    * 下
                    */
                    me.show();
                    if ($kit.isEmpty(selectedLi)) {
                        $kit.adCls(firstLi, 'selected');
                        me.selectedLi = firstLi;
                    } else {
                        $kit.rmCls(selectedLi, 'selected');
                        var nextLi = $kit.nextEl(selectedLi, function (el) {
                            if ($kit.hsCls(el, me.config.listItemCls)) {
                                return true;
                            }
                        });
                        if (nextLi) {
                            $kit.adCls(nextLi, 'selected');
                            me.selectedLi = nextLi;
                        } else {
                            $kit.adCls(firstLi, 'selected');
                            me.selectedLi = firstLi;
                        }
                    }
                } else if ($kit.event.KEYCODE_UP == e.keyCode && me.listEl.childNodes.length) {
                    /**
                    * 上
                    */
                    me.show();
                    if ($kit.isEmpty(selectedLi)) {
                        $kit.adCls(firstLi, 'selected');
                        me.selectedLi = firstLi;
                    } else {
                        $kit.rmCls(selectedLi, 'selected');
                        var prevLi = $kit.prevEl(selectedLi, function (el) {
                            if ($kit.hsCls(el, me.config.listItemCls)) {
                                return true;
                            }
                        });
                        if (prevLi) {
                            $kit.adCls(prevLi, 'selected');
                            me.selectedLi = prevLi;
                        } else {
                            $kit.adCls(firstLi, 'selected');
                            me.selectedLi = firstLi;
                        }
                    }
                } else if ($kit.event.KEYCODE_PAGEUP == e.keyCode && me.listEl.childNodes.length) {
                    /**
                    * pageup
                    */
                    me.show();
                    if ($kit.isEmpty(selectedLi)) {
                        $kit.adCls(firstLi, 'selected');
                        me.selectedLi = firstLi;
                    } else {
                        $kit.rmCls(selectedLi, 'selected');
                        var throughCount = Math.floor(me.listEl.offsetHeight / me.selectedLi.offsetHeight);
                        var prevLi = selectedLi;
                        while (throughCount--) {
                            var _li = $kit.prevEl(prevLi, function (el) {
                                if ($kit.hsCls(el, me.config.listItemCls)) {
                                    return true;
                                }
                            });
                            if (_li == null) {
                                break;
                            }
                            prevLi = _li;
                        }
                        if (prevLi) {
                            $kit.adCls(prevLi, 'selected');
                            me.selectedLi = prevLi;
                        } else {
                            $kit.adCls(firstLi, 'selected');
                            me.selectedLi = firstLi;
                        }
                    }
                } else if ($kit.event.KEYCODE_PAGEDOWN == e.keyCode && me.listEl.childNodes.length) {
                    /**
                    * pagedown
                    */
                    me.show();
                    if ($kit.isEmpty(selectedLi)) {
                        $kit.adCls(firstLi, 'selected');
                        me.selectedLi = firstLi;
                    } else {
                        $kit.rmCls(selectedLi, 'selected');
                        var throughCount = Math.floor(me.listEl.offsetHeight / me.selectedLi.offsetHeight);
                        var nextLi = selectedLi;
                        while (throughCount--) {
                            var _li = $kit.nextEl(nextLi, function (el) {
                                if ($kit.hsCls(el, me.config.listItemCls)) {
                                    return true;
                                }
                            });
                            if (_li == null) {
                                break;
                            }
                            nextLi = _li;
                        }
                        if (nextLi) {
                            $kit.adCls(nextLi, 'selected');
                            me.selectedLi = nextLi;
                        } else {
                            $kit.adCls(firstLi, 'selected');
                            me.selectedLi = firstLi;
                        }
                    }
                } else if ($kit.event.KEYCODE_ENTER == e.keyCode && me.isShow() && me.listItemCount) {
                    /**
                    * 回车
                    */
                    me.hide();
                    me.config.setValue && me.config.setValue($kit.attr(me.selectedLi, 'key'), $kit.attr(me.selectedLi, 'value'), me.selectedLi);
                    me._flag_listEl_mousedown_ev = true;
                    //回车要取消默认事件，防止form提交
                    e.stopDefault();
                } else if ($kit.event.KEYCODE_ESC == e.keyCode) {
                    /**
                    * ESC，关闭下拉框
                    */
                    if (me.isShow()) {
                        me.hide();
                    }
                }
                me.adjustScrollTop(me.listEl);
                e.stopDefault();
            }
        },
        scope: me
    });
},
/**
* 调整滚动条保证选择的选项在视野内
*/
adjustScrollTop: function (listEl) {
    selectedLi = this.selectedLi;
    if ($kit.isEmpty(selectedLi)) {
        return;
    }
    if (selectedLi.offsetTop < listEl.scrollTop || selectedLi.offsetTop + selectedLi.offsetHeight > listEl.scrollTop + listEl.offsetHeight) {
        selectedLi.scrollIntoView();
    }
},
/**
* 是否隐藏
*/
isHide: function () {
    var me = this;
    return me.listEl.style.display != 'block'
},
/**
* 是否显示
*/
isShow: function () {
    var me = this;
    return me.listEl.style.display == 'block'
},
/**
* 显示
*/
show: function () {
    var me = this;
    me._flag_listEl_mousedown_ev = false;
    me.listEl.style.display = 'block';
},
/**
* 隐藏
*/
hide: function () {
    var me = this;
    me.listEl.style.display = 'none';
}
});

    var a = $kit.els8cls($kit.ui.Form.ComboBox.Select.defaultConfig.transformCls), a1 = [];

     for(var i = 0; i < a.length; i++) {
	   a1.push(a[i])
     }
     a = a1;
     b1 = new $kit.ui.Form.ComboBox.Select({
	 el : a[0],
	 data : (function() {
		var academyTree = new TreeDict();
		for(var academy in SchoolJSON) {
			academyTree.ad(academy, academy);					  
        }
        return academyTree;
	    })()
    });
    b1.transform();
    b1.ev({
	ev : 'change',
	fn : function() {
		
		if(SchoolJSON[b1.inputEl.value] == null) {
			return;
		}
        var academy = SchoolJSON[b1.inputEl.value];
		var departmentTree = new TreeDict();
		for(var department in academy) {
			departmentTree.ad(department, department);
		}
		b2.inputEl.value = '';
		b2.formEl.value = '';
		b2.config.data = departmentTree;
		b2.list.buildList(departmentTree.search(''));
	}
  });
  b2 = new $kit.ui.Form.ComboBox.Select({
	el : a[1],
	data : undefined
   });
   b2.transform();
   b2.ev({
   ev : 'change',
   fn : function() {				
		if(SchoolJSON[b1.inputEl.value][b2.inputEl.value] == null) {
			return;
		}
        var department = SchoolJSON[b1.inputEl.value][b2.inputEl.value];

		var majorTree = new TreeDict();
		for(var major in department) {
			majorTree.ad(major, department[major]);
		}
		b3.inputEl.value = '';
		b3.formEl.value = '';
		b3.config.data = majorTree;
		b3.list.buildList(majorTree.search(''));
	}
	});
	b3 = new $kit.ui.Form.ComboBox.Select({
		el : a[2],
		data : undefined
	});
};