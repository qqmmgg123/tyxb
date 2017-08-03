/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	(function (factory) {
	    module.exports = factory(__webpack_require__(13).default, __webpack_require__(41).default, __webpack_require__(9), __webpack_require__(21), __webpack_require__(117));
	})(function (req, effect, utils, common, router) {
	    // 消息列表
	    var msgList = {
	        selector: '#msg-list',
	        init: function init() {
	            this.el = document.querySelector(this.selector);
	            this.bindEvent();
	        },
	        bindEvent: function bindEvent() {
	            this.el.addEventListener('click', function (ev) {
	                var el = ev.target,
	                    matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

	                while (el && el !== ev.currentTarget) {
	                    if (matchesSelector.call(el, 'a[rel="message-remove"]')) {
	                        var mid = utils.getData(el, 'mid'),
	                            msgCurr = utils.closest(el, 'li');

	                        req.post("/message/remove", {
	                            mid: mid
	                        }, function (data) {
	                            common.xhrReponseManage(data, function () {
	                                effect.fadeOut(msgCurr, function (cur) {
	                                    cur.parentNode.removeChild(cur);
	                                });
	                            });
	                        }, function () {});
	                        break;
	                    }
	                    el = el.parentElement;
	                }
	            });
	        }
	    };

	    msgList.init();

	    common.statistics();
	});
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(48);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(61)
	  , defined = __webpack_require__(28);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(68);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(66);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {

	    var utilities = {
	        extend: function (_extend) {
	            function extend() {
	                return _extend.apply(this, arguments);
	            }

	            extend.toString = function () {
	                return _extend.toString();
	            };

	            return extend;
	        }(function () {

	            // Variables
	            var extended = {};
	            var deep = false;
	            var i = 0;
	            var length = arguments.length;

	            // Check if a deep merge
	            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
	                deep = arguments[0];
	                i++;
	            }

	            // Merge the object into the extended object
	            var merge = function merge(obj) {
	                for (var prop in obj) {
	                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
	                        // If deep merge and property is an object, merge properties
	                        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
	                            extended[prop] = extend(true, extended[prop], obj[prop]);
	                        } else {
	                            extended[prop] = obj[prop];
	                        }
	                    }
	                }
	            };

	            // Loop through each object and conduct a merge
	            for (; i < length; i++) {
	                var obj = arguments[i];
	                merge(obj);
	            }

	            return extended;
	        }),
	        // 获取URL指定参数方法
	        getUrlParams: function getUrlParams(staticURL, decode) {
	            var currLocation = staticURL && staticURL.length ? staticURL : window.location.href,
	                parArr_0 = currLocation.split("?"),
	                data = {};

	            if (parArr_0.length > 1) {
	                var parArr = parArr_0[1].split("&");
	                for (var i = 0; i < parArr.length; i++) {
	                    var parr = parArr[i].split("=");
	                    if (parr.length > 1) {
	                        var value = decode ? decodeURIComponent(parr[1]) : parr[1];
	                        data[parr[0]] = value;
	                    }
	                }
	            }

	            return data;
	        },
	        isValidEmail: function isValidEmail(emailAddress) {
	            var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	            return pattern.test(emailAddress);
	        },
	        isUrl: function isUrl(str) {
	            var pattern = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	            if (!pattern.test(str)) {
	                return false;
	            } else {
	                return true;
	            }
	        },
	        isUserName: function isUserName(name) {
	            var pattern = /^([a-z\d_\u4e00-\u9fa5]){2,24}$/;
	            return pattern.test(name);
	        },
	        isPassword: function isPassword(pwd) {
	            var pattern = /^\w{6,16}$/;
	            return pattern.test(pwd);
	        },
	        isTag: function isTag(name) {
	            var pattern = /^([a-z\d_\u4e00-\u9fa5]){2,24}$/;
	            return pattern.test(name);
	        },
	        getData: function getData(el, key) {
	            var v;
	            if (el.dataset) {
	                v = el.dataset[key];
	            } else {
	                v = el.getAttribute('data-' + key);
	            }

	            // Undefined
	            if (v == undefined) {
	                return undefined;
	            }

	            // Boolean
	            if (v === 'true' || v === 'false') {
	                return v === 'true';
	            }

	            return v;
	        },
	        setData: function setData(el, data) {
	            for (var k in data) {
	                if (el.dataset) {
	                    el.dataset[k] = data[k];
	                } else {
	                    el.setAttribute('data-' + k, data[k]);
	                }
	            }
	        },
	        addClass: function addClass(element, className) {
	            var classList = element.classList;
	            if (classList) {
	                return classList.add(className);
	            }
	            if (this.hasClass(element, className)) {
	                return;
	            }
	            element.className += " " + className;
	        },
	        removeClass: function removeClass(element, className) {
	            var classList = element.classList;
	            if (classList) {
	                return classList.remove(className);
	            }

	            element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ");
	        },
	        hasClass: function hasClass(element, className) {
	            var classList = element.classList;
	            if (classList) {
	                return classList.contains(className);
	            }

	            var elementClassName = element.className;
	            return elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName));
	        },
	        closest: function closest(el, selector) {
	            var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

	            while (el) {
	                if (matchesSelector.call(el, selector)) {
	                    break;
	                }
	                el = el.parentElement;
	            }
	            return el;
	        },
	        checkPlaceholder: function checkPlaceholder() {
	            var inp = document.createElement('input'),
	                ret = 'placeholder' in inp;
	            inp = null;
	            return ret;
	        },
	        // 增加输入框提示（主要是为了兼容ie）
	        placeholder: function placeholder(container) {
	            if (!this.checkPlaceholder()) {
	                var inputs = container.querySelectorAll('input, textarea');
	                for (var i = 0, count = inputs.length; i < count; i++) {
	                    if (inputs[i].getAttribute('placeholder')) {
	                        inputs[i].style.cssText = "color:#939393;";
	                        inputs[i].value = inputs[i].getAttribute("placeholder");
	                        inputs[i].onclick = function () {
	                            if (this.value == this.getAttribute("placeholder")) {
	                                this.value = '';
	                                this.style.cssText = "color:#000;font-style:normal;";
	                            }
	                        };
	                        inputs[i].onblur = function () {
	                            if (this.value == '') {
	                                this.value = this.getAttribute("placeholder");
	                                this.style.cssText = "color:#939393;";
	                            }
	                        };
	                    }
	                }
	            }
	        }
	    };

	    return utilities;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(18)
	  , IE8_DOM_DEFINE = __webpack_require__(53)
	  , toPrimitive    = __webpack_require__(38)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(10) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * @fileOverview 远程请求
	 * @version 0.1
	 * @author minggangqiu
	 */
	var Req = function () {
	    function Req() {
	        (0, _classCallCheck3.default)(this, Req);
	    }

	    (0, _createClass3.default)(Req, [{
	        key: "ajax",

	        // XmlHttprequest
	        value: function ajax(url, data) {
	            var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "get";
	            var success = arguments[3];
	            var error = arguments[4];


	            function createXHR() {
	                if (typeof XMLHttpRequest != "undefined") {
	                    return new XMLHttpRequest();
	                }
	            }

	            var xhr = createXHR();

	            var params = '';
	            if (data) {
	                for (name in data) {
	                    var value = encodeURIComponent(data[name]).replace('%20', '+').replace('%3D', '=');
	                    params += name + "=" + value + "&";
	                }

	                // 删除掉最后的"&"字符
	                params = params.slice(0, -1);
	            }

	            function reqComplete() {
	                try {
	                    if (xhr.readyState == 4) {
	                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
	                            var data = JSON.parse(xhr.responseText);
	                            success && success.call(this, data);
	                            xhr.removeEventListener("load", reqComplete, false);
	                        } else if (xhr.status == 500) {
	                            alert("服务器错误。");
	                        }
	                    }
	                } catch (err) {
	                    alert("服务器错误。");
	                }
	            }

	            xhr.addEventListener("load", reqComplete, false);

	            xhr.onerror = function (err) {
	                error && error.call(this, err);
	                xhr.onerror = null;
	            };

	            if (type === 'get') {
	                var t = new Date().getTime();
	                url = url + (params ? "?" + params + '&_t=' + t : '?_t=' + t);
	            }

	            xhr.open(type, encodeURI(url), true);
	            xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
	            if (type === 'post') {
	                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
	                xhr.send(params);
	                return;
	            } else if (type === 'get') {
	                xhr.setRequestHeader("If-Modified-Since", "0");
	            }
	            xhr.send(null);
	        }
	    }, {
	        key: "getJSON",
	        value: function getJSON(url, data, success, error) {
	            this.ajax(url, data, undefined, success, error);
	        }
	    }, {
	        key: "post",
	        value: function post(url, data, success, error) {
	            this.ajax(url, data, 'post', success, error);
	        }
	    }]);
	    return Req;
	}();

	;

	var req = new Req();

	var _default = req;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(Req, "Req", "E:/mypro/tyxb/src/req.js");

	    __REACT_HOT_LOADER__.register(req, "req", "E:/mypro/tyxb/src/req.js");

	    __REACT_HOT_LOADER__.register(_default, "default", "E:/mypro/tyxb/src/req.js");
	}();

	;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(5)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(51)
	  , hide      = __webpack_require__(15)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(12)
	  , createDesc = __webpack_require__(22);
	module.exports = __webpack_require__(10) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(36)('wks')
	  , uid        = __webpack_require__(23)
	  , Symbol     = __webpack_require__(5).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(19);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(57)
	  , enumBugKeys = __webpack_require__(29);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	(function (factory) {
	    module.exports = factory(__webpack_require__(47).default, __webpack_require__(62), __webpack_require__(13).default, __webpack_require__(41).default, __webpack_require__(9), __webpack_require__(63), __webpack_require__(46));
	})(function (_t, polyfill, req, effect, utils, dropdown, popup) {
	    var common = {
	        getPageSize: function getPageSize() {
	            var xScroll, yScroll;

	            if (window.innerHeight && window.scrollMaxY) {
	                xScroll = document.body.scrollWidth;
	                yScroll = window.innerHeight + window.scrollMaxY;
	            } else if (document.body.scrollHeight > document.body.offsetHeight) {
	                // all but Explorer Mac
	                xScroll = document.body.scrollWidth;
	                yScroll = document.body.scrollHeight;
	            } else {
	                // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
	                xScroll = document.body.offsetWidth;
	                yScroll = document.body.offsetHeight;
	            }

	            var windowWidth, windowHeight;
	            if (self.innerHeight) {
	                // all except Explorer
	                windowWidth = self.innerWidth;
	                windowHeight = self.innerHeight;
	            } else if (document.documentElement && document.documentElement.clientHeight) {
	                // Explorer 6 Strict Mode
	                windowWidth = document.documentElement.clientWidth;
	                windowHeight = document.documentElement.clientHeight;
	            } else if (document.body) {
	                // other Explorers
	                windowWidth = document.body.clientWidth;
	                windowHeight = document.body.clientHeight;
	            }

	            // for small pages with total height less then height of the viewport
	            var pageWidth, pageHeight, arrayPageSize;
	            if (yScroll < windowHeight) {
	                pageHeight = windowHeight;
	            } else {
	                pageHeight = yScroll;
	            }
	            // for small pages with total width less then width of the viewport
	            if (xScroll < windowWidth) {
	                pageWidth = windowWidth;
	            } else {
	                pageWidth = xScroll;
	            }

	            arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
	            return arrayPageSize;
	        },
	        checkMobile: function checkMobile() {
	            if (window.innerWidth <= 800 && window.innerHeight <= 600) {
	                return true;
	            } else {
	                return false;
	            }
	        },
	        dateBeautify: function dateBeautify(date) {
	            var hour = 60 * 60 * 1000,
	                day = 24 * hour,
	                currDate = this.dateFormat(new Date(), 'yyyy-MM-dd'),
	                today = new Date(currDate + ' 00:00:00').getTime(),
	                yesterday = today - day,
	                currTime = date.getTime(),
	                cHStr = this.dateFormat(date, 'hh:mm:ss');

	            if (currTime >= today) {
	                var time = (currTime - today) / hour;
	                var cHour = date.getHours();
	                var amCHour = cHour - 12;
	                var cMStr = this.dateFormat(date, 'mm:ss');
	                var str = time <= 12 ? '上午 ' + cHStr : '下午 ' + (amCHour < 10 ? amCHour : '0' + amCHour) + ':' + cMStr;
	                return str;
	            } else if (currTime < today && currTime >= yesterday) {
	                return "昨天 " + cHStr;
	            } else {
	                return this.dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
	            }
	        },
	        dateFormat: function dateFormat(date, format) {
	            var o = {
	                "M+": date.getMonth() + 1, //month
	                "d+": date.getDate(), //day
	                "h+": date.getHours(), //hour
	                "m+": date.getMinutes(), //minute
	                "s+": date.getSeconds(), //second
	                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
	                "S": date.getMilliseconds() //millisecond
	            };

	            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	            for (var k in o) {
	                if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	            }return format;
	        },
	        textNew: function textNew(type, tag) {
	            /*let pop = popup.textNewPop({
	                id   : 'textReleasePop',
	                type : type,
	                tag  : tag
	            });
	            pop.show();
	            return pop;*/
	            var state = History.getState(),
	                action = state.data.action;

	            if (!action && action !== 'posteditor') {
	                History.pushState({
	                    action: 'posteditor',
	                    params: {
	                        type: type,
	                        tag: tag
	                    }
	                }, 'posteditor', '?popup=posteditor&type=' + type + (tag ? '&tag=' + tag : ''));
	            }
	        },
	        showSigninPop: function showSigninPop() {
	            //popup.registrationPop({ cur: 'signin' }).show();
	            var state = History.getState(),
	                action = state.data.action;

	            if (!action && action !== 'signin') {
	                History.pushState({ action: 'signin' }, 'signin', "?popup=signin");
	            }
	        },
	        showSignupPop: function showSignupPop() {
	            //popup.registrationPop({ cur: 'signup' }).show();
	            var state = History.getState(),
	                action = state.data.action;

	            if (!action && action !== 'signup') {
	                History.pushState({ action: 'signup' }, 'signup', "?popup=signup");
	            }
	        },
	        showAvatarEditor: function showAvatarEditor(src, id) {
	            var state = History.getState(),
	                action = state.data.action;

	            if (!action && action !== 'avatareditor') {
	                History.pushState({
	                    action: 'avatareditor',
	                    params: {
	                        src: src,
	                        id: id
	                    }
	                }, 'avatareditor', "?popup=avatareditor&src=" + src + "&id=" + id);
	            }
	        },
	        showTextViewer: function showTextViewer(did) {
	            var state = History.getState(),
	                action = state.data.action;

	            if (!action && action !== 'textview') {
	                History.pushState({
	                    action: 'textview',
	                    params: {
	                        did: did
	                    }
	                }, 'textview', "?popup=textview&did=" + did);
	            }
	        },
	        showImageViewer: function showImageViewer(src) {
	            var state = History.getState(),
	                action = state.data.action;

	            if (!action && action !== 'imageview') {
	                History.pushState({
	                    action: 'imageview',
	                    params: {
	                        src: src
	                    }
	                }, 'imageview', "?popup=imageview&src=" + src);
	            }
	        },
	        xhrReponseManage: function xhrReponseManage(data, callback) {
	            var self = this;
	            switch (data.result) {
	                case 0:
	                    callback(data);
	                    break;
	                case 1:
	                    alert(data.info);
	                    break;
	                case 2:
	                    self.showSigninPop();
	                    break;
	                default:
	                    break;
	            };
	        },
	        statistics: function statistics() {
	            var _hmt = _hmt || [];
	            (function () {
	                var hm = document.createElement("script");
	                hm.src = "https://hm.baidu.com/hm.js?93021e0f5cc3538c992cf608b6c30431";
	                var s = document.getElementsByTagName("script")[0];
	                s.parentNode.insertBefore(hm, s);
	            })();
	        }
	    };

	    // 排序下拉
	    var appSelect = dropdown.create({
	        el: '#app-list-arrow',
	        container: '.h-left',
	        selector: '.h-left',
	        menu: '#app-list',
	        width: 'auto',
	        modal: true
	    });

	    // 菜单下拉
	    var navSelect = dropdown.create({
	        el: '[rel="conf-toggle"]',
	        container: '#config-dropdown',
	        selector: '#config-dropdown',
	        menu: '.config-list',
	        width: 'auto',
	        modal: true
	    });

	    var signinBtn = document.getElementById('signin-btn'),
	        signupBtn = document.getElementById('signup-btn');

	    signinBtn && signinBtn.addEventListener('click', function () {
	        common.showSigninPop();
	    });
	    signupBtn && signupBtn.addEventListener('click', function () {
	        common.showSignupPop();
	    });

	    // 错误提示
	    var errTips = document.querySelectorAll('.validate-error');
	    errTips && errTips.forEach(function (el) {
	        var error = el.textContent.trim();
	        if (error) {
	            el.style.display = 'block';
	        }
	    });

	    // Pad, mobile 下的搜索按钮
	    /*var inputBox    = document.getElementById('search-area'),
	        backBtn     = document.getElementById('search-back'),
	        resetBtn    = document.getElementById('search-reset'),
	        searchInput = document.getElementById('search-input'),
	        searchBtn   = document.getElementById('search_dream_btn');
	      searchBtn && searchBtn.addEventListener('click', function() {
	        if (inputBox.className.indexOf(' visible') === -1) {
	            inputBox.className += ' visible';
	        }
	    }, false);
	      backBtn && backBtn.addEventListener('click', function() {
	        inputBox.className = inputBox.className.replace(' visible', '');
	    }, false);
	      resetBtn && resetBtn.addEventListener('click', function() {
	        searchInput.value = '';
	    }, false);*/

	    // 查看消息列表
	    var msgNav = document.querySelector('#message-nav');

	    if (msgNav) {
	        var msgViewBtn = msgNav.querySelector('[rel="msg-view"]'),
	            list = msgNav.querySelector('.message-list'),
	            newTag = msgNav.querySelector('.message-new');

	        utils.setData(msgViewBtn, { show: false });

	        list.addEventListener('click', function (ev) {
	            var el = ev.target,
	                matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

	            while (el && el !== ev.currentTarget) {
	                if (matchesSelector.call(el, 'a.btn')) {
	                    var mid = utils.getData(el, 'mid'),
	                        msgCurr = utils.closest(el, 'li');

	                    req.post("/message/remove", {
	                        mid: mid
	                    }, function (data) {
	                        common.xhrReponseManage(data, function () {
	                            effect.fadeOut(msgCurr, function (cur) {
	                                cur.parentNode.removeChild(cur);
	                            });
	                        });
	                    }, function () {});

	                    break;
	                }
	                el = el.parentElement;
	            }
	        });

	        msgViewBtn.addEventListener('click', function () {
	            if (common.checkMobile()) {
	                window.location.replace('/message');
	                return;
	            }

	            if (!utils.getData(this, 'show')) {
	                list.innerHTML = '加载中...';
	                list.style.display = 'block';
	                utils.setData(this, { show: true });
	                req.getJSON("/message/boxshow", null, function (data) {
	                    common.xhrReponseManage(data, function () {
	                        if (data.data && data.data.length > 0) {
	                            var mtpl = '<li>{{ title }}<a href="{{ url }}"> {{ content }}</a> <a class="btn btn-small" data-mid="{{ _id }}">移除</a></li>',
	                                html = data.data.map(function (item) {
	                                return _t.template(mtpl, item);
	                            }).join('');
	                            list.innerHTML = html;
	                            list.style.display = 'block';
	                            var li = document.createElement('li');
	                            li.className = 'view-all';
	                            li.innerHTML = '<a href="/message">查看所有消息</a>';
	                            list.appendChild(li);
	                            newTag && newTag.parentNode.removeChild(newTag);
	                            return;
	                        }
	                        list.innerHTML = '<li><p class="nodata">没有消息。</p></li>';
	                        list.style.display = 'block';
	                    });
	                }, function () {
	                    list.innerHTML = '加载失败。';
	                });
	            } else {
	                list.style.display = 'none';
	                utils.setData(this, { show: false });
	            }
	        });

	        msgViewBtn.addEventListener('mousedown', function (ev) {
	            ev.stopPropagation();
	        });

	        list.addEventListener('mousedown', function (ev) {
	            ev.stopPropagation();
	        });

	        document.body.addEventListener('mousedown', function () {
	            if (utils.getData(msgViewBtn, 'show')) {
	                list.style.display = 'none';
	                utils.setData(msgViewBtn, { show: false });
	            }
	        });
	    }

	    /*var submitBtn = document.querySelector('button[type="submit"]'),
	        submitform = utils.closest(submitBtn, 'form');
	    (submitBtn && submitform) && submitform.addEventListener('submit', function(){
	        submitBtn.disabled = true;
	        utils.addClass(submitBtn, 'disabled');
	    });*/

	    return common;
	});
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(70);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(69);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(122);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var settings = {
	    COPY_RIGHT: "© 2017 娑婆诃",
	    APP_NAME: "初",
	    CASE_NUMBER: "粤ICP备16089330号-1",
	    DOMAIN: 'www.ty-xb.com',
	    SLOGAN: "记录点滴，感受彼此，生命是最美丽的书卷...",
	    UNKNOW_ERR: '异常错误',
	    PARAMS_PASSED_ERR_TIPS: "参数传递错误!",
	    USER_EXISTS_TIPS: "对不起，该用户已经存在，请重新尝试",
	    PAGE_NOT_FOND_TIPS: "该页面不存在",
	    USER_NOT_EXIST_TIPS: "该用户不存在",
	    DREAM_NOT_EXIST_TIPS: "内容不在了，也许已经被作者删除...",
	    TAG_EXIST_ERR: "该圈子已经存在，不能重复创建了",
	    TAG_MORE_ERR: "抱歉，目前一个用户只能创建1个圈子，可以留给他人些机会，圈子名称是唯一的，也请谨慎创建",
	    COMMENT_REQUIRE_ERR: "回复不能为空",
	    TAG_VALIDATION: "必须是由2~24个小写字母、数字、中文或下划线组成",
	    USERNAME_VALIDATION: "必须是由2~24个小写字母、数字、中文或下划线组成",
	    PASSWORD_VALIDATION: "必须是6~16个字符的字母或数字组成",
	    BUILDING_WORD: "该功能正在建设中，敬请谅解太阳圈子小站长一个人战斗，会累死~抱歉",
	    DREAM_PASS_ERROR: '您的发布的内容由于不符合本圈子或本站的发文规则，因此被该圈子驳回，敬请谅解。',
	    SUBSCRIBE: '关注 +',
	    CANCEL_SUBSCRIBE: '取消关注 -',
	    CATEGORY: {
	        TEXT: "文",
	        IMAGE: "画",
	        NEWS: "网址"
	    },
	    COMMENT_TEXT: {
	        EXPANSION_COMMENT: '回复'
	    },

	    OBJEXT_TYPE: {
	        DREAM      : 0, // 想法
	        COMMENT    : 1  // 留言
	    },

	    OBJECT: {
	        DREAM: {
	            CNNAME: '日常'
	        },
	        TAG: {
	            CNNAME: '圈子'
	        }
	    },

	    SORT_ROLE: {
	        HOT       : 1,  // 好评
	        NEW       : 2   // 最新
	    },

	    REGISTRATION: {
	        WORDING: "感谢您使用红太阳记事本"
	    },

	    PERMS: {
	        DREAM_REMOVE: '58a6ab9a1abc2e1c60f8c9ae'
	    }
	};

	// 模块定义
	if (typeof(module) === 'object' && module.exports === exports) {
	    module.exports = settings;
	} else if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        'use strict';
	        return settings;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	    exports.settings = settings;
	}


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(18)
	  , dPs         = __webpack_require__(88)
	  , enumBugKeys = __webpack_require__(29)
	  , IE_PROTO    = __webpack_require__(35)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(52)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(82).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(25)
	  , createDesc     = __webpack_require__(22)
	  , toIObject      = __webpack_require__(6)
	  , toPrimitive    = __webpack_require__(38)
	  , has            = __webpack_require__(11)
	  , IE8_DOM_DEFINE = __webpack_require__(53)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(10) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).f
	  , has = __webpack_require__(11)
	  , TAG = __webpack_require__(16)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(36)('keys')
	  , uid    = __webpack_require__(23);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(5)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(19);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(5)
	  , core           = __webpack_require__(3)
	  , LIBRARY        = __webpack_require__(31)
	  , wksExt         = __webpack_require__(40)
	  , defineProperty = __webpack_require__(12).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(16);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 效果处理
	var Effect = function () {
	    function Effect() {
	        (0, _classCallCheck3.default)(this, Effect);
	    }

	    (0, _createClass3.default)(Effect, [{
	        key: 'fadeOut',
	        value: function fadeOut(el, cb) {
	            var self = this;
	            el.style.opacity = 1;

	            window.requestAnimFrame = function () {
	                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
	                    window.setTimeout(callback, 1000 / 60);
	                };
	            }();

	            (function fade() {
	                if ((el.style.opacity -= .1) < 0) {
	                    el.style.display = 'none';
	                    cb && cb.call(self, el);
	                } else {
	                    if (requestAnimFrame) requestAnimFrame(fade);
	                }
	            })();
	        }
	    }]);
	    return Effect;
	}();

	var effect = new Effect();

	var _default = effect;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(Effect, 'Effect', 'E:/mypro/tyxb/src/effect.js');

	    __REACT_HOT_LOADER__.register(effect, 'effect', 'E:/mypro/tyxb/src/effect.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/effect.js');
	}();

	;

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	module.exports = React;

/***/ }),
/* 45 */
/***/ (function(module, exports) {

	module.exports = ReactDOM;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.presidentPop = exports.tagNewPop = exports.registrationPop = exports.textNewPop = exports.popup = undefined;

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(49);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _keyboard = __webpack_require__(60);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _req = __webpack_require__(13);

	var _req2 = _interopRequireDefault(_req);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * @fileOverview 弹出窗口
	 * @version 0.1
	 * @author minggangqiu
	 */
	var settings = __webpack_require__(27);
	var utils = __webpack_require__(9);
	var v = __webpack_require__(65);
	var picpop = __webpack_require__(107);
	var wintpl = __webpack_require__(110);
	var registration = __webpack_require__(108);
	var tagnewtpl = __webpack_require__(109);

	var Popup = function () {
	    function Popup(opts) {
	        (0, _classCallCheck3.default)(this, Popup);

	        this.opts = opts;
	        this.init();
	    }

	    (0, _createClass3.default)(Popup, [{
	        key: 'init',
	        value: function init() {
	            var opts = this.opts || {};

	            this.visible = false;
	            this.width = opts.width || 400, this.height = typeof opts.height == 'number' ? opts.height : typeof opts.height == "string" ? 0 : 320;

	            this.defaultOpts = {
	                id: '',
	                width: this.width,
	                height: this.height,
	                arrow: true,
	                direction: 'top',
	                modal: false,
	                onClose: null,
	                html: ''
	            };

	            this.div = document.createElement('div');
	            this.div.className = "dialog none";

	            this.settings = {};
	            this.setOpts(opts);
	        }
	    }, {
	        key: 'setOpts',
	        value: function setOpts(opts) {
	            for (var o in this.defaultOpts) {
	                this.settings[o] = typeof opts[o] !== 'undefined' ? opts[o] : this.defaultOpts[o];
	            }
	        }
	    }, {
	        key: 'updateSettings',
	        value: function updateSettings(opts) {
	            for (var o in opts) {
	                if (typeof this.settings[o] !== 'undefined') {
	                    this.settings[o] = opts[o];
	                }
	            }
	        }
	    }, {
	        key: 'create',
	        value: function create() {
	            for (var o in this.settings) {
	                switch (o.toLowerCase()) {
	                    case 'width':
	                    case 'height':
	                    case 'arrow':
	                        if (typeof this.settings[o] != "boolean") this.settings[o] = this.defaultOpts[o];

	                        if (this.settings[o]) {
	                            var arrowCls = ['arrow-border', 'arrow'];
	                            for (var i = 0; i < arrowCls.length; ++i) {
	                                var div = document.createElement('div');
	                                div.className = arrowCls[i];
	                                this.div.appendChild(div);
	                                div = null;
	                            }
	                        }
	                        break;
	                    case 'id':
	                        var id = this.settings[o];
	                        if (id) {
	                            this.div.id = this.settings[o];
	                        }
	                        break;
	                    case 'direction':
	                        var cls = this.settings[o];
	                        this.div.className += ' ' + cls;
	                        break;
	                    case 'modal':
	                        this.modal = document.createElement('div');
	                        break;
	                    case 'html':
	                        this.div.innerHTML = this.settings[o];
	                        break;
	                    default:
	                        this[o] = this.settings[o];
	                        break;
	                }
	            }
	        }
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	            var self = this;
	            self.colsefn = self.close.bind(this);

	            // 键盘操作关闭窗口
	            _keyboard2.default.addHandle('escape_keydown', self.colsefn);
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            utils.addClass(document.body, 'un-scroll');
	            var win_width = window.innerWidth;
	            var win_height = window.innerHeight;

	            //this.defaultOpts.left = (win_width - this.width) * 0.5;
	            //this.defaultOpts.top  = (win_height - this.height) * 0.5;
	            this.create();
	            this.bindEvents();
	            document.body.appendChild(this.div);
	            document.body.appendChild(this.modal);

	            this.div.className = this.div.className.replace(' none', '');

	            this.modal.className = "modal fade-out";
	            var oheight = this.modal.offsetHeight;
	            this.modal.className = "modal fade-in";

	            this.visible = true;
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            utils.removeClass(document.body, 'un-scroll');
	            if (document.body.contains(this.div)) {
	                document.body.removeChild(this.div);
	                document.body.removeChild(this.modal);
	                // this.modal = this.div = null;
	                this.visible = false;
	                _keyboard2.default.removeHandle('escape_keydown', this.colsefn);
	                self.onClose && self.onClose.call(self);
	            }
	        }
	    }]);
	    return Popup;
	}();

	;

	var Win = function (_Popup) {
	    (0, _inherits3.default)(Win, _Popup);

	    function Win(opts) {
	        (0, _classCallCheck3.default)(this, Win);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (Win.__proto__ || (0, _getPrototypeOf2.default)(Win)).call(this, opts));

	        _this.settings.content = '';
	        _this.settings.title = '标题';
	        _this.updateSettings({
	            width: 'auto',
	            height: 'auto',
	            html: wintpl(),
	            onClose: function onClose() {}
	        });
	        return _this;
	    }

	    (0, _createClass3.default)(Win, [{
	        key: 'create',
	        value: function create() {
	            (0, _get3.default)(Win.prototype.__proto__ || (0, _getPrototypeOf2.default)(Win.prototype), 'create', this).call(this);
	            this.ti = this.div.querySelector('.title');
	            this.bd = this.div.querySelector('.bd');
	            this.hd = this.div.querySelector('.hd');
	            this.ti.innerHTML = this.settings.title;
	            this.bd.innerHTML = this.settings.content;
	        }
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	            (0, _get3.default)(Win.prototype.__proto__ || (0, _getPrototypeOf2.default)(Win.prototype), 'bindEvents', this).call(this);
	            var closeBtn = this.hd.querySelector('.close');

	            closeBtn && closeBtn.addEventListener('click', this.close.bind(this), false);
	        }
	    }]);
	    return Win;
	}(Popup);

	// 登录注册弹窗


	var RegPop = function (_Win) {
	    (0, _inherits3.default)(RegPop, _Win);

	    function RegPop(opts) {
	        (0, _classCallCheck3.default)(this, RegPop);

	        if (!opts.cur) return (0, _possibleConstructorReturn3.default)(_this2);

	        var title = settings.REGISTRATION.WORDING;

	        var _this2 = (0, _possibleConstructorReturn3.default)(this, (RegPop.__proto__ || (0, _getPrototypeOf2.default)(RegPop)).call(this, opts));

	        _this2.updateSettings({
	            title: title,
	            id: 'registration',
	            content: registration({ data: { current: opts.cur } })
	        });
	        return _this2;
	    }

	    (0, _createClass3.default)(RegPop, [{
	        key: 'loginFinish',
	        value: function loginFinish(data) {
	            var self = this;
	            switch (data.result) {
	                case 0:
	                    data.redirect && window.location.replace(data.redirect);
	                    break;
	                case 1:
	                    alert(data.info);
	                    break;
	                case 3:
	                    var infoBox = self.form.querySelector('[rel=info]');
	                    infoBox && (infoBox.innerHTML = data.info);
	                    infoBox && (infoBox.style.display = "block");
	                    break;
	                default:
	                    break;
	            };
	        }
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	            (0, _get3.default)(RegPop.prototype.__proto__ || (0, _getPrototypeOf2.default)(RegPop.prototype), 'bindEvents', this).call(this);
	            var self = this;

	            this.tabNav = this.bd.querySelector('.tab-nav');
	            this.tabCon = this.bd.querySelector('.tab-content');
	            this.tabUl = this.tabNav.querySelector('ul');

	            this.tabNav && this.tabNav.addEventListener('click', this.tabChange.bind(this), false);

	            this.signupForm = this.bd.querySelector('#signup-form');
	            this.signinForm = this.bd.querySelector('#signinForm');

	            this.vSignup();
	            this.vSignin();
	        }
	    }, {
	        key: 'vSignup',
	        value: function vSignup() {
	            var self = this;
	            v.validate({
	                form: this.signupForm,
	                onCheckInput: function onCheckInput() {
	                    _req2.default.post('/signup', {
	                        tag: this.formData.tag,
	                        username: this.formData.username,
	                        email: this.formData.email,
	                        password: this.formData.password
	                    }, self.loginFinish.bind(this));
	                },
	                needP: true
	            });
	        }
	    }, {
	        key: 'vSignin',
	        value: function vSignin() {
	            var self = this;
	            v.validate({
	                form: this.signinForm,
	                fields: [{ name: 'username', require: true, label: '名字' }, { name: 'password', require: true, label: '密码' }],
	                onCheckInput: function onCheckInput() {
	                    _req2.default.post('/signin', {
	                        username: this.formData.username,
	                        password: this.formData.password
	                    }, self.loginFinish.bind(this));
	                },
	                needP: true
	            });
	        }
	    }, {
	        key: 'tabChange',
	        value: function tabChange(ev) {
	            var ctab = ev.target;

	            if (ctab.nodeName.toLowerCase() === 'a') {
	                if (this.tabUl.hasChildNodes()) {
	                    var children = this.tabUl.childNodes;

	                    var tabs = [];
	                    for (var i = 0; i < children.length; i++) {
	                        var node = children[i];

	                        if (node.nodeType === 1) {
	                            var tab = node.querySelector('a');
	                            tab.className = tab.className.replace(' cur', '');
	                            tabs.push(tab);
	                        }
	                    }

	                    var index = tabs.indexOf(ctab);
	                    ctab.className += ' cur';
	                }

	                if (this.tabCon.hasChildNodes()) {
	                    var children = this.tabCon.childNodes;

	                    var cons = [];
	                    for (var i = 0; i < children.length; i++) {
	                        var node = children[i];

	                        if (node.nodeType === 1) {
	                            node.style.display = 'none';
	                            cons.push(node);
	                        }
	                    }
	                    cons[index].style.display = "";
	                }
	            }
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var state = History.getState(),
	                action = state.data.action;

	            if (action && (action === "signin" || action === "signup")) {
	                History.back();
	            } else {
	                (0, _get3.default)(RegPop.prototype.__proto__ || (0, _getPrototypeOf2.default)(RegPop.prototype), 'close', this).call(this);
	            }
	        }
	    }]);
	    return RegPop;
	}(Win);

	var TagNewPop = function (_Win2) {
	    (0, _inherits3.default)(TagNewPop, _Win2);

	    function TagNewPop(opts) {
	        (0, _classCallCheck3.default)(this, TagNewPop);

	        var _this3 = (0, _possibleConstructorReturn3.default)(this, (TagNewPop.__proto__ || (0, _getPrototypeOf2.default)(TagNewPop)).call(this, opts));

	        _this3.updateSettings({
	            title: '创建版面',
	            content: tagnewtpl(opts.data)
	        });
	        return _this3;
	    }

	    (0, _createClass3.default)(TagNewPop, [{
	        key: 'bindEvents',
	        value: function bindEvents() {
	            (0, _get3.default)(TagNewPop.prototype.__proto__ || (0, _getPrototypeOf2.default)(TagNewPop.prototype), 'bindEvents', this).call(this);

	            this.form = this.bd.querySelector('form');

	            this.submitBtn = this.form.querySelector('button');

	            this.submitBtn && this.submitBtn.addEventListener('click', this.validate.bind(this), false);

	            utils.placeholder(this.form);
	        }
	    }, {
	        key: 'checkInput',
	        value: function checkInput() {
	            var self = this;
	            _req2.default.post('/tag/check', {
	                key: this.formData.key,
	                description: this.formData.description
	            }, function (data) {
	                if (data.result === 0) {
	                    self.form.submit();
	                } else {
	                    var infoBox = self.form.querySelector('[rel="err-info"]');
	                    infoBox && (infoBox.innerHTML = data.info);
	                    infoBox && utils.addClass(infoBox, 'alert-warning');
	                    infoBox && (infoBox.style.display = "block");
	                }
	            });
	        }
	    }, {
	        key: 'validate',
	        value: function validate(ev) {
	            var formData = {},
	                validate = true;
	            this.form.querySelectorAll('input').forEach(function (inp) {
	                var val = inp.value,
	                    field = utils.closest(inp, '.field'),
	                    label = utils.getData(inp, 'label') || '',
	                    require = utils.getData(inp, 'require'),
	                    tips = field && field.nextElementSibling;

	                if (!tips) {
	                    validate = false;
	                    return;
	                }

	                // 判断是否为空
	                if (require) {
	                    if (val.trim().length === 0) {
	                        tips.innerHTML = label + "未填写";
	                        tips.style.display = 'block';
	                        validate = false;
	                        return;
	                    } else {
	                        tips.innerHTML = '';
	                        tips.style.display = 'none';
	                    }
	                }

	                var isValid = true;
	                var errorText = "";
	                // 判断是否有效
	                switch (inp.name) {
	                    case 'key':
	                        if (!utils.isTag(val)) {
	                            errorText = label + "必须是1~24个小写字母、数字、下划线组成";
	                            validate = false;
	                            isValid = false;
	                        }
	                        break;
	                    default:
	                        break;
	                }
	                if (!isValid) {
	                    tips.style.display = 'block';
	                    tips.innerHTML = errorText;
	                    validate = false;
	                    return;
	                } else {
	                    tips.innerHTML = '';
	                    tips.style.display = 'none';
	                }
	                formData[inp.name] = val;
	            });

	            if (validate) {
	                this.formData = formData;
	                this.checkInput();
	            }
	        }
	    }]);
	    return TagNewPop;
	}(Win);

	var PresidentPop = function (_Win3) {
	    (0, _inherits3.default)(PresidentPop, _Win3);

	    function PresidentPop(opts) {
	        (0, _classCallCheck3.default)(this, PresidentPop);

	        var _this4 = (0, _possibleConstructorReturn3.default)(this, (PresidentPop.__proto__ || (0, _getPrototypeOf2.default)(PresidentPop)).call(this, opts));

	        _this4.updateSettings({
	            title: '选版主',
	            content: '<div class="building">' + settings.BUILDING_WORD + '</div>'
	        });
	        return _this4;
	    }

	    return PresidentPop;
	}(Win);

	function popup(opts) {
	    return new Popup(opts);
	}

	function textNewPop(opts) {
	    return new TextNewPop(opts);
	}

	function registrationPop(opts) {
	    return new RegPop(opts);
	}

	function tagNewPop(opts) {
	    return new TagNewPop(opts);
	}

	function presidentPop(opts) {
	    return new PresidentPop(opts);
	}

	exports.popup = popup;
	exports.textNewPop = textNewPop;
	exports.registrationPop = registrationPop;
	exports.tagNewPop = tagNewPop;
	exports.presidentPop = presidentPop;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(Popup, 'Popup', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(Win, 'Win', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(RegPop, 'RegPop', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(TagNewPop, 'TagNewPop', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(PresidentPop, 'PresidentPop', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(popup, 'popup', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(textNewPop, 'textNewPop', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(registrationPop, 'registrationPop', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(tagNewPop, 'tagNewPop', 'E:/mypro/tyxb/src/popup.js');

	    __REACT_HOT_LOADER__.register(presidentPop, 'presidentPop', 'E:/mypro/tyxb/src/popup.js');
	}();

	;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 公共使用小工具
	var Tools = function () {
	    function Tools() {
	        (0, _classCallCheck3.default)(this, Tools);
	    }

	    (0, _createClass3.default)(Tools, [{
	        key: "isFunction",
	        value: function isFunction(fn) {
	            return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + "");
	        }

	        // 简易模板

	    }, {
	        key: "template",
	        value: function template(tpl, data) {
	            return tpl.replace(/\{\{\s*([\w\.]+)\s*\}\}/g, function () {
	                var keys = arguments[1].split('.');
	                var newData = data;
	                for (var k = 0, l = keys.length; k < l; ++k) {
	                    newData = newData[keys[k]];
	                }return newData;
	            });
	        }
	    }]);
	    return Tools;
	}();

	var tools = new Tools();

	var _default = tools;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(Tools, "Tools", "E:/mypro/tyxb/src/tools.js");

	    __REACT_HOT_LOADER__.register(tools, "tools", "E:/mypro/tyxb/src/tools.js");

	    __REACT_HOT_LOADER__.register(_default, "default", "E:/mypro/tyxb/src/tools.js");
	}();

	;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _getOwnPropertyDescriptor = __webpack_require__(67);

	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(78);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(19)
	  , document = __webpack_require__(5).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(10) && !__webpack_require__(17)(function(){
	  return Object.defineProperty(__webpack_require__(52)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(31)
	  , $export        = __webpack_require__(14)
	  , redefine       = __webpack_require__(59)
	  , hide           = __webpack_require__(15)
	  , has            = __webpack_require__(11)
	  , Iterators      = __webpack_require__(30)
	  , $iterCreate    = __webpack_require__(84)
	  , setToStringTag = __webpack_require__(34)
	  , getPrototypeOf = __webpack_require__(56)
	  , ITERATOR       = __webpack_require__(16)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(57)
	  , hiddenKeys = __webpack_require__(29).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(11)
	  , toObject    = __webpack_require__(43)
	  , IE_PROTO    = __webpack_require__(35)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(11)
	  , toIObject    = __webpack_require__(6)
	  , arrayIndexOf = __webpack_require__(80)(false)
	  , IE_PROTO     = __webpack_require__(35)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(14)
	  , core    = __webpack_require__(3)
	  , fails   = __webpack_require__(17);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _tools = __webpack_require__(47);

	var _tools2 = _interopRequireDefault(_tools);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Keyboard = function () {
	    function Keyboard() {
	        (0, _classCallCheck3.default)(this, Keyboard);

	        this.keyList = {
	            code_17: 'ctrl',
	            code_27: 'escape',
	            code_32: 'space',
	            code_37: 'left',
	            code_38: 'up',
	            code_39: 'right',
	            code_40: 'down'
	        };

	        this.events = {};
	        this.firstKey = {};
	        this.init();
	    }

	    (0, _createClass3.default)(Keyboard, [{
	        key: 'init',
	        value: function init() {
	            var self = this;
	            var handle = function handle(ev) {
	                var key_code = ev.keyCode;
	                var key_type = ev.type;

	                var key_name = self.getKeyName(key_code, key_type);
	                if (!key_name) return;

	                // 存储组合键首键
	                switch (key_name) {
	                    case 'ctrl':
	                        if (key_type == 'keydown') self.firstKey[key_name] = true;else if (key_type == 'keyup') self.firstKey[key_name] = false;
	                        break;
	                    default:
	                        break;
	                }

	                var evt = self.getKeyEvent(key_name, key_type);
	                if (!evt) return;

	                // console.log('key event...')

	                // 触发键盘事件处理器
	                for (var evi = 0; evi < evt.length; ++evi) {
	                    var ev = evt[evi];
	                    // console.log(ev);
	                    ev.callback.call(self, ev);
	                }
	            };

	            // 注册键盘事件
	            document.addEventListener("keydown", handle, true);
	            document.addEventListener("keyup", handle, true);
	        }
	    }, {
	        key: 'getKeyName',
	        value: function getKeyName(key_code, key_type) {
	            var key_name = '';

	            // 获得按键名
	            if (key_code >= 65 && key_code <= 90) {
	                // 字母键
	                var diff = 32;
	                key_name = String.fromCharCode(key_code + diff);
	            } else if (key_code >= 48 && key_code <= 57) {
	                key_name = key_code - 48 + '';
	            } else {
	                var code_num = 'code_' + key_code;
	                key_name = this.keyList[code_num];
	            }

	            return key_name;
	        }
	    }, {
	        key: 'getKeyEvent',
	        value: function getKeyEvent(key_name, key_type) {
	            // 查找并触发单键
	            var handle_type = key_name + '_' + key_type;
	            var events = this.events;

	            // 查找并触发组合键
	            var firstKey = this.firstKey;
	            if (key_type == 'keydown') {
	                for (var k in firstKey) {
	                    if (firstKey[k] && k != key_name) {
	                        handle_type = k + '_' + key_name;
	                    }
	                }
	            }

	            var evt = events[handle_type];

	            return evt;
	        }
	    }, {
	        key: 'addHandle',
	        value: function addHandle(evt, callback) {
	            var name = evt;

	            // 存储事件处理器
	            if (evt.indexOf('+') != -1) name = evt.replace(/\s/g, '').replace('+', '_');
	            var nevt = {
	                name: name,
	                callback: callback
	            };
	            if (!(name in this.events)) this.events[name] = [];
	            this.events[name].push(nevt);
	        }
	    }, {
	        key: 'removeHandle',
	        value: function removeHandle(evt, callback) {

	            var name = evt;

	            // 存储事件处理器
	            if (evt.indexOf('+') != -1) name = evt.replace(/\s/g, '').replace('+', '_');

	            if (!(name in this.events)) return;

	            if (callback == undefined) {
	                delete this.events[name];
	                return;
	            }

	            if (_tools2.default.isFunction(callback)) {
	                var i = this.events[name].length;
	                while (i > 0) {
	                    if (this.events[name][--i].callback == callback) {
	                        this.events[name].splice(i, 1);
	                        return;
	                    }
	                }
	            }
	        }
	    }]);
	    return Keyboard;
	}(); /*
	      * @fileOverview 键盘操作
	      * @version 0.1
	      * @author minggangqiu
	      */


	var keyboard = new Keyboard();

	var _default = keyboard;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(Keyboard, 'Keyboard', 'E:/mypro/tyxb/src/keyboard.js');

	    __REACT_HOT_LOADER__.register(keyboard, 'keyboard', 'E:/mypro/tyxb/src/keyboard.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/keyboard.js');
	}();

	;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(50);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _defineProperty = __webpack_require__(48);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function (arr) {
	    arr.forEach(function (item) {
	        item.replaceWith = item.replaceWith || function () {
	            var argArr = Array.prototype.slice.call(arguments);
	            var docFrag = document.createDocumentFragment();

	            argArr.forEach(function (argItem) {
	                var isNode = Boolean((typeof argItem === 'undefined' ? 'undefined' : (0, _typeof3.default)(argItem)) === 'object' && argItem !== null && argItem.nodeType > 0);
	                docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
	            });

	            this.parentNode.replaceChild(docFrag, this);
	        };
	    });
	})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

	(function (arr) {
	    arr.forEach(function (item) {
	        item.forEach = item.forEach || Array.prototype.forEach;
	    });
	})([NodeList.prototype, HTMLCollection.prototype]);

	// Safari support.
	if (!String.prototype.startsWith) {
	    (function () {
	        'use strict'; // needed to support `apply`/`call` with `undefined`/`null`

	        var defineProperty = function () {
	            // IE 8 only supports `Object.defineProperty` on DOM elements
	            try {
	                var object = {};
	                var $defineProperty = _defineProperty2.default;
	                var result = $defineProperty(object, object, object) && $defineProperty;
	            } catch (error) {}
	            return result;
	        }();
	        var toString = {}.toString;
	        var startsWith = function startsWith(search) {
	            if (this == null) {
	                throw TypeError();
	            }
	            var string = String(this);
	            if (search && toString.call(search) == '[object RegExp]') {
	                throw TypeError();
	            }
	            var stringLength = string.length;
	            var searchString = String(search);
	            var searchLength = searchString.length;
	            var position = arguments.length > 1 ? arguments[1] : undefined;
	            // `ToInteger`
	            var pos = position ? Number(position) : 0;
	            if (pos != pos) {
	                // better `isNaN`
	                pos = 0;
	            }
	            var start = Math.min(Math.max(pos, 0), stringLength);
	            // Avoid the `indexOf` call if no match is possible
	            if (searchLength + start > stringLength) {
	                return false;
	            }
	            var index = -1;
	            while (++index < searchLength) {
	                if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        if (defineProperty) {
	            defineProperty(String.prototype, 'startsWith', {
	                'value': startsWith,
	                'configurable': true,
	                'writable': true
	            });
	        } else {
	            String.prototype.startsWith = startsWith;
	        }
	    })();
	}
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.shareDrop = exports.create = undefined;

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(49);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * @fileOverview 下拉
	 * @version 0.1
	 * @author minggangqiu
	 */
	var utils = __webpack_require__(9);
	var Share = __webpack_require__(64);
	var dropdown = __webpack_require__(106);

	var DropDown = function () {
	    function DropDown(opts) {
	        (0, _classCallCheck3.default)(this, DropDown);

	        this.opts = opts;
	        this.init();
	    }

	    (0, _createClass3.default)(DropDown, [{
	        key: 'init',
	        value: function init() {
	            var opts = this.opts || {};

	            this.visible = false;
	            this.defaultOpts = {
	                el: null,
	                container: null,
	                selector: null,
	                menu: null,
	                width: this.width,
	                modal: false,
	                onClose: null,
	                initHide: false,
	                data: []
	            };

	            this.settings = {};
	            this.setOpts(opts);
	        }
	    }, {
	        key: 'setOpts',
	        value: function setOpts(opts) {
	            for (var o in this.defaultOpts) {
	                this.settings[o] = typeof opts[o] !== 'undefined' ? opts[o] : this.defaultOpts[o];
	            }
	            this.bindEvents();
	        }
	    }, {
	        key: 'create',
	        value: function create() {
	            var self = this;
	            var conf = this.settings;
	            var menuCls = conf.menu || '.dropdown-menu';

	            var dm = this.dropdown.querySelector(menuCls);
	            if (dm) {
	                this.dropdownMenu = dm;
	            } else {
	                this.dropdownMenu = document.createElement('ul');
	                this.dropdown.appendChild(this.dropdownMenu);
	                this.dropdownMenu.className = menuCls;
	            }
	            if (DropDown.dms.indexOf(dm) === -1) {
	                DropDown.dms.push(dm);
	            }

	            for (var o in conf) {
	                switch (o.toLowerCase()) {
	                    case 'data':
	                        if (conf[o].length > 0) {
	                            this.dropdownMenu.innerHTML = dropdown(conf[o]);
	                        }
	                        break;
	                    case 'modal':
	                        if (typeof conf[o] != "boolean") conf[o] = this.defaultOpts[o];

	                        if (conf[o]) {
	                            var body = document.body,
	                                modal = body.querySelector('.dropdown-modal');
	                            if (modal) {
	                                this.modal = modal;
	                            } else {
	                                this.modal = document.createElement('div');
	                                body.appendChild(this.modal);
	                                this.modal.className = "dropdown-modal fade-out";
	                                var oheight = this.modal.offsetHeight;
	                                this.modal.className = "dropdown-modal fade-in";
	                            }
	                            this.modal && this.modal.addEventListener('mousedown', function () {
	                                self.hide();
	                            });
	                        }
	                        break;
	                    case 'width':
	                        var value = conf[o];
	                        if (typeof value == "number") value += 'px';

	                        this.dropdownMenu.style[o] = value;
	                        break;
	                    default:
	                        this[o] = conf[o];
	                        break;
	                }
	            }
	        }
	    }, {
	        key: 'reload',
	        value: function reload() {
	            this.dropdownMenu.innerHTML = dropdown(this.settings.data);
	        }
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	            var self = this,
	                conf = this.settings;

	            if (!conf.container || !conf.el) return;

	            this.con = document.querySelector(conf.container);

	            var stopp = function stopp(ev) {
	                ev.stopPropagation();
	            };

	            if (!this.con) return;

	            var dropdownCls = conf.selector || '.dropdown';

	            this.con.addEventListener('click', function (ev) {
	                var cur = ev.target,
	                    matchesSelector = cur.matches || cur.webkitMatchesSelector || cur.mozMatchesSelector || cur.msMatchesSelector;

	                while (cur && cur !== cur.currentTarget) {
	                    if (matchesSelector.call(cur, self.settings.el)) {
	                        if (cur !== DropDown.toggleBtn) {
	                            self.dropdown && self.dropdown.removeEventListener('mousedown', stopp);
	                            self.dropdown = utils.closest(cur, dropdownCls);
	                            self.dropdown.addEventListener('mousedown', stopp);
	                            DropDown.toggleBtn = cur;
	                            self.create();
	                            self.hideAll();
	                            self.show();
	                        } else {
	                            self.toggle();
	                        }
	                        break;
	                    }
	                    cur = cur.parentElement;
	                }
	            });

	            document.body.addEventListener("mousedown", function () {
	                self.hideAll();
	            });
	        }
	    }, {
	        key: 'toggle',
	        value: function toggle() {
	            if (!this.visible) {
	                utils.addClass(this.dropdownMenu, 'show');
	                utils.removeClass(this.dropdownMenu, 'hide');

	                if (this.modal) {
	                    utils.removeClass(this.modal, 'fade-out');
	                    utils.addClass(this.modal, 'fade-in');
	                }

	                this.visible = true;
	            } else {
	                utils.removeClass(this.dropdownMenu, 'show');
	                utils.addClass(this.dropdownMenu, 'hide');

	                if (this.modal) {
	                    utils.removeClass(this.modal, 'fade-in');
	                    utils.addClass(this.modal, 'fade-out');
	                }

	                this.visible = false;
	            }
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            if (!this.visible) {
	                utils.addClass(this.dropdownMenu, 'show');
	                utils.removeClass(this.dropdownMenu, 'hide');

	                if (this.modal) {
	                    utils.removeClass(this.modal, 'fade-out');
	                    utils.addClass(this.modal, 'fade-in');
	                }

	                this.visible = true;
	            }
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            if (this.visible) {
	                utils.removeClass(this.dropdownMenu, 'show');
	                utils.addClass(this.dropdownMenu, 'hide');

	                if (this.modal) {
	                    utils.removeClass(this.modal, 'fade-in');
	                    utils.addClass(this.modal, 'fade-out');
	                }

	                this.visible = false;
	            }
	        }
	    }, {
	        key: 'hideAll',
	        value: function hideAll() {
	            DropDown.dms.forEach(function (dm) {
	                utils.addClass(dm, 'hide');
	            });
	            if (this.visible) {
	                this.visible = false;
	            }
	        }
	    }]);
	    return DropDown;
	}();

	DropDown.toggleBtn = null;
	DropDown.dms = [];
	;

	var ShareDropDown = function (_DropDown) {
	    (0, _inherits3.default)(ShareDropDown, _DropDown);

	    function ShareDropDown(opts) {
	        (0, _classCallCheck3.default)(this, ShareDropDown);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (ShareDropDown.__proto__ || (0, _getPrototypeOf2.default)(ShareDropDown)).call(this, opts));

	        _this.share = new Share({
	            "tit": "",
	            "pic": "",
	            "url": "",
	            "intro": ""
	        });

	        _this.handle = _this.shareHandle.bind(_this);
	        return _this;
	    }

	    (0, _createClass3.default)(ShareDropDown, [{
	        key: 'create',
	        value: function create() {
	            var self = this;

	            this.dropdownMenu && this.dropdownMenu.removeEventListener('click', self.handle);

	            (0, _get3.default)(ShareDropDown.prototype.__proto__ || (0, _getPrototypeOf2.default)(ShareDropDown.prototype), 'create', this).call(this);

	            this.dropdownMenu && this.dropdownMenu.addEventListener('click', self.handle);
	        }
	    }, {
	        key: 'shareHandle',
	        value: function shareHandle(ev) {
	            var self = this;
	            var cur = ev.target;

	            while (cur.getAttribute && ['wb_share', 'qzone_share', 'weixin_share'].indexOf(cur.getAttribute('rel')) === -1 && cur.parentNode && cur.parentNode !== ev.currentTarget) {
	                cur = cur.parentNode;
	            }

	            if (cur.getAttribute && cur.getAttribute('rel')) {
	                var rel = cur.getAttribute('rel'),
	                    pbox = cur;
	                while (pbox.className.indexOf('post-box') === -1) {
	                    pbox = pbox.parentNode;
	                }

	                if (pbox !== cur && pbox.className.indexOf('post-box') !== -1) {
	                    var pcon = pbox.querySelector('.post-content');
	                    self.share.update({
	                        "tit": pcon && pcon.textContent || "",
	                        "url": pcon && pcon.querySelector('a') && pcon.querySelector('a').href || ""
	                    });

	                    if (rel === 'wb_share') {
	                        self.share.shareToSina();
	                    } else if (rel === 'qzone_share') {
	                        self.share.postToQzone();
	                    } else if (rel === 'weixin_share') {
	                        console.log(3);
	                    };
	                }
	            }
	        }
	    }]);
	    return ShareDropDown;
	}(DropDown);

	function create(opts) {
	    return new DropDown(opts);
	}

	function shareDrop(opts) {
	    return new ShareDropDown(opts);
	}

	exports.create = create;
	exports.shareDrop = shareDrop;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(DropDown, 'DropDown', 'E:/mypro/tyxb/src/dropdown.js');

	    __REACT_HOT_LOADER__.register(ShareDropDown, 'ShareDropDown', 'E:/mypro/tyxb/src/dropdown.js');

	    __REACT_HOT_LOADER__.register(create, 'create', 'E:/mypro/tyxb/src/dropdown.js');

	    __REACT_HOT_LOADER__.register(shareDrop, 'shareDrop', 'E:/mypro/tyxb/src/dropdown.js');
	}();

	;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/**
	 * Created by wpzheng on 2015/3/2.
	 */
	// 分享
	function shareaside(o) {
	    //参数说明：self.tit说明文字，self.pic小图片，self.url分享要链接到的地址
	    var self = this;
	    self.tit = o.tit;
	    self.pic = o.pic;
	    self.titsummary = o.intro;
	    self.url = o.url;
	}
	shareaside.prototype = {
	    update: function update(opts) {
	        var self = this;
	        for (var o in opts) {
	            self[o] = opts[o];
	        }
	    },
	    //参数说明：title标题，summary摘要，pic小图片，url分享要链接到的地址
	    postToQzone: function postToQzone() {
	        var _url = encodeURIComponent(this.url); //当前页的链接地址使用document.location
	        var _t = encodeURI(this.tit); //当前页面title，使用document.title
	        var _pic = encodeURI(this.pic); //（例如：var _pic='图片url1|图片url2|图片url3....）
	        var _summary = encodeURIComponent('');
	        var x = window.screen.width;
	        var y = window.screen.height;
	        var _u = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + _url + '&title=' + _t + '&pics=' + _pic + '&summary=' + _summary;
	        window.open(_u, '\u5206\u4EAB\u5230QQ\u7A7A\u95F4\u548C\u670B\u53CB\u7F51', "height=480,width=608,top= " + (y - 480) / 2 + ", left = " + (x - 608) / 2 + ",toolbar=no,menubar=no,resizable=yes,location=yes,status=no");
	    },
	    shareToSina: function shareToSina() {
	        var url = "http://v.t.sina.com.cn/share/share.php",
	            _url = this.url,
	            _title = this.tit,
	            _appkey = '',
	            _ralateUid = '',
	            c = '',
	            pic = this.pic;
	        var x = window.screen.width;
	        var y = window.screen.height;
	        c = url + "?url=" + encodeURIComponent(_url) + "&appkey=" + _appkey + "&title=" + _title + "&pic=" + pic + "&ralateUid=" + _ralateUid + "&language=";
	        window.open(c, "shareQQ", "height=480,width=608,top= " + (y - 480) / 2 + ", left = " + (x - 608) / 2 + ",toolbar=no,menubar=no,resizable=yes,location=yes,status=no");
	    }
	};

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return shareaside;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(shareaside, 'shareaside', 'E:/mypro/tyxb/src/share.js');
	}();

	;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.validate = undefined;

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var req = __webpack_require__(13).default;
	var settings = __webpack_require__(27);
	var utils = __webpack_require__(9);

	var Validate = function () {
	    function Validate(opts) {
	        (0, _classCallCheck3.default)(this, Validate);

	        this.opts = opts;
	        this.defValidates = {
	            'tag': {
	                'fun': function fun(val) {
	                    return utils.isTag(val);
	                },
	                'err': '\u5C0F\u62A5\u540D' + settings.TAG_VALIDATION
	            },

	            'username': {
	                'fun': function fun(val) {
	                    return utils.isUserName(val);
	                },
	                'err': '\u7B14\u540D' + settings.USERNAME_VALIDATION
	            },

	            'email': {
	                'fun': function fun(val) {
	                    return utils.isValidEmail(val);
	                },
	                'err': "邮箱的格式书写错误"
	            },

	            'password': {
	                'fun': function fun(val) {
	                    return utils.isPassword(val);
	                },
	                'err': '\u5BC6\u7801' + settings.PASSWORD_VALIDATION
	            }
	        };
	        this.init();
	    }

	    (0, _createClass3.default)(Validate, [{
	        key: 'init',
	        value: function init() {
	            var opts = this.opts || {};
	            this.defaultOpts = {
	                form: '#signup-form',
	                fields: [{ name: 'username', require: true, label: '名字' }, { name: 'email', require: true, label: '邮箱' }, { name: 'password', require: true, label: '密码' }],
	                onCheckInput: null,
	                needP: false
	            };

	            this.settings = {};
	            this.setOpts(opts);
	            this.create();
	        }
	    }, {
	        key: 'setOpts',
	        value: function setOpts(opts) {
	            for (var o in this.defaultOpts) {
	                this.settings[o] = typeof opts[o] !== 'undefined' ? opts[o] : this.defaultOpts[o];
	            }
	        }
	    }, {
	        key: 'updateSettings',
	        value: function updateSettings(opts) {
	            for (var o in opts) {
	                if (typeof this.settings[o] !== 'undefined') {
	                    this.settings[o] = opts[o];
	                }
	            }
	        }
	    }, {
	        key: 'create',
	        value: function create() {
	            var conf = this.settings;

	            for (var o in conf) {
	                switch (o.toLowerCase()) {
	                    case 'form':
	                        if (conf[o].nodeType && conf[o].nodeType === 1) this[o] = conf[o];else if (typeof conf[o] == 'string') this.form = document.querySelector(conf[o]);else throw new Error('Form element pass Error.');
	                        break;
	                    default:
	                        this[o] = conf[o];
	                        break;
	                }
	            }

	            if (!this.form) throw new Error('There is no form element.');
	            this.bindEvents();
	        }
	    }, {
	        key: 'validate',
	        value: function validate() {
	            var self = this,
	                formData = {},
	                validate = true;
	            this.form && this.form.querySelectorAll('input').forEach(function (inp) {
	                var val = inp.value,
	                    field = utils.closest(inp, '.field'),
	                    tips = field && field.nextElementSibling;

	                if (!tips) {
	                    validate = false;
	                    return;
	                }

	                // 判断是否有效
	                self.fields && self.fields.forEach(function (field) {
	                    var name = field.name,
	                        label = field.label;
	                    if (name === inp.name) {
	                        val = val.trim();

	                        // 判断是否为空
	                        if (field.require) {
	                            if (val.length === 0) {
	                                tips.innerHTML = field.empty_msg || label + "木有填写";
	                                tips.style.display = 'block';
	                                validate = false;
	                                return;
	                            } else {
	                                tips.innerHTML = '';
	                                tips.style.display = 'none';
	                            }
	                        }

	                        var isValid = true,
	                            errorText = "";
	                        if (field.fun) {
	                            if (!field.fun(val)) {
	                                validate = false;
	                                isValid = false;
	                                errorText = field.err || '';
	                            }
	                        } else {
	                            var defv = self.defValidates[name];
	                            if (defv) {
	                                if (!defv.fun(val)) {
	                                    validate = false;
	                                    isValid = false;
	                                    errorText = defv.err || '';
	                                }
	                            }
	                        }
	                        if (!isValid) {
	                            tips.style.display = 'block';
	                            tips.innerHTML = errorText;
	                            validate = false;
	                            return;
	                        } else {
	                            tips.innerHTML = '';
	                            tips.style.display = 'none';
	                        }
	                    }
	                });

	                formData[inp.name] = val;
	            });

	            if (validate) {
	                this.formData = formData;
	                this.onCheckInput && this.onCheckInput();
	            }
	        }
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	            this.submitBtn = this.form.querySelector('button');

	            this.submitBtn && this.submitBtn.addEventListener('click', this.validate.bind(this), false);

	            if (this.needP) utils.placeholder(this.form);
	        }
	    }]);
	    return Validate;
	}();

	;

	function validate(opts) {
	    return new Validate(opts);
	}

	exports.validate = validate;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(req, 'req', 'E:/mypro/tyxb/src/validate.js');

	    __REACT_HOT_LOADER__.register(Validate, 'Validate', 'E:/mypro/tyxb/src/validate.js');

	    __REACT_HOT_LOADER__.register(validate, 'validate', 'E:/mypro/tyxb/src/validate.js');
	}();

	;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(71), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(73), __esModule: true };

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(95);
	var $Object = __webpack_require__(3).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(96);
	var $Object = __webpack_require__(3).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(97);
	var $Object = __webpack_require__(3).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(98);
	module.exports = __webpack_require__(3).Object.getPrototypeOf;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(99);
	module.exports = __webpack_require__(3).Object.setPrototypeOf;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(102);
	__webpack_require__(100);
	__webpack_require__(103);
	__webpack_require__(104);
	module.exports = __webpack_require__(3).Symbol;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(101);
	__webpack_require__(105);
	module.exports = __webpack_require__(40).f('iterator');

/***/ }),
/* 78 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 79 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(6)
	  , toLength  = __webpack_require__(93)
	  , toIndex   = __webpack_require__(92);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(20)
	  , gOPS    = __webpack_require__(42)
	  , pIE     = __webpack_require__(25);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5).document && document.documentElement;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(50);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(32)
	  , descriptor     = __webpack_require__(22)
	  , setToStringTag = __webpack_require__(34)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(16)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 85 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(20)
	  , toIObject = __webpack_require__(6);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(23)('meta')
	  , isObject = __webpack_require__(19)
	  , has      = __webpack_require__(11)
	  , setDesc  = __webpack_require__(12).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(17)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(12)
	  , anObject = __webpack_require__(18)
	  , getKeys  = __webpack_require__(20);

	module.exports = __webpack_require__(10) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(6)
	  , gOPN      = __webpack_require__(55).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(19)
	  , anObject = __webpack_require__(18);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(51)(Function.call, __webpack_require__(33).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(37)
	  , defined   = __webpack_require__(28);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(37)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(37)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(79)
	  , step             = __webpack_require__(85)
	  , Iterators        = __webpack_require__(30)
	  , toIObject        = __webpack_require__(6);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(54)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(14)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(32)});

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(14);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(10), 'Object', {defineProperty: __webpack_require__(12).f});

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(6)
	  , $getOwnPropertyDescriptor = __webpack_require__(33).f;

	__webpack_require__(58)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(43)
	  , $getPrototypeOf = __webpack_require__(56);

	__webpack_require__(58)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(14);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(90).set});

/***/ }),
/* 100 */
/***/ (function(module, exports) {

	

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(91)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(54)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(5)
	  , has            = __webpack_require__(11)
	  , DESCRIPTORS    = __webpack_require__(10)
	  , $export        = __webpack_require__(14)
	  , redefine       = __webpack_require__(59)
	  , META           = __webpack_require__(87).KEY
	  , $fails         = __webpack_require__(17)
	  , shared         = __webpack_require__(36)
	  , setToStringTag = __webpack_require__(34)
	  , uid            = __webpack_require__(23)
	  , wks            = __webpack_require__(16)
	  , wksExt         = __webpack_require__(40)
	  , wksDefine      = __webpack_require__(39)
	  , keyOf          = __webpack_require__(86)
	  , enumKeys       = __webpack_require__(81)
	  , isArray        = __webpack_require__(83)
	  , anObject       = __webpack_require__(18)
	  , toIObject      = __webpack_require__(6)
	  , toPrimitive    = __webpack_require__(38)
	  , createDesc     = __webpack_require__(22)
	  , _create        = __webpack_require__(32)
	  , gOPNExt        = __webpack_require__(89)
	  , $GOPD          = __webpack_require__(33)
	  , $DP            = __webpack_require__(12)
	  , $keys          = __webpack_require__(20)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(55).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(25).f  = $propertyIsEnumerable;
	  __webpack_require__(42).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(31)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(39)('asyncIterator');

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(39)('observable');

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	var global        = __webpack_require__(5)
	  , hide          = __webpack_require__(15)
	  , Iterators     = __webpack_require__(30)
	  , TO_STRING_TAG = __webpack_require__(16)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 106 */
/***/ (function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __j = Array.prototype.join;
	function print() { __p += __j.call(arguments, '') }
	with (obj) {

	 list.forEach(function(item) { ;
	__p += '\r\n<li><a href="' +
	((__t = ( item.url )) == null ? '' : __t) +
	'">' +
	((__t = ( item.key )) == null ? '' : __t) +
	'</a></li>\r\n';
	 }) ;
	__p += '\r\n';

	}
	return __p
	}

/***/ }),
/* 107 */
/***/ (function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="dream-area">\r\n    <form id="deamcreat-form" action="/dream/new" method="post">\r\n        <div class="title-head">\r\n            <p class="title-prompt">你可以畅所欲言，但不要长篇大论</p>\r\n            此刻的想法（必填）\r\n            <a href="javascript:;" title="表情" alt="表情" class="desc-face">(∩＿∩)</a>\r\n        </div>\r\n        <div>\r\n            <p class="field"><textarea id="dream-title" name="content" placeholder="想法..."></textarea></p>\r\n            <p class="validate-error"></p>\r\n        </div>\r\n        <div class="desc-head">\r\n            图片\r\n        </div>\r\n        <div><p class="field"><input id="image-upload" type="file" name="upload_file"></p></div>\r\n        <div><img id="image-preview" src="" /></div>\r\n        <div><p class="field"><input id="dream-tag" type="tag" name="tag" placeholder="选择版面"></p></div>\r\n        <input type="hidden" name="did" value="" />\r\n        <div><button id="finish_cdream_btn" type="submit" class="btn">分享 > </button></div>\r\n    </form>\r\n</div>\r\n\r\n';

	}
	return __p
	}

/***/ }),
/* 108 */
/***/ (function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="tab-nav">\r\n    <ul>\r\n        <li><a href="javascript:;" class="tab ' +
	((__t = ( data.current === 'signup'? 'cur':'' )) == null ? '' : __t) +
	'">+ 注册</a></li>\r\n        <li><a href="javascript:;" class="tab ' +
	((__t = ( data.current === 'signin'? 'cur':'' )) == null ? '' : __t) +
	'">登录 →</a></li>\r\n    </ul>\r\n</div>\r\n<div class="tab-content">\r\n    <div class="signup-area" style="display: ' +
	((__t = ( data.current === "signup"? '':'none' )) == null ? '' : __t) +
	'">\r\n        <form id="signup-form" action="/signup" method="post" novalidate>\r\n            <div rel="info" class="alert alert-danger" style="display: none;">\r\n            </div>\r\n            <div class="form-group">\r\n                <p class="field"><input type="text" data-label="名字" name="username" id="username" placeholder="名字" required></p>\r\n                <p class="validate-error"></p>\r\n            </div>\r\n            <div class="form-group">\r\n                <p class="field"><input type="email" data-label="邮箱" name="email" id="emial" placeholder="邮箱" required></p>\r\n                <p class="validate-error"></p>\r\n            </div class="form-group">\r\n            <div class="form-group">\r\n                <p class="field"><input type="password" data-label="密码" name="password" id="password" placeholder="密码" autocomplete="off" required></p>\r\n                <p class="validate-error"></p>\r\n            </div>\r\n            <div>\r\n                <button id="signup-btn" type="button" class="btn btn-primary">确定</button>&nbsp;\r\n            </div>\r\n        </form>\r\n        <div class="signup-loading" style="display: none;">\r\n            <p>请稍等...</p>\r\n        </div>\r\n    </div>\r\n    <div class="signin-area" style="display: ' +
	((__t = ( data.current === "signin"? '':'none' )) == null ? '' : __t) +
	'">\r\n        <form id="signinForm" action="/signin" method="post" autocomplete="off">\r\n            <div rel="info" class="alert alert-danger" style="display: none;"></div>\r\n            <div class="form-group">\r\n                <p class="field"><input type="text" data-label="名字" id="username" name="username" placeholder="名字" required></p>\r\n                <p class="validate-error"></p>\r\n            </div>\r\n            <div class="form-group">\r\n                <p class="field"><input type="password" data-label="密码" id="password" name="password" placeholder="密码" required autocomplete="off"></p>\r\n                <p class="validate-error"></p>\r\n            </div>\r\n            <div class="other-ctrl form-group">\r\n                <a class="forget-pwd" href="/forgot">忘记密码 ?</a>\r\n            </div>\r\n            <div class="btn-group">\r\n                <button class="btn btn-primary" type="button">登录</button>\r\n            </div>\r\n        </form>\r\n        <div class="signin-loading" style="display: none;">\r\n            <p>登录中...请稍等</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n';

	}
	return __p
	}

/***/ }),
/* 109 */
/***/ (function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="form-area">\r\n    <form action="/tag/new" method="post">\r\n        <div rel="err-info" class="alert" style="display: none;">\r\n        </div>\r\n        <div class="title-head">\r\n            <span class="require">*&nbsp;</span>学派名称\r\n        </div>\r\n        <div class="form-group">\r\n            <p class="field"><input type="text" value="' +
	((__t = ( tagName )) == null ? '' : __t) +
	'" data-label="学派名称" data-require="true" name="key" maxlength="24" placeholder="名称..." autocomplete="off" /></p>\r\n            <p class="validate-error"></p>\r\n        </div>\r\n        <div class="desc-head">\r\n            学派描述\r\n        </div>\r\n        <div class="form-group">\r\n            <p class="field"><textarea name="description" placeholder="描述..."></textarea></p>\r\n        </div>\r\n        <div><button rel="sumbit-btn" type="button" class="btn">创建 > </button></div>\r\n    </form>\r\n</div>\r\n';

	}
	return __p
	}

/***/ }),
/* 110 */
/***/ (function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="hd">\r\n    <span class="title">标题...</span>\r\n    <a href="javascript:;" class="close"><i class="s s-close s-2x"></i></a>\r\n</div>\r\n<div class="bd">\r\n    正文...\r\n</div>\r\n';

	}
	return __p
	}

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BaseCom = function (_React$Component) {
	    (0, _inherits3.default)(BaseCom, _React$Component);

	    function BaseCom(props) {
	        (0, _classCallCheck3.default)(this, BaseCom);
	        return (0, _possibleConstructorReturn3.default)(this, (BaseCom.__proto__ || (0, _getPrototypeOf2.default)(BaseCom)).call(this, props));
	    }

	    (0, _createClass3.default)(BaseCom, [{
	        key: 'delegate',
	        value: function delegate(el, selectors, handles) {
	            var _this2 = this;

	            el.addEventListener('click', function (ev) {
	                var el = ev.target,
	                    matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

	                while (el && el !== ev.currentTarget) {
	                    for (var i = 0, l = selectors.length; i < l; i++) {
	                        var selector = selectors[i],
	                            handle = handles[i];

	                        if (matchesSelector.call(el, selector)) {
	                            return handle.call(_this2, ev, el);
	                        }
	                    }
	                    el = el.parentElement;
	                }
	            });
	        }
	    }]);
	    return BaseCom;
	}(React.Component);

	;

	var _default = BaseCom;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(BaseCom, 'BaseCom', 'E:/mypro/tyxb/src/basecom.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/basecom.js');
	}();

	;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(26);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(44);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _keyboard = __webpack_require__(60);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _basecom = __webpack_require__(111);

	var _basecom2 = _interopRequireDefault(_basecom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Dialog = function (_BaseCom) {
	    (0, _inherits3.default)(Dialog, _BaseCom);

	    function Dialog(props) {
	        (0, _classCallCheck3.default)(this, Dialog);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (Dialog.__proto__ || (0, _getPrototypeOf2.default)(Dialog)).call(this, props));

	        var sence = props.sence;


	        if (!sence) {
	            throw new Error("没有指定窗口内容组件...");
	        }

	        _this.colsefn = null;
	        _this.state = {
	            visible: 'none',
	            destroy: false,
	            props: sence.props || {}
	        };
	        return _this;
	    }

	    (0, _createClass3.default)(Dialog, [{
	        key: 'create',
	        value: function create() {
	            this.setState({
	                destroy: false
	            });
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            this.setState({
	                visible: 'block'
	            });

	            var canScroll = this.props.canScroll;

	            if (!canScroll) {
	                var body = document.body;
	                body.className += 'un-scroll';
	            }

	            this.colsefn = this.close.bind(this);

	            var needKey = this.props.needKey;

	            needKey && _keyboard2.default.addHandle('escape_keydown', this.colsefn);

	            var props = this.state.props;

	            this._sence && this._sence.show && this._sence.show(props);
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var state = History.getState(),
	                action = state.data.action,
	                routerName = this.props.routerName;

	            if (action && action === routerName) {
	                History.back();
	            } else {
	                this.hide();
	            }
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.setState({
	                visible: 'none'
	            });

	            var body = document.body;
	            body.className = body.className.replace('un-scroll', '');

	            var needKey = this.props.needKey;

	            needKey && _keyboard2.default.removeHandle('escape_keydown', this.colsefn);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.setState({
	                destroy: true
	            });
	        }
	    }, {
	        key: 'setComProps',
	        value: function setComProps(props) {
	            this.setState({
	                props: props
	            });
	        }
	    }, {
	        key: 'mouseClose',
	        value: function mouseClose() {
	            var needMouse = this.props.needMouse;

	            needMouse && this.close();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var _props = this.props,
	                sence = _props.sence,
	                pid = _props.pid,
	                needWin = _props.needWin;

	            var Component = sence.component;
	            var _state = this.state,
	                props = _state.props,
	                destroy = _state.destroy,
	                visible = _state.visible;


	            if (!destroy) {
	                if (needWin) {
	                    return _react2.default.createElement(
	                        'div',
	                        { className: 'dialog-box', style: { display: visible } },
	                        _react2.default.createElement(
	                            'div',
	                            { id: pid, ref: 'dialog', className: 'dialog' },
	                            _react2.default.createElement(Component, (0, _extends3.default)({ ref: function ref(_ref) {
	                                    _this2._sence = _ref;
	                                } }, props, { dialog: this }))
	                        ),
	                        _react2.default.createElement('div', { onMouseDown: this.mouseClose.bind(this), className: 'modal fade-in' })
	                    );
	                } else {
	                    return _react2.default.createElement(
	                        'div',
	                        { className: 'dialog-box', style: { display: visible } },
	                        _react2.default.createElement(Component, (0, _extends3.default)({}, props, { dialog: this })),
	                        _react2.default.createElement('div', { onMouseDown: this.mouseClose.bind(this), className: 'modal fade-in' })
	                    );
	                }
	            } else {
	                return null;
	            }
	        }
	    }]);
	    return Dialog;
	}(_basecom2.default);

	var _default = Dialog;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(Dialog, 'Dialog', 'E:/mypro/tyxb/src/Dialog.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/Dialog.js');
	}();

	;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(44);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _req = __webpack_require__(13);

	var _req2 = _interopRequireDefault(_req);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ImageViewer = function (_React$Component) {
	    (0, _inherits3.default)(ImageViewer, _React$Component);

	    function ImageViewer(props) {
	        (0, _classCallCheck3.default)(this, ImageViewer);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (ImageViewer.__proto__ || (0, _getPrototypeOf2.default)(ImageViewer)).call(this, props));

	        _this.state = {
	            loading: true,
	            imageSrc: ''
	        };
	        return _this;
	    }

	    (0, _createClass3.default)(ImageViewer, [{
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(nextProps) {
	            if (nextProps.imageSrc && nextProps.imageSrc !== this.state.imageSrc) {
	                this.loadImage(nextProps.imageSrc);
	            }
	        }
	    }, {
	        key: 'loadImage',
	        value: function loadImage(src) {
	            var _this2 = this;

	            var img = new Image();
	            this.setState({
	                loading: true
	            });
	            img.src = src;
	            if (img.complete) {
	                this.setState({
	                    loading: false,
	                    imageSrc: src
	                });
	                return;
	            }
	            img.onload = function () {
	                _this2.setState({
	                    loading: false,
	                    imageSrc: src
	                });
	            };
	            img.onerror = function () {
	                _this2.close();
	                alert("网络异常，图片加载失败");
	            };
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var dialog = this.props.dialog;

	            dialog.close();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _state = this.state,
	                loading = _state.loading,
	                imageSrc = _state.imageSrc;


	            if (!loading) {
	                return _react2.default.createElement(
	                    'div',
	                    { onClick: this.close.bind(this), className: 'center' },
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'image-viewer-box' },
	                        _react2.default.createElement('img', { src: imageSrc })
	                    )
	                );
	            } else {
	                return _react2.default.createElement(
	                    'div',
	                    { id: 'loading' },
	                    _react2.default.createElement(
	                        'div',
	                        { id: 'loading-center' },
	                        _react2.default.createElement(
	                            'div',
	                            { id: 'loading-center-absolute' },
	                            _react2.default.createElement('div', { className: 'object', id: 'object_zero' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_one' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_two' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_three' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_four' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_five' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_six' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_seven' }),
	                            _react2.default.createElement('div', { className: 'object', id: 'object_eight' })
	                        )
	                    )
	                );
	            }
	        }
	    }]);
	    return ImageViewer;
	}(_react2.default.Component);

	var _default = ImageViewer;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(ImageViewer, 'ImageViewer', 'E:/mypro/tyxb/src/ImageViewer.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/ImageViewer.js');
	}();

	;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends2 = __webpack_require__(26);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _propTypes = __webpack_require__(130);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _react = __webpack_require__(44);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isTouchDevice = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && ('ontouchstart' in window || navigator.msMaxTouchPoints > 0));

	var draggableEvents = {
	  touch: {
	    react: {
	      down: 'onTouchStart',
	      mouseDown: 'onMouseDown',
	      drag: 'onTouchMove',
	      drop: 'onTouchEnd',
	      move: 'onTouchMove',
	      mouseMove: 'onMouseMove',
	      up: 'onTouchEnd',
	      mouseUp: 'onMouseUp'
	    },
	    native: {
	      down: 'touchstart',
	      mouseDown: 'mousedown',
	      drag: 'touchmove',
	      drop: 'touchend',
	      move: 'touchmove',
	      mouseMove: 'mousemove',
	      up: 'touchend',
	      mouseUp: 'mouseup'
	    }
	  },
	  desktop: {
	    react: {
	      down: 'onMouseDown',
	      drag: 'onDragOver',
	      drop: 'onDrop',
	      move: 'onMouseMove',
	      up: 'onMouseUp'
	    },
	    native: {
	      down: 'mousedown',
	      drag: 'dragStart',
	      drop: 'drop',
	      move: 'mousemove',
	      up: 'mouseup'
	    }
	  }
	};
	var deviceEvents = isTouchDevice ? draggableEvents.touch : draggableEvents.desktop;

	// Draws a rounded rectangle on a 2D context.
	var drawRoundedRect = function drawRoundedRect(context, x, y, width, height, borderRadius) {
	  if (borderRadius === 0) {
	    context.rect(x, y, width, height);
	  } else {
	    var widthMinusRad = width - borderRadius;
	    var heightMinusRad = height - borderRadius;
	    context.translate(x, y);
	    context.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5);
	    context.lineTo(widthMinusRad, 0);
	    context.arc(widthMinusRad, borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);
	    context.lineTo(width, heightMinusRad);
	    context.arc(widthMinusRad, heightMinusRad, borderRadius, Math.PI * 2, Math.PI * 0.5);
	    context.lineTo(borderRadius, height);
	    context.arc(borderRadius, heightMinusRad, borderRadius, Math.PI * 0.5, Math.PI);
	    context.translate(-x, -y);
	  }
	};

	var AvatarCroper = function (_React$Component) {
	  (0, _inherits3.default)(AvatarCroper, _React$Component);

	  function AvatarCroper(props) {
	    (0, _classCallCheck3.default)(this, AvatarCroper);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (AvatarCroper.__proto__ || (0, _getPrototypeOf2.default)(AvatarCroper)).call(this, props));

	    _this.state = {
	      drag: false,
	      my: null,
	      mx: null,
	      image: {
	        x: 0.5,
	        y: 0.5
	      }
	    };


	    _this.setCanvas = _this.setCanvas.bind(_this);
	    _this.handleMouseMove = _this.handleMouseMove.bind(_this);
	    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
	    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
	    _this.handleDragOver = _this.handleDragOver.bind(_this);
	    _this.handleDrop = _this.handleDrop.bind(_this);
	    return _this;
	  }

	  (0, _createClass3.default)(AvatarCroper, [{
	    key: 'isVertical',
	    value: function isVertical() {
	      return this.props.rotate % 180 !== 0;
	    }
	  }, {
	    key: 'getDimensions',
	    value: function getDimensions() {
	      var _props = this.props,
	          width = _props.width,
	          height = _props.height,
	          rotate = _props.rotate,
	          border = _props.border;


	      var canvas = {};

	      var canvasWidth = width + border * 2;
	      var canvasHeight = height + border * 2;

	      if (this.isVertical()) {
	        canvas.width = canvasHeight;
	        canvas.height = canvasWidth;
	      } else {
	        canvas.width = canvasWidth;
	        canvas.height = canvasHeight;
	      }

	      return {
	        canvas: canvas,
	        rotate: rotate,
	        width: width,
	        height: height,
	        border: border
	      };
	    }
	  }, {
	    key: 'getImage',
	    value: function getImage() {
	      // get relative coordinates (0 to 1)
	      var cropRect = this.getCroppingRect();
	      var image = this.state.image;

	      // get actual pixel coordinates
	      cropRect.x *= image.resource.width;
	      cropRect.y *= image.resource.height;
	      cropRect.width *= image.resource.width;
	      cropRect.height *= image.resource.height;

	      // create a canvas with the correct dimensions
	      var canvas = document.createElement('canvas');

	      if (this.isVertical()) {
	        canvas.width = cropRect.height;
	        canvas.height = cropRect.width;
	      } else {
	        canvas.width = cropRect.width;
	        canvas.height = cropRect.height;
	      }

	      // draw the full-size image at the correct position,
	      // the image gets truncated to the size of the canvas.
	      var context = canvas.getContext('2d');

	      context.translate(canvas.width / 2, canvas.height / 2);
	      context.rotate(this.props.rotate * Math.PI / 180);
	      context.translate(-(canvas.width / 2), -(canvas.height / 2));

	      if (this.isVertical()) {
	        context.translate((canvas.width - canvas.height) / 2, (canvas.height - canvas.width) / 2);
	      }

	      context.drawImage(image.resource, -cropRect.x, -cropRect.y);

	      return canvas;
	    }

	    /**
	     * Get the image scaled to original canvas size.
	     * This was default in 4.x and is now kept as a legacy method.
	     */

	  }, {
	    key: 'getImageScaledToCanvas',
	    value: function getImageScaledToCanvas() {
	      var _getDimensions = this.getDimensions(),
	          width = _getDimensions.width,
	          height = _getDimensions.height;

	      var canvas = document.createElement('canvas');

	      if (this.isVertical()) {
	        canvas.width = height;
	        canvas.height = width;
	      } else {
	        canvas.width = width;
	        canvas.height = height;
	      }

	      // don't paint a border here, as it is the resulting image
	      this.paintImage(canvas.getContext('2d'), this.state.image, 0);

	      return canvas;
	    }
	  }, {
	    key: 'getXScale',
	    value: function getXScale() {
	      var canvasAspect = this.props.width / this.props.height;
	      var imageAspect = this.state.image.width / this.state.image.height;

	      return Math.min(1, canvasAspect / imageAspect);
	    }
	  }, {
	    key: 'getYScale',
	    value: function getYScale() {
	      var canvasAspect = this.props.height / this.props.width;
	      var imageAspect = this.state.image.height / this.state.image.width;

	      return Math.min(1, canvasAspect / imageAspect);
	    }
	  }, {
	    key: 'getCroppingRect',
	    value: function getCroppingRect() {
	      var position = this.props.position || { x: this.state.image.x, y: this.state.image.y };
	      var width = 1 / this.props.scale * this.getXScale();
	      var height = 1 / this.props.scale * this.getYScale();

	      var croppingRect = {
	        x: position.x - width / 2,
	        y: position.y - height / 2,
	        width: width,
	        height: height
	      };

	      var xMin = 0;
	      var xMax = 1 - croppingRect.width;
	      var yMin = 0;
	      var yMax = 1 - croppingRect.height;

	      // If the cropping rect is larger than the image, then we need to change
	      // our maxima & minima for x & y to allow the image to appear anywhere up
	      // to the very edge of the cropping rect.
	      var isLargerThanImage = width > 1 || height > 1;

	      if (isLargerThanImage) {
	        xMin = -croppingRect.width;
	        xMax = 1;
	        yMin = -croppingRect.height;
	        yMax = 1;
	      }

	      return (0, _extends3.default)({}, croppingRect, {
	        x: Math.max(xMin, Math.min(croppingRect.x, xMax)),
	        y: Math.max(yMin, Math.min(croppingRect.y, yMax))
	      });
	    }
	  }, {
	    key: 'isDataURL',
	    value: function isDataURL(str) {
	      if (str === null) {
	        return false;
	      }
	      var regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i;
	      return !!str.match(regex);
	    }
	  }, {
	    key: 'loadImage',
	    value: function loadImage(imageURL) {
	      var imageObj = new Image();
	      imageObj.onload = this.handleImageReady.bind(this, imageObj);
	      imageObj.onerror = this.props.onLoadFailure;
	      if (!this.isDataURL(imageURL) && this.props.crossOrigin) imageObj.crossOrigin = this.props.crossOrigin;
	      imageObj.src = imageURL;
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var context = _reactDom2.default.findDOMNode(this.canvas).getContext('2d');
	      if (this.props.image) {
	        this.loadImage(this.props.image);
	      }
	      this.paint(context);
	      if (document) {
	        var nativeEvents = deviceEvents.native;
	        document.addEventListener(nativeEvents.move, this.handleMouseMove, false);
	        document.addEventListener(nativeEvents.up, this.handleMouseUp, false);
	        if (isTouchDevice) {
	          document.addEventListener(nativeEvents.mouseMove, this.handleMouseMove, false);
	          document.addEventListener(nativeEvents.mouseUp, this.handleMouseUp, false);
	        }
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      if (document) {
	        var nativeEvents = deviceEvents.native;
	        document.removeEventListener(nativeEvents.move, this.handleMouseMove, false);
	        document.removeEventListener(nativeEvents.up, this.handleMouseUp, false);
	        if (isTouchDevice) {
	          document.removeEventListener(nativeEvents.mouseMove, this.handleMouseMove, false);
	          document.removeEventListener(nativeEvents.mouseUp, this.handleMouseUp, false);
	        }
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps, prevState) {
	      var context = _reactDom2.default.findDOMNode(this.canvas).getContext('2d');
	      context.clearRect(0, 0, this.getDimensions().canvas.width, this.getDimensions().canvas.height);
	      this.paint(context);
	      this.paintImage(context, this.state.image, this.props.border);

	      if (prevProps.image !== this.props.image || prevProps.width !== this.props.width || prevProps.height !== this.props.height || prevProps.position !== this.props.position || prevProps.scale !== this.props.scale || prevProps.rotate !== this.props.rotate || prevState.my !== this.state.my || prevState.mx !== this.state.mx || prevState.image.x !== this.state.image.x || prevState.image.y !== this.state.image.y) {
	        this.props.onImageChange();
	      }
	    }
	  }, {
	    key: 'handleImageReady',
	    value: function handleImageReady(image) {
	      var imageState = this.getInitialSize(image.width, image.height);
	      imageState.resource = image;
	      imageState.x = 0.5;
	      imageState.y = 0.5;
	      this.setState({ drag: false, image: imageState }, this.props.onImageReady);
	      this.props.onLoadSuccess(imageState);
	    }
	  }, {
	    key: 'getInitialSize',
	    value: function getInitialSize(width, height) {
	      var newHeight = void 0;
	      var newWidth = void 0;

	      var dimensions = this.getDimensions();
	      var canvasRatio = dimensions.height / dimensions.width;
	      var imageRatio = height / width;

	      if (canvasRatio > imageRatio) {
	        newHeight = this.getDimensions().height;
	        newWidth = width * (newHeight / height);
	      } else {
	        newWidth = this.getDimensions().width;
	        newHeight = height * (newWidth / width);
	      }

	      return {
	        height: newHeight,
	        width: newWidth
	      };
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(newProps) {
	      if (newProps.image && this.props.image !== newProps.image || this.props.width !== newProps.width || this.props.height !== newProps.height) {
	        this.loadImage(newProps.image);
	      }
	    }
	  }, {
	    key: 'paintImage',
	    value: function paintImage(context, image, border) {
	      if (image.resource) {
	        var position = this.calculatePosition(image, border);

	        context.save();

	        context.translate(context.canvas.width / 2, context.canvas.height / 2);
	        context.rotate(this.props.rotate * Math.PI / 180);
	        context.translate(-(context.canvas.width / 2), -(context.canvas.height / 2));

	        if (this.isVertical()) {
	          context.translate((context.canvas.width - context.canvas.height) / 2, (context.canvas.height - context.canvas.width) / 2);
	        }

	        context.globalCompositeOperation = 'destination-over';
	        context.drawImage(image.resource, position.x, position.y, position.width, position.height);

	        context.restore();
	      }
	    }
	  }, {
	    key: 'calculatePosition',
	    value: function calculatePosition(image, border) {
	      image = image || this.state.image;

	      var croppingRect = this.getCroppingRect();

	      var width = image.width * this.props.scale;
	      var height = image.height * this.props.scale;

	      var x = border - croppingRect.x * width;
	      var y = border - croppingRect.y * height;

	      return {
	        x: x,
	        y: y,
	        height: height,
	        width: width
	      };
	    }
	  }, {
	    key: 'paint',
	    value: function paint(context) {
	      context.save();
	      context.translate(0, 0);
	      context.fillStyle = 'rgba(' + this.props.color.slice(0, 4).join(',') + ')';

	      var borderRadius = this.props.borderRadius;
	      var dimensions = this.getDimensions();
	      var borderSize = dimensions.border;
	      var height = dimensions.canvas.height;
	      var width = dimensions.canvas.width;

	      // clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
	      borderRadius = Math.max(borderRadius, 0);
	      borderRadius = Math.min(borderRadius, width / 2 - borderSize, height / 2 - borderSize);

	      context.beginPath();
	      // inner rect, possibly rounded
	      drawRoundedRect(context, borderSize, borderSize, width - borderSize * 2, height - borderSize * 2, borderRadius);
	      context.rect(width, 0, -width, height); // outer rect, drawn "counterclockwise"
	      context.fill('evenodd');

	      context.restore();
	    }
	  }, {
	    key: 'handleMouseDown',
	    value: function handleMouseDown(e) {
	      e = e || window.event;
	      // if e is a touch event, preventDefault keeps
	      // corresponding mouse events from also being fired
	      // later.
	      e.preventDefault();
	      this.setState({
	        drag: true,
	        mx: null,
	        my: null
	      });
	    }
	  }, {
	    key: 'handleMouseUp',
	    value: function handleMouseUp() {
	      if (this.state.drag) {
	        this.setState({ drag: false });
	        this.props.onMouseUp();
	      }
	    }
	  }, {
	    key: 'handleMouseMove',
	    value: function handleMouseMove(e) {
	      e = e || window.event;
	      if (this.state.drag === false) {
	        return;
	      }

	      var mousePositionX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX;
	      var mousePositionY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY;

	      var newState = {
	        mx: mousePositionX,
	        my: mousePositionY
	      };

	      var rotate = this.props.rotate;

	      rotate %= 360;
	      rotate = rotate < 0 ? rotate + 360 : rotate;
	      rotate -= rotate % 90;

	      if (this.state.mx && this.state.my) {
	        var mx = this.state.mx - mousePositionX;
	        var my = this.state.my - mousePositionY;

	        var width = this.state.image.width * this.props.scale;
	        var height = this.state.image.height * this.props.scale;

	        var _getCroppingRect = this.getCroppingRect(),
	            lastX = _getCroppingRect.x,
	            lastY = _getCroppingRect.y;

	        lastX *= width;
	        lastY *= height;

	        // helpers to calculate vectors
	        var toRadians = function toRadians(degree) {
	          return degree * (Math.PI / 180);
	        };
	        var cos = Math.cos(toRadians(rotate));
	        var sin = Math.sin(toRadians(rotate));

	        var x = lastX + mx * cos + my * sin;
	        var y = lastY + -mx * sin + my * cos;

	        var relativeWidth = 1 / this.props.scale * this.getXScale();
	        var relativeHeight = 1 / this.props.scale * this.getYScale();

	        var position = {
	          x: x / width + relativeWidth / 2,
	          y: y / height + relativeHeight / 2
	        };

	        this.props.onPositionChange(position);

	        newState.image = (0, _extends3.default)({}, this.state.image, position);
	      }

	      this.setState(newState);

	      this.props.onMouseMove();
	    }
	  }, {
	    key: 'handleDragOver',
	    value: function handleDragOver(e) {
	      e = e || window.event;
	      e.preventDefault();
	    }
	  }, {
	    key: 'handleDrop',
	    value: function handleDrop(e) {
	      var _this2 = this;

	      e = e || window.event;
	      e.stopPropagation();
	      e.preventDefault();

	      if (e.dataTransfer && e.dataTransfer.files.length) {
	        this.props.onDropFile(e);
	        var reader = new FileReader();
	        var file = e.dataTransfer.files[0];
	        reader.onload = function (e) {
	          return _this2.loadImage(e.target.result);
	        };
	        reader.readAsDataURL(file);
	      }
	    }
	  }, {
	    key: 'setCanvas',
	    value: function setCanvas(canvas) {
	      this.canvas = canvas;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var defaultStyle = {
	        cursor: this.state.drag ? 'grabbing' : 'grab'
	      };

	      var attributes = {
	        width: this.getDimensions().canvas.width,
	        height: this.getDimensions().canvas.height,
	        style: (0, _extends3.default)({}, defaultStyle, this.props.style)
	      };

	      attributes[deviceEvents.react.down] = this.handleMouseDown;
	      attributes[deviceEvents.react.drag] = this.handleDragOver;
	      attributes[deviceEvents.react.drop] = this.handleDrop;
	      if (isTouchDevice) attributes[deviceEvents.react.mouseDown] = this.handleMouseDown;

	      return _react2.default.createElement('canvas', (0, _extends3.default)({ ref: this.setCanvas }, attributes));
	    }
	  }]);
	  return AvatarCroper;
	}(_react2.default.Component);

	AvatarCroper.propTypes = {
	  scale: _propTypes2.default.number,
	  rotate: _propTypes2.default.number,
	  image: _propTypes2.default.string,
	  border: _propTypes2.default.number,
	  borderRadius: _propTypes2.default.number,
	  width: _propTypes2.default.number,
	  height: _propTypes2.default.number,
	  position: _propTypes2.default.shape({
	    x: _propTypes2.default.number,
	    y: _propTypes2.default.number
	  }),
	  color: _propTypes2.default.arrayOf(_propTypes2.default.number),
	  style: _propTypes2.default.object,
	  crossOrigin: _propTypes2.default.oneOf(['', 'anonymous', 'use-credentials']),

	  onDropFile: _propTypes2.default.func,
	  onLoadFailure: _propTypes2.default.func,
	  onLoadSuccess: _propTypes2.default.func,
	  onImageReady: _propTypes2.default.func,
	  onImageChange: _propTypes2.default.func,
	  onMouseUp: _propTypes2.default.func,
	  onMouseMove: _propTypes2.default.func,
	  onPositionChange: _propTypes2.default.func
	};
	AvatarCroper.defaultProps = {
	  scale: 1,
	  rotate: 0,
	  border: 25,
	  borderRadius: 0,
	  width: 200,
	  height: 200,
	  color: [0, 0, 0, 0.5],
	  style: {},
	  onDropFile: function onDropFile() {},
	  onLoadFailure: function onLoadFailure() {},
	  onLoadSuccess: function onLoadSuccess() {},
	  onImageReady: function onImageReady() {},
	  onImageChange: function onImageChange() {},
	  onMouseUp: function onMouseUp() {},
	  onMouseMove: function onMouseMove() {},
	  onPositionChange: function onPositionChange() {}
	};
	var _default = AvatarCroper;
	exports.default = _default;
	;

	var _temp = function () {
	  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	    return;
	  }

	  __REACT_HOT_LOADER__.register(isTouchDevice, 'isTouchDevice', 'E:/mypro/tyxb/src/AvatarCroper.js');

	  __REACT_HOT_LOADER__.register(draggableEvents, 'draggableEvents', 'E:/mypro/tyxb/src/AvatarCroper.js');

	  __REACT_HOT_LOADER__.register(deviceEvents, 'deviceEvents', 'E:/mypro/tyxb/src/AvatarCroper.js');

	  __REACT_HOT_LOADER__.register(drawRoundedRect, 'drawRoundedRect', 'E:/mypro/tyxb/src/AvatarCroper.js');

	  __REACT_HOT_LOADER__.register(AvatarCroper, 'AvatarCroper', 'E:/mypro/tyxb/src/AvatarCroper.js');

	  __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/AvatarCroper.js');
	}();

	;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(26);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(44);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(45);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _req = __webpack_require__(13);

	var _req2 = _interopRequireDefault(_req);

	var _AvatarCroper = __webpack_require__(114);

	var _AvatarCroper2 = _interopRequireDefault(_AvatarCroper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var common = __webpack_require__(21);

	var MyEditor = function (_React$Component) {
	    (0, _inherits3.default)(MyEditor, _React$Component);

	    function MyEditor(props) {
	        (0, _classCallCheck3.default)(this, MyEditor);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (MyEditor.__proto__ || (0, _getPrototypeOf2.default)(MyEditor)).call(this, props));

	        _this.setEditorRef = function (editor) {
	            _this.editor = editor;
	        };

	        _this.state = {
	            loading: true,
	            imageId: '',
	            imageSrc: '',
	            scale: 3
	        };
	        return _this;
	    }

	    (0, _createClass3.default)(MyEditor, [{
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(nextProps) {
	            console.log(nextProps);
	            if (nextProps.imageSrc && nextProps.imageSrc !== this.state.imageSrc && nextProps.imageId && nextProps.imageId !== this.state.imageId) {
	                this.loadImage(nextProps.imageSrc, nextProps.imageId);
	            }
	        }
	    }, {
	        key: 'loadImage',
	        value: function loadImage(src, id) {
	            console.log(src, id);
	            this.setState({
	                imageSrc: src,
	                imageId: id
	            });
	        }
	    }, {
	        key: 'onClickSave',
	        value: function onClickSave() {
	            var _this2 = this;

	            var rect = this.editor.getCroppingRect(),
	                imageId = this.state.imageId;

	            _req2.default.post("/settings/avatar/update", (0, _extends3.default)({}, rect, {
	                image: imageId
	            }), function (data) {
	                common.xhrReponseManage(data, function (data) {
	                    try {
	                        if (data.result === 0 && data.data) {
	                            var avatar = data.data.avatar;


	                            if (!avatar) return;

	                            var updateAvatarBtn = document.querySelector('#updateAvatar');
	                            var img = null;
	                            if (updateAvatarBtn) {
	                                img = updateAvatarBtn.querySelector('img');
	                                img && img.setAttribute('src', avatar);
	                            }
	                            _this2.close();
	                        }
	                    } catch (err) {
	                        alert(err.message);
	                    }
	                });
	            }, function () {
	                alert('服务器错误');
	            });
	        }
	    }, {
	        key: 'rangeChange',
	        value: function rangeChange(ev) {
	            var value = ev.target.value;


	            this.setState({
	                scale: value
	            });
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var dialog = this.props.dialog;

	            dialog.close();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _state = this.state,
	                imageSrc = _state.imageSrc,
	                scale = _state.scale;


	            return _react2.default.createElement(
	                'div',
	                { className: 'dialog-inner' },
	                _react2.default.createElement(
	                    'div',
	                    { className: 'hd' },
	                    _react2.default.createElement(
	                        'a',
	                        { href: 'javascript:;', className: 'back', onClick: this.close.bind(this) },
	                        _react2.default.createElement('i', { className: 's s-back s-2x' }),
	                        _react2.default.createElement(
	                            'span',
	                            null,
	                            '\u8FD4\u56DE'
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'button',
	                        { className: 'btn', onClick: this.onClickSave.bind(this) },
	                        '\u4FDD\u5B58'
	                    )
	                ),
	                _react2.default.createElement(
	                    'div',
	                    { className: 'bd' },
	                    _react2.default.createElement(_AvatarCroper2.default, {
	                        ref: this.setEditorRef,
	                        image: imageSrc,
	                        width: 96,
	                        height: 96,
	                        border: 50,
	                        color: [255, 255, 255, 0.6] // RGBA
	                        , scale: scale,
	                        rotate: 0
	                    }),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'slider-wrapper' },
	                        _react2.default.createElement('input', { onChange: this.rangeChange.bind(this), value: scale, min: '0.1', max: '5', step: '0.1', type: 'range' })
	                    )
	                )
	            );
	        }
	    }]);
	    return MyEditor;
	}(_react2.default.Component);

	var _default = MyEditor;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(MyEditor, 'MyEditor', 'E:/mypro/tyxb/src/AvatarEditor.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/AvatarEditor.js');
	}();

	;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(26);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _req = __webpack_require__(13);

	var _req2 = _interopRequireDefault(_req);

	var _effect = __webpack_require__(41);

	var _effect2 = _interopRequireDefault(_effect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var common = __webpack_require__(21);
	var utils = __webpack_require__(9);

	var DreamItem = function (_React$Component) {
	    (0, _inherits3.default)(DreamItem, _React$Component);

	    function DreamItem(props) {
	        (0, _classCallCheck3.default)(this, DreamItem);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (DreamItem.__proto__ || (0, _getPrototypeOf2.default)(DreamItem)).call(this, props));

	        _this.state = {
	            dream: props.dream,
	            heartCls: 's s-arrow_up s-2x',
	            hasHeart: false,
	            hasDel: false
	        };
	        return _this;
	    }

	    (0, _createClass3.default)(DreamItem, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _this2 = this;

	            setTimeout(function () {
	                _this2._dreamEl.className = "list-item fadeout fadein";
	            }, 250);
	        }

	        /*componentWillReceiveProps(nextProps) {
	            if (nextProps.dream._id !== this.state.dream._id) {
	                this.setState({
	                    dream: nextProps.dream
	                });
	            }
	        }*/

	    }, {
	        key: 'heartIt',
	        value: function heartIt(ev) {
	            var _this3 = this;

	            var _state = this.state,
	                dream = _state.dream,
	                hasHeart = _state.hasHeart;


	            if (!hasHeart) {
	                _req2.default.post("/dream/goodit", {
	                    did: dream._id
	                }, function (data) {
	                    common.xhrReponseManage(data, function (data) {
	                        if (data.data) {
	                            var num = parseInt(data.data.num);
	                            dream.vote = isNaN(num) ? 0 : num;
	                            var cls = "s s-arrow_up s-2x s-ac";
	                            _this3.setState({
	                                dream: dream,
	                                hasHeart: true,
	                                heartCls: cls
	                            });
	                        }
	                    });
	                }, function () {
	                    alert("网络异常");
	                });
	            } else {
	                _req2.default.post("/dream/cgood", {
	                    did: dream._id
	                }, function (data) {
	                    common.xhrReponseManage(data, function (data) {
	                        if (data.data) {
	                            var num = parseInt(data.data.num);
	                            dream.vote = isNaN(num) ? 0 : num;
	                            var cls = "s s-arrow_up s-2x s-ac";
	                            _this3.setState({
	                                dream: dream,
	                                hasHeart: false,
	                                heartCls: "s s-arrow_up s-2x"
	                            });
	                        }
	                    });
	                }, function () {
	                    alert("网络异常");
	                });
	            }
	        }
	    }, {
	        key: 'deleteDream',
	        value: function deleteDream() {
	            var _this4 = this;

	            var dream = this.state.dream;

	            _req2.default.post("/dream/delete", {
	                did: dream._id
	            }, function (data) {
	                common.xhrReponseManage(data, function (data) {
	                    _this4.setState({
	                        hasDel: true
	                    });
	                });
	            }, function () {
	                alert("网络异常");
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this5 = this;

	            var _state2 = this.state,
	                dream = _state2.dream,
	                heartCls = _state2.heartCls,
	                hasDel = _state2.hasDel;

	            var href = "/user/" + (dream._belong_u && dream._belong_u._id || "unknow");
	            var username = dream._belong_u && dream._belong_u.username || "未知";

	            if (hasDel) {
	                return null;
	            }

	            //console.log(dream.text, heartCls, hasDel);

	            return React.createElement(
	                'li',
	                {
	                    ref: function ref(_ref) {
	                        return _this5._dreamEl = _ref;
	                    },
	                    className: 'list-item fadeout' },
	                React.createElement(
	                    'div',
	                    { className: 'post-box' },
	                    React.createElement(
	                        'div',
	                        { className: 'user-info-box' },
	                        React.createElement(
	                            'div',
	                            { className: 'userinfo' },
	                            React.createElement(
	                                'a',
	                                { className: 'username', href: href },
	                                username
	                            ),
	                            React.createElement(
	                                'span',
	                                { className: 'datetime' },
	                                common.dateBeautify(new Date(dream.date))
	                            ),
	                            React.createElement(
	                                'span',
	                                { className: 'things' },
	                                '\u5199\u4E86\u4E00\u7BC7\u201C\u6587\u5B57\u201D...'
	                            )
	                        ),
	                        React.createElement(
	                            'div',
	                            { className: 'userctrl' },
	                            this.removeText
	                        )
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'post-content' },
	                        React.createElement(
	                            'div',
	                            { className: 'text-viewer-box' },
	                            React.createElement(
	                                'h1',
	                                null,
	                                dream.content || ""
	                            ),
	                            React.createElement('div', { className: 'text-viewer-content',
	                                dangerouslySetInnerHTML: { __html: dream.text || "文字没有找到..." }
	                            })
	                        )
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'post-footer' },
	                        React.createElement(
	                            'div',
	                            { className: 'ctrl-box' },
	                            React.createElement(
	                                'a',
	                                { className: 'owed',
	                                    href: 'javascript:;',
	                                    title: '\u559C\u6B22',
	                                    onClick: this.heartIt.bind(this)
	                                },
	                                React.createElement(
	                                    'div',
	                                    { className: 'owed-inner' },
	                                    React.createElement('i', { className: heartCls }),
	                                    React.createElement(
	                                        'span',
	                                        { className: 'vote-num', rel: 'vote-num' },
	                                        '\u6709',
	                                        dream.vote || 0,
	                                        '\u4EBA\u559C\u6B22...'
	                                    )
	                                )
	                            )
	                        )
	                    )
	                )
	            );
	        }
	    }, {
	        key: 'removeText',
	        get: function get() {
	            var dream = this.state.dream;


	            if (dream.isowner) {
	                if (!dream.isremove) {
	                    return React.createElement(
	                        'a',
	                        { href: 'javascript:;',
	                            onClick: this.deleteDream.bind(this)
	                        },
	                        React.createElement('i', { className: 's s-remove s-lg' }),
	                        '\u5220\u9664'
	                    );
	                } else {
	                    return React.createElement(
	                        'span',
	                        null,
	                        '\u5DF2\u5220\u9664'
	                    );
	                }
	            } else {
	                return null;
	            }
	        }
	    }]);
	    return DreamItem;
	}(React.Component);

	var DreamList = function (_React$Component2) {
	    (0, _inherits3.default)(DreamList, _React$Component2);

	    function DreamList(props) {
	        (0, _classCallCheck3.default)(this, DreamList);

	        var _this6 = (0, _possibleConstructorReturn3.default)(this, (DreamList.__proto__ || (0, _getPrototypeOf2.default)(DreamList)).call(this, props));

	        _this6.state = {
	            list: []
	        };
	        return _this6;
	    }

	    /*shouldComponentUpdate(nextProps, nextState) {
	        return nextState.list.length !== this.state.list.length;
	    }*/

	    (0, _createClass3.default)(DreamList, [{
	        key: 'addItem',
	        value: function addItem(item) {
	            console.log('add item and set list ...' + this.state.list);
	            var list = this.state.list;
	            list.unshift(item);
	            this.setState({
	                list: list
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this7 = this;

	            var list = this.state.list;


	            console.log('render list ...');

	            return React.createElement(
	                'ul',
	                (0, _extends3.default)({}, this.props, { className: 'list-group' }),
	                list.map(function (dream, i) {
	                    var Item = _this7.item;
	                    return React.createElement(Item, { key: i, dream: dream });
	                })
	            );
	        }
	    }, {
	        key: 'item',
	        get: function get() {
	            return function (props) {
	                return React.createElement(DreamItem, { dream: props.dream });
	            };
	        }
	    }]);
	    return DreamList;
	}(React.Component);

	var _default = DreamList;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(DreamItem, 'DreamItem', 'E:/mypro/tyxb/src/DreamList.js');

	    __REACT_HOT_LOADER__.register(DreamList, 'DreamList', 'E:/mypro/tyxb/src/DreamList.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/DreamList.js');
	}();

	;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _Dialog = __webpack_require__(112);

	var _Dialog2 = _interopRequireDefault(_Dialog);

	var _PostEditor = __webpack_require__(118);

	var _PostEditor2 = _interopRequireDefault(_PostEditor);

	var _ImageViewer = __webpack_require__(113);

	var _ImageViewer2 = _interopRequireDefault(_ImageViewer);

	var _AvatarEditor = __webpack_require__(115);

	var _AvatarEditor2 = _interopRequireDefault(_AvatarEditor);

	var _TextViewer = __webpack_require__(120);

	var _TextViewer2 = _interopRequireDefault(_TextViewer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function (factory) {
	    module.exports = factory(__webpack_require__(9), __webpack_require__(21), __webpack_require__(46));
	})(function (utils, common, popup) {
	    var _d = document,
	        _w = window,
	        popups = ['avatareditor', 'imageview', 'signin', 'signup', 'posteditor', 'textview'],
	        postCon = _d.querySelector('#postEditorCon'),
	        viewerCon = _d.querySelector('#imageViewerCon'),
	        avatarCon = _d.querySelector('#avatarEditorCon'),
	        textViewerCon = _d.querySelector('#textViewerCon');

	    if (postCon) {
	        _w.postEditor = ReactDOM.render(React.createElement(_Dialog2.default, {
	            routerName: 'posteditor',
	            needWin: true,
	            canScroll: true,
	            needKey: true,
	            needMouse: true,
	            sence: {
	                name: "PostEditor",
	                component: _PostEditor2.default
	            } }), postCon);
	        _w.postEditor.create();
	    }

	    if (viewerCon) {
	        _w.imageViewer = ReactDOM.render(React.createElement(_Dialog2.default, {
	            needMouse: true,
	            routerName: 'imageview',
	            needKey: true,
	            needWin: false,
	            sence: {
	                name: "ImageViewer",
	                component: _ImageViewer2.default
	            } }), viewerCon);
	        _w.imageViewer.create();
	    }

	    if (avatarCon) {
	        _w.avatarEditor = ReactDOM.render(React.createElement(_Dialog2.default, {
	            routerName: 'avatareditor',
	            needWin: true,
	            sence: {
	                name: "AvatarEditor",
	                component: _AvatarEditor2.default
	            } }), avatarCon);
	        _w.avatarEditor.create();
	    }

	    if (textViewerCon) {
	        _w.textViewer = ReactDOM.render(React.createElement(_Dialog2.default, {
	            routerName: 'textview',
	            needWin: true,
	            needKey: true,
	            needMouse: true,
	            sence: {
	                name: "TextViewer",
	                component: _TextViewer2.default
	            } }), textViewerCon);
	        _w.textViewer.create();
	    }

	    function popupRouter(action, params) {
	        switch (action) {
	            case "avatareditor":
	                _w.avatarEditor && _w.avatarEditor.setComProps({
	                    imageSrc: params && params.src,
	                    imageId: params && params.id
	                });
	                _w.avatarEditor && _w.avatarEditor.show();
	                break;
	            case "imageview":
	                _w.imageViewer && _w.imageViewer.setComProps({
	                    imageSrc: params && params.src
	                });
	                _w.imageViewer && _w.imageViewer.show();
	                break;
	            case "signin":
	                _w.signinPop = popup.registrationPop({
	                    cur: 'signin'
	                });
	                _w.signinPop.show();
	                break;
	            case "signup":
	                _w.signupPop = popup.registrationPop({
	                    cur: 'signup'
	                });
	                _w.signupPop.show();
	                break;
	            case "posteditor":
	                if (params) {
	                    _w.postEditor && _w.postEditor.setComProps({
	                        pid: 'textReleasePop',
	                        type: params && params.type,
	                        tag: params && params.tag
	                    });
	                    _w.postEditor.show();
	                }
	                break;
	            case "textview":
	                _w.textViewer && _w.textViewer.setComProps({
	                    did: params && params.did,
	                    el: _w.curDreamItem
	                });
	                _w.textViewer && _w.textViewer.show();
	                break;
	        }
	    }

	    History.Adapter.bind(_w, 'statechange', function () {
	        var state = History.getState(),
	            _state$data = state.data,
	            action = _state$data.action,
	            params = _state$data.params;


	        if (action) {
	            popupRouter(action, params);
	        } else {
	            _w.textViewer && _w.textViewer.close();
	            _w.avatarEditor && _w.avatarEditor.close();
	            _w.imageViewer && _w.imageViewer.close();
	            _w.postEditor && _w.postEditor.close();
	            _w.signinPop && _w.signinPop.close(), _w.signinPop = null;
	            _w.signupPop && _w.signupPop.close(), _w.signupPop = null;
	        }

	        if (_w.nextState) {
	            var _action = _w.nextState.action;


	            switch (_action) {
	                case "signin":
	                    common.showSigninPop();
	                    break;
	            }

	            _w.nextState = null;
	        }
	    });

	    var params = utils.getUrlParams(),
	        paramsStr = '?' + _w.location.search.substr(1),
	        _popup = params.popup;

	    if (_popup && popups.indexOf(_popup) !== -1) {
	        var state = History.getState();
	        var action = state.data.action;


	        if (!action) {
	            History.pushState(null, '', '/');
	            History.pushState({
	                action: _popup,
	                params: params
	            }, _popup, paramsStr);
	        } else {
	            popupRouter(action, params);
	        }
	    }
	});
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(26);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _basecom = __webpack_require__(111);

	var _basecom2 = _interopRequireDefault(_basecom);

	var _req = __webpack_require__(13);

	var _req2 = _interopRequireDefault(_req);

	var _TextEditor = __webpack_require__(119);

	var _TextEditor2 = _interopRequireDefault(_TextEditor);

	var _DreamList = __webpack_require__(116);

	var _DreamList2 = _interopRequireDefault(_DreamList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var settings = __webpack_require__(27);
	var utils = __webpack_require__(9);
	var common = __webpack_require__(21);

	var ImageUpload = function (_React$Component) {
	    (0, _inherits3.default)(ImageUpload, _React$Component);

	    function ImageUpload(props) {
	        (0, _classCallCheck3.default)(this, ImageUpload);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (ImageUpload.__proto__ || (0, _getPrototypeOf2.default)(ImageUpload)).call(this, props));

	        _this.state = {
	            url: '',
	            imageId: ''
	        };
	        return _this;
	    }

	    (0, _createClass3.default)(ImageUpload, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _props = this.props,
	                focus = _props.focus,
	                initValue = _props.initValue,
	                data = _props.data;
	            var url = data.url;


	            if (focus) {
	                this.focus();
	            }

	            this.setState({
	                url: url,
	                imageId: initValue
	            });
	        }
	    }, {
	        key: 'focus',
	        value: function focus() {
	            this.onAddImage();
	        }
	    }, {
	        key: 'onAddImage',
	        value: function onAddImage() {
	            this._imageUpload.click();
	        }
	    }, {
	        key: 'onCancelImage',
	        value: function onCancelImage() {
	            this.setState({
	                imageId: '',
	                url: ''
	            });
	        }
	    }, {
	        key: 'fileDragHover',
	        value: function fileDragHover(e) {
	            e.stopPropagation();
	            e.preventDefault();
	            e.target.className = e.type == "dragover" ? "image-drag-box hover" : "image-drag-box";
	        }
	    }, {
	        key: 'fileSelectHandler',
	        value: function fileSelectHandler(e) {
	            this.fileDragHover(e);

	            this.uploadImage.call(this, e);
	        }
	    }, {
	        key: 'loadImage',
	        value: function loadImage(url, id) {
	            var _this2 = this;

	            var img = new Image();
	            /*this.setState({
	                loading: true
	            });*/
	            img.src = url;
	            if (img.complete) {
	                this.setState({
	                    //loading: false,
	                    imageId: id,
	                    url: url
	                });
	                return;
	            }
	            img.onload = function () {
	                _this2.setState({
	                    //loading: false,
	                    imageId: id,
	                    url: url
	                });
	            };
	            img.onerror = function () {
	                alert("网络异常，图片加载失败");
	            };
	        }
	    }, {
	        key: 'uploadImage',
	        value: function uploadImage(ev) {
	            var self = this;
	            var files = ev.target.files || ev.dataTransfer.files;
	            var file = files[0];
	            var fd = new FormData();
	            fd.append("pic", file);
	            var xhr = new XMLHttpRequest();
	            xhr.open('POST', '/pic/upload', true);
	            xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

	            xhr.upload.onprogress = function (e) {
	                if (e.lengthComputable) {
	                    var percentComplete = e.loaded / e.total * 100;
	                }
	            };
	            xhr.onload = function () {
	                if (this.status == 200) {
	                    var resp = JSON.parse(this.response);

	                    if (resp.result === 0) {
	                        var url = resp.dataUrl,
	                            imgId = resp.imageId;
	                        if (url && imgId) {
	                            self.loadImage(url, imgId);
	                            this.props.onUploadSuccess({
	                                imageId: id,
	                                url: url,
	                                target: this._imageUpload
	                            });
	                        }
	                    } else if (resp.result === 1) {
	                        alert(resp.info);
	                    } else if (resp.result === 2) {
	                        var container = this.props.container;

	                        container.close();
	                        var state = History.getState(),
	                            action = state.data.action;

	                        if (action && action !== 'signin') {
	                            History.replaceState({ action: 'signin' }, 'signin', "?popup=signin");
	                        }
	                    }
	                };
	            };
	            xhr.send(fd);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this3 = this;

	            var _state = this.state,
	                url = _state.url,
	                imageId = _state.imageId;


	            if (!url) {
	                return React.createElement(
	                    'div',
	                    { className: 'image-drag-box',
	                        onDragOver: this.fileDragHover.bind(this),
	                        onDragLeave: this.fileDragHover.bind(this),
	                        onDrop: this.fileSelectHandler.bind(this),
	                        onClick: this.onAddImage.bind(this) },
	                    React.createElement(
	                        'button',
	                        {
	                            type: 'button',
	                            className: 'btn'
	                        },
	                        '\u6DFB\u52A0\u56FE\u7247 +'
	                    ),
	                    React.createElement('input', {
	                        ref: function ref(imageUpload) {
	                            _this3._imageUpload = imageUpload;
	                        },
	                        accept: 'image/gif, image/png, image/jpeg, image/jpg, image/bmp, image/webp',
	                        onChange: this.uploadImage.bind(this),
	                        style: { display: "none" },
	                        id: 'image-upload',
	                        type: 'file',
	                        name: 'upload_file'
	                    }),
	                    React.createElement('input', {
	                        type: 'hidden',
	                        name: 'image',
	                        value: imageId
	                    })
	                );
	            } else {
	                return React.createElement(
	                    'div',
	                    { className: 'image-preview-area' },
	                    React.createElement(
	                        'a',
	                        { href: 'javascript:;',
	                            className: 'image-cancel-btn',
	                            onClick: this.onCancelImage.bind(this)
	                        },
	                        React.createElement('i', { className: 's s-close s-lg' })
	                    ),
	                    React.createElement('img', { src: url }),
	                    React.createElement('input', { type: 'hidden', name: 'image', value: imageId })
	                );
	            }
	        }
	    }]);
	    return ImageUpload;
	}(React.Component);

	var RichEditor = function (_React$Component2) {
	    (0, _inherits3.default)(RichEditor, _React$Component2);

	    function RichEditor(props) {
	        (0, _classCallCheck3.default)(this, RichEditor);

	        var _this4 = (0, _possibleConstructorReturn3.default)(this, (RichEditor.__proto__ || (0, _getPrototypeOf2.default)(RichEditor)).call(this, props));

	        var initValue = props.initValue;


	        _this4.state = {
	            html: initValue
	        };
	        return _this4;
	    }

	    (0, _createClass3.default)(RichEditor, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var focus = this.props.focus;


	            if (focus) {
	                this.focus();
	            }
	        }
	    }, {
	        key: 'focus',
	        value: function focus() {
	            this._editor.focus();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this5 = this;

	            return React.createElement(
	                'div',
	                null,
	                React.createElement(_TextEditor2.default, {
	                    html: this.state.html,
	                    ref: function ref(_ref) {
	                        return _this5._editor = _ref;
	                    },
	                    placeholder: '\u6B63\u6587',
	                    className: 'text-editor',
	                    onFocus: this.props.onFocus,
	                    onChange: function onChange(evt) {
	                        var value = evt.target.value;

	                        _this5.setState({
	                            html: value
	                        });
	                        _this5.props.onChange(evt);
	                    }
	                }),
	                React.createElement('textarea', (0, _extends3.default)({
	                    style: { display: "none" }
	                }, this.props.attrs, {
	                    value: this.state.html
	                }))
	            );
	        }
	    }]);
	    return RichEditor;
	}(React.Component);

	var TextArea = function (_React$Component3) {
	    (0, _inherits3.default)(TextArea, _React$Component3);

	    function TextArea(props) {
	        (0, _classCallCheck3.default)(this, TextArea);

	        var _this6 = (0, _possibleConstructorReturn3.default)(this, (TextArea.__proto__ || (0, _getPrototypeOf2.default)(TextArea)).call(this, props));

	        _this6.state = {
	            text: ''
	        };
	        return _this6;
	    }

	    (0, _createClass3.default)(TextArea, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _props2 = this.props,
	                focus = _props2.focus,
	                initValue = _props2.initValue;


	            if (focus) {
	                this.focus();
	            }

	            this.setState({
	                text: initValue
	            });
	        }
	    }, {
	        key: 'focus',
	        value: function focus() {
	            this._textArea.focus();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this7 = this;

	            return React.createElement('textarea', (0, _extends3.default)({}, this.props.attrs, {
	                ref: function ref(_ref2) {
	                    _this7._textArea = _ref2;
	                },
	                onFocus: this.props.onFocus,
	                onChange: function onChange(evt) {
	                    var val = evt.target.value;
	                    _this7.setState({
	                        text: val
	                    });
	                    _this7.props.onChange(val);
	                },
	                value: this.state.text
	            }));
	        }
	    }]);
	    return TextArea;
	}(React.Component);

	var Input = function (_React$Component4) {
	    (0, _inherits3.default)(Input, _React$Component4);

	    function Input(props) {
	        (0, _classCallCheck3.default)(this, Input);

	        var _this8 = (0, _possibleConstructorReturn3.default)(this, (Input.__proto__ || (0, _getPrototypeOf2.default)(Input)).call(this, props));

	        _this8.state = {
	            value: ''
	        };
	        return _this8;
	    }

	    (0, _createClass3.default)(Input, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            var _props3 = this.props,
	                focus = _props3.focus,
	                initValue = _props3.initValue;


	            if (focus) {
	                this.focus();
	            }

	            this.setState({
	                value: initValue
	            });
	        }
	    }, {
	        key: 'focus',
	        value: function focus() {
	            this._input.focus();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this9 = this;

	            return React.createElement('input', (0, _extends3.default)({}, this.props.attrs, {
	                ref: function ref(_ref3) {
	                    _this9._input = _ref3;
	                },
	                onFocus: this.props.onFocus,
	                onChange: function onChange(evt) {
	                    var val = evt.target.value;
	                    _this9.setState({
	                        value: val
	                    });
	                    _this9.props.onChange(val);
	                },
	                value: this.state.value
	            }));
	        }
	    }]);
	    return Input;
	}(React.Component);

	var FinishBtn = function (_React$Component5) {
	    (0, _inherits3.default)(FinishBtn, _React$Component5);

	    function FinishBtn(props) {
	        (0, _classCallCheck3.default)(this, FinishBtn);

	        var _this10 = (0, _possibleConstructorReturn3.default)(this, (FinishBtn.__proto__ || (0, _getPrototypeOf2.default)(FinishBtn)).call(this, props));

	        _this10.handleClick = _this10.handleClick.bind(_this10);
	        return _this10;
	    }

	    (0, _createClass3.default)(FinishBtn, [{
	        key: 'handleClick',
	        value: function handleClick() {
	            this.props.onFinishClick();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this11 = this;

	            return React.createElement(
	                'button',
	                {
	                    ref: function ref(_ref4) {
	                        _this11._self = _ref4;
	                    },
	                    id: 'finish_cdream_btn',
	                    onClick: this.handleClick,
	                    type: 'button',
	                    className: 'btn btn-primary'
	                },
	                '\u8BB0\u5F55 \u2192'
	            );
	        }
	    }, {
	        key: 'enable',
	        value: function enable() {
	            utils.removeClass(this._self, 'disabled');
	        }
	    }, {
	        key: 'disable',
	        value: function disable() {
	            utils.addClass(this._self, 'disabled');
	        }
	    }]);
	    return FinishBtn;
	}(React.Component);

	var newDreamsCon = null;

	var MOOD = {
	    label: '心情',
	    rel: 'tab-mood-post',
	    name: 'mood',
	    active: false
	};

	var HEALTH = {
	    label: '身体状况',
	    rel: 'tab-health-post',
	    name: 'health',
	    active: false
	};

	var BTNS = {
	    "image": [MOOD, HEALTH],
	    "news": [{
	        label: '摘要',
	        rel: 'tab-text-post',
	        name: 'text',
	        active: false
	    }, {
	        label: '配图',
	        rel: 'tab-image-post',
	        name: 'image',
	        active: false
	    }, MOOD, HEALTH],
	    "text": [{
	        label: '标题',
	        rel: 'tab-title-post',
	        name: 'title',
	        active: false
	    }, {
	        label: '配图',
	        rel: 'tab-image-post',
	        name: 'image',
	        active: false
	    }, MOOD, HEALTH]
	};

	var NAME_MAP = {
	    "title": "content",
	    "link": "link",
	    "image": "image",
	    "text": "text",
	    "mood": "mood",
	    "health": "health"
	};

	var FIELDS = {
	    "text": [{
	        name: "text",
	        type: "text",
	        com: "textField",
	        val: '',
	        focus: true
	    }],
	    "image": [{
	        name: "image",
	        type: "image",
	        com: "imageField",
	        val: '',
	        data: {
	            url: ''
	        },
	        focus: false
	    }, {
	        name: "content",
	        type: "title",
	        com: "titleField",
	        val: '',
	        focus: true
	    }],
	    "news": [{
	        name: "link",
	        type: "link",
	        com: "linkField",
	        val: '',
	        focus: true
	    }, {
	        name: "content",
	        type: "title",
	        com: "titleField",
	        val: '',
	        focus: false
	    }]
	};

	var DreamForm = function (_BaseCom) {
	    (0, _inherits3.default)(DreamForm, _BaseCom);
	    (0, _createClass3.default)(DreamForm, [{
	        key: 'fieldBtns',
	        get: function get() {
	            var _state2 = this.state,
	                btns = _state2.btns,
	                fields = _state2.fields;

	            // 根据表单渲染表单按妞

	            for (var i = 0, l = btns.length; i < l; i++) {
	                var btn = btns[i];
	                btn.active = false;
	                for (var n = 0, _l = fields.length; n < _l; n++) {
	                    var field = fields[n];
	                    if (btn.name === field.type) {
	                        btn.active = true;
	                    }
	                }
	            }

	            return React.createElement(
	                'ul',
	                null,
	                btns.map(function (btn, i) {
	                    return React.createElement(
	                        'li',
	                        { key: i },
	                        React.createElement(
	                            'a',
	                            {
	                                href: 'javascript:;',
	                                className: btn.active ? 'btn cur' : 'btn',
	                                'data-type': btn.name,
	                                rel: btn.rel
	                            },
	                            React.createElement('i', { className: btn.active ? 's s-subtract s-lg' : "s s-plus s-lg" }),
	                            btn.label
	                        )
	                    );
	                })
	            );
	        }
	    }, {
	        key: 'fieldEls',
	        get: function get() {
	            var _this13 = this;

	            var _state3 = this.state,
	                type = _state3.type,
	                fields = _state3.fields;


	            return React.createElement(
	                'form',
	                {
	                    ref: function ref(_ref5) {
	                        return _this13._form = _ref5;
	                    },
	                    action: '/dream/new',
	                    method: 'post'
	                },
	                fields.map(function (form, i) {
	                    var Form = _this13[form.com];
	                    return React.createElement(Form, {
	                        focus: form.focus,
	                        initValue: form.val,
	                        field: form,
	                        data: form.data ? form.data : {},
	                        key: i
	                    });
	                }),
	                React.createElement('input', {
	                    type: 'hidden',
	                    name: 'category',
	                    value: type
	                })
	            );
	        }
	    }, {
	        key: 'titleField',
	        get: function get() {
	            var _this14 = this;

	            var _state4 = this.state,
	                type = _state4.type,
	                title = _state4.title,
	                TITLES_MAP = {
	                'text': '简单描述一下文字内容...',
	                'image': '简单描述一下图片内容...',
	                'news': '简单描述一下网页的内容...'
	            },
	                TITLE = TITLES_MAP[type],
	                NAME = TITLE ? TITLE : '';


	            return function (props) {
	                return React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'p',
	                        { className: 'field' },
	                        React.createElement(TextArea, (0, _extends3.default)({
	                            attrs: {
	                                maxLength: "140",
	                                name: "content",
	                                placeholder: NAME
	                            },
	                            onFocus: _this14.resetField.bind(_this14),
	                            onChange: function onChange(val) {
	                                props.field.val = val;
	                            }
	                        }, props))
	                    ),
	                    React.createElement('p', { className: 'validate-error' })
	                );
	            };
	        }
	    }, {
	        key: 'textField',
	        get: function get() {
	            var _this15 = this;

	            var text = this.state.text;


	            return function (props) {
	                return React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'div',
	                        {
	                            className: 'field'
	                        },
	                        React.createElement(RichEditor, (0, _extends3.default)({
	                            onFocus: _this15.resetField.bind(_this15),
	                            onChange: function onChange(evt) {
	                                var value = evt.target.value;

	                                props.field.val = value;
	                            },
	                            attrs: {
	                                name: "text"
	                            }
	                        }, props))
	                    ),
	                    React.createElement('p', { className: 'validate-error' })
	                );
	            };
	        }
	    }, {
	        key: 'imageField',
	        get: function get() {
	            var _this16 = this;

	            return function (props) {
	                return React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'p',
	                        { className: 'field' },
	                        React.createElement(ImageUpload, (0, _extends3.default)({
	                            onUploadSuccess: function onUploadSuccess(ev) {
	                                var url = ev.url,
	                                    imageId = ev.imageId;

	                                props.field.val = imageId;
	                                props.field.data.url = url;
	                                _this16.resetField(ev);
	                            }
	                        }, props))
	                    ),
	                    React.createElement('p', { className: 'validate-error' })
	                );
	            };
	        }
	    }, {
	        key: 'linkField',
	        get: function get() {
	            var _this17 = this;

	            return function (props) {
	                return React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'p',
	                        { className: 'field' },
	                        React.createElement(Input, (0, _extends3.default)({
	                            attrs: {
	                                type: "url",
	                                name: "link",
	                                placeholder: "网址，例: http://www.ty-xb.com"
	                            },
	                            onFocus: _this17.resetField.bind(_this17),
	                            onChange: function onChange(val) {
	                                props.field.val = val;
	                            }
	                        }, props))
	                    ),
	                    React.createElement('p', { className: 'validate-error' })
	                );
	            };
	        }
	    }, {
	        key: 'moreFields',
	        get: function get() {
	            var _this18 = this;

	            var type = this.state.type;


	            return React.createElement(
	                'div',
	                {
	                    id: 'dreamReleaseBar',
	                    className: 'nav-group'
	                },
	                this.fieldBtns,
	                React.createElement(FinishBtn, {
	                    ref: function ref(_ref6) {
	                        _this18._finishBtn = _ref6;
	                    },
	                    onFinishClick: this.validate.bind(this)
	                })
	            );
	        }
	    }, {
	        key: 'healthField',
	        get: function get() {
	            return function (props) {
	                return React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'p',
	                        { className: 'field' },
	                        React.createElement(Input, (0, _extends3.default)({
	                            attrs: {
	                                type: "text",
	                                maxLength: "30",
	                                name: "health",
	                                placeholder: "身体状况"
	                            },
	                            onChange: function onChange(val) {
	                                props.field.val = val;
	                            }
	                        }, props))
	                    ),
	                    React.createElement('p', { className: 'validate-error' })
	                );
	            };
	        }
	    }, {
	        key: 'moodField',
	        get: function get() {
	            return function (props) {
	                return React.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    React.createElement(
	                        'p',
	                        { className: 'field' },
	                        React.createElement(Input, (0, _extends3.default)({
	                            attrs: {
	                                type: "text",
	                                maxLength: "30",
	                                name: "health",
	                                placeholder: "心情"
	                            },
	                            onChange: function onChange(val) {
	                                props.field.val = val;
	                            }
	                        }, props))
	                    ),
	                    React.createElement('p', { className: 'validate-error' })
	                );
	            };
	        }
	    }]);

	    function DreamForm(props) {
	        (0, _classCallCheck3.default)(this, DreamForm);

	        var _this12 = (0, _possibleConstructorReturn3.default)(this, (DreamForm.__proto__ || (0, _getPrototypeOf2.default)(DreamForm)).call(this, props));

	        var type = props.type;


	        _this12.formData = null;

	        _this12.state = {
	            type: type,
	            fields: FIELDS[type],
	            btns: BTNS[type]
	        };
	        return _this12;
	    }

	    (0, _createClass3.default)(DreamForm, [{
	        key: 'resetField',
	        value: function resetField(ev) {
	            var inp = ev.target,
	                field = utils.closest(inp, '.field'),
	                tips = field && field.nextElementSibling;

	            tips.innerHTML = '';
	            tips.style.display = 'none';
	            utils.setData(tips, { 'err': false });
	            utils.setData(tips, { 'eindex': 0 });
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.initState();
	        }
	    }, {
	        key: 'initState',
	        value: function initState() {
	            if (this._con) {
	                var selectors = ['[rel="post-text"]', '[rel="post-image"]', '[rel="post-news"]', '[rel="tab-title-post"]', '[rel="tab-text-post"]', '[rel="tab-link-post"]', '[rel="tab-image-post"]', '[rel="tab-mood-post"]', '[rel="tab-health-post"]'],
	                    handles = [this.setTextFormData, this.setImageFormData, this.setNewsFormData, this.toggleForm, this.toggleForm, this.toggleForm, this.toggleForm, this.toggleForm, this.toggleForm];

	                this.delegate(this._con, selectors, handles);
	            }
	        }
	    }, {
	        key: 'setFormData',
	        value: function setFormData(type) {
	            this.setState({
	                type: type,
	                fields: FIELDS[type],
	                btns: BTNS[type]
	            });
	        }
	    }, {
	        key: 'setTextFormData',
	        value: function setTextFormData(type) {
	            this.setFormData('text');
	        }
	    }, {
	        key: 'setImageFormData',
	        value: function setImageFormData(ev) {
	            this.setFormData('image');
	        }
	    }, {
	        key: 'setNewsFormData',
	        value: function setNewsFormData(ev) {
	            this.setFormData('news');
	        }
	    }, {
	        key: 'toggleForm',
	        value: function toggleForm(ev, cur) {
	            var fieldType = utils.getData(cur, 'type');

	            var _state5 = this.state,
	                btns = _state5.btns,
	                fields = _state5.fields,
	                active = void 0;

	            for (var i = 0, l = btns.length; i < l; i++) {
	                var btn = btns[i];
	                if (btn.name === fieldType) {
	                    active = btn.active;
	                    break;
	                }
	            }

	            if (!active) {
	                fields.push({
	                    name: NAME_MAP[fieldType],
	                    type: fieldType,
	                    com: fieldType + 'Field',
	                    focus: fieldType === "image" ? false : true,
	                    val: ''
	                });
	            } else {
	                fields = fields.filter(function (field) {
	                    return field.type !== fieldType;
	                });
	            }

	            this.setState({
	                btns: btns,
	                fields: fields
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this19 = this;

	            var type = this.state.type;
	            var container = this.props.container;

	            var tabs = [{
	                type: "text",
	                icon: "edit",
	                label: settings.CATEGORY.TEXT
	            }, {
	                type: "image",
	                icon: "image",
	                label: settings.CATEGORY.IMAGE
	            }];

	            return React.createElement(
	                'div',
	                {
	                    className: 'post-editor-form',
	                    ref: function ref(_ref7) {
	                        _this19._con = _ref7;
	                    } },
	                React.createElement(
	                    'div',
	                    { className: 'post-editor-header' },
	                    React.createElement(
	                        'ul',
	                        { className: 'category-list' },
	                        tabs.map(function (tab, i) {
	                            return React.createElement(
	                                'li',
	                                { key: i, className: tab.type === type ? "cur" : "" },
	                                React.createElement(
	                                    'a',
	                                    {
	                                        rel: 'post-' + tab.type,
	                                        href: 'javascript:;' },
	                                    React.createElement('i', { className: 's s-' + tab.icon + ' s-2x' }),
	                                    React.createElement(
	                                        'span',
	                                        null,
	                                        tab.label
	                                    )
	                                )
	                            );
	                        })
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'post-editor-ctrl' },
	                        React.createElement(
	                            'a',
	                            { href: 'javascript:;',
	                                className: 'close',
	                                onClick: function onClick() {
	                                    container.close();
	                                }
	                            },
	                            React.createElement('i', { className: 's s-close s-2x' })
	                        )
	                    )
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'tab-content' },
	                    React.createElement(
	                        'div',
	                        {
	                            ref: function ref(popbd) {
	                                _this19._popbd = popbd;
	                            },
	                            className: 'dream-area'
	                        },
	                        this.fieldEls
	                    )
	                ),
	                this.moreFields
	            );
	        }
	    }, {
	        key: 'checkField',
	        value: function checkField(item, val, tips, i) {
	            var label = item.label;


	            var err = utils.getData(tips, 'err'),
	                eindex = utils.getData(tips, 'eindex');

	            if (err && eindex !== i) {
	                return false;
	            }

	            // 判断是否为空
	            if (item.require) {
	                if (val.length === 0) {
	                    tips.innerHTML = item.empty_msg || label + "木有输入";
	                    tips.style.display = 'block';
	                    utils.setData(tips, { 'err': true });
	                    utils.setData(tips, { 'eindex': i });
	                    return false;
	                } else {
	                    tips.innerHTML = '';
	                    tips.style.display = 'none';
	                    utils.setData(tips, { 'err': false });
	                    utils.setData(tips, { 'eindex': i });
	                }
	            }

	            var isValid = true,
	                errorText = "";
	            if (item.fun) {
	                if (!item.fun(val)) {
	                    isValid = false;
	                    errorText = item.err || '';
	                }

	                if (!isValid) {
	                    tips.style.display = 'block';
	                    tips.innerHTML = errorText;
	                    utils.setData(tips, { 'err': true });
	                    utils.setData(tips, { 'eindex': i });
	                    return false;
	                } else {
	                    tips.innerHTML = '';
	                    tips.style.display = 'none';
	                    utils.setData(tips, { 'err': false });
	                    utils.setData(tips, { 'eindex': i });
	                }
	            }
	            return true;
	        }
	    }, {
	        key: 'getFormData',
	        value: function getFormData() {
	            var _this20 = this;

	            this.formData = {};
	            this._form && this._form.querySelectorAll('input[type=text], \
	            input[type=url], \
	            input[type=hidden], \
	            textarea').forEach(function (inp, key) {
	                var val = inp.value;
	                _this20.formData[inp.name] = val;
	            });
	        }
	    }, {
	        key: 'validate',
	        value: function validate() {
	            var _this21 = this;

	            var type = this.state.type;

	            var validate = true,
	                rules = {};

	            switch (type) {
	                case "news":
	                    rules = {
	                        content: [{ require: true, label: '标题' }],
	                        link: [{ require: true, label: '网址' }, { label: '网址', err: "链接格式错误", fun: function fun(val) {
	                                return !val || utils.isUrl(val);
	                            } }]
	                    };
	                    break;
	                case "image":
	                    rules = {
	                        image: [{
	                            require: true, empty_msg: '图片木有添加', label: '图片'
	                        }]
	                    };
	                    break;
	                case "text":
	                    rules = {
	                        text: [{ require: true, label: '文字' }]
	                    };
	                    break;
	            }

	            this._form && this._form.querySelectorAll('input[type=text], \
	            input[type=url], \
	            input[type=hidden], \
	            textarea').forEach(function (inp, key) {
	                var val = inp.value.trim(),
	                    field = utils.closest(inp, '.field'),
	                    tips = field && field.nextElementSibling;

	                // 判断是否有效
	                for (var _key in rules) {
	                    var rule = rules[_key],
	                        name = _key;

	                    if (name === inp.name) {
	                        if (rule.length > 0) {
	                            rule.forEach(function (item, i) {
	                                if (!_this21.checkField(item, val, tips, i)) {
	                                    validate = false;
	                                }
	                            });
	                        } else {
	                            if (!_this21.checkField(rule, val, tips, 0)) {
	                                validate = false;
	                            }
	                        }
	                    }
	                }
	            });

	            if (validate) {
	                this._finishBtn.disable();
	                this.getFormData();
	                this.submit();
	            }
	        }
	    }, {
	        key: 'hasCon',
	        value: function hasCon() {
	            var fields = [{ name: 'tag' }, { name: 'content' }, { name: 'link' }, { name: 'text' }, { name: 'image' }];

	            return this._form && [].slice.call(this._form.querySelectorAll('input[type=text], input[type=url], input[type=hidden], textarea')).filter(function (item) {
	                for (var i = 0, l = fields.length; i < l; i++) {
	                    var field = fields[i];
	                    if (item.name === field.name && item.value.trim()) {
	                        return true;
	                    }
	                };
	            }).length > 0;
	        }
	    }, {
	        key: 'submit',
	        value: function submit() {
	            var _this22 = this;

	            var text = this.formData.text;
	            if (text) {
	                this.formData.text = text;
	            }

	            _req2.default.post('/dream/new', this.formData, function (data) {
	                common.xhrReponseManage(data, function (data) {
	                    try {
	                        if (data.result === 0 && data.data && data.data.dream) {
	                            if (!newDreamsCon) {
	                                console.log('new list ...');
	                                var newDreamsEl = document.querySelector('#newDreamsCon');
	                                newDreamsCon = ReactDOM.render(React.createElement(_DreamList2.default, null), newDreamsEl);
	                            }
	                            console.log('add item ...');
	                            newDreamsCon.addItem(data.data.dream);
	                            var container = _this22.props.container;

	                            container.close();
	                        }
	                    } catch (err) {
	                        alert(err.message);
	                    }
	                });
	            });
	        }
	    }]);
	    return DreamForm;
	}(_basecom2.default);

	var PostEditor = function (_React$Component6) {
	    (0, _inherits3.default)(PostEditor, _React$Component6);

	    function PostEditor(props) {
	        (0, _classCallCheck3.default)(this, PostEditor);

	        var _this23 = (0, _possibleConstructorReturn3.default)(this, (PostEditor.__proto__ || (0, _getPrototypeOf2.default)(PostEditor)).call(this, props));

	        _this23.state = {
	            loading: true,
	            checked: false,
	            tagName: '',
	            type: '',
	            tag: ''
	        };
	        return _this23;
	    }

	    (0, _createClass3.default)(PostEditor, [{
	        key: 'checkUser',
	        value: function checkUser(cb) {
	            var _this24 = this;

	            var tag = this.props.tag;


	            if (tag) {
	                _req2.default.getJSON('/tag/getinfo', { tid: this.curTag }, cb.bind(this), function () {
	                    alert('网络异常');
	                    _this24.close();
	                });
	            } else {
	                _req2.default.getJSON('/islogin', null, cb.bind(this), function () {
	                    alert('网络异常');
	                    _this24.close();
	                });
	            }
	        }
	    }, {
	        key: 'show',
	        value: function show(params) {
	            var type = params.type,
	                tag = params.tag;

	            this.loadPostForm(type, tag);
	        }
	    }, {
	        key: 'loadPostForm',
	        value: function loadPostForm(type, tag) {
	            var _this25 = this;

	            this.setState({
	                loading: true
	            });
	            this.checkUser(function (data) {
	                try {
	                    var ret = +data.result;
	                    if (ret === 0) {
	                        var _ref8 = data.data || {},
	                            _ref8$tagName = _ref8.tagName,
	                            tagName = _ref8$tagName === undefined ? '' : _ref8$tagName;

	                        _this25.setState({
	                            loading: false,
	                            checked: true,
	                            type: type,
	                            tag: tag,
	                            tagName: tagName
	                        });
	                    } else if (ret === 2) {
	                        var dialog = _this25.props.dialog;

	                        dialog.hide();

	                        _this25.setState({
	                            loading: false
	                        });

	                        var state = History.getState(),
	                            action = state.data.action;

	                        if (action && action !== 'signin') {
	                            History.replaceState({ action: 'signin' }, 'signin', "?popup=signin");
	                        }
	                    } else {
	                        alert(data.info);
	                        _this25.close();
	                    }
	                } catch (err) {
	                    alert(err.message);
	                }
	            });
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var dialog = this.props.dialog;

	            dialog.close();

	            this.setState({
	                checked: false
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _state6 = this.state,
	                loading = _state6.loading,
	                tagName = _state6.tagName,
	                checked = _state6.checked;


	            if (loading) {
	                return React.createElement(
	                    'div',
	                    { className: 'loading' },
	                    '\u6B63\u5728\u9A8C\u8BC1\u7528\u6237\u72B6\u6001...'
	                );
	            } else {
	                if (checked) {
	                    var _state7 = this.state,
	                        type = _state7.type,
	                        tag = _state7.tag;


	                    return React.createElement(DreamForm, {
	                        container: this,
	                        type: type,
	                        tid: tag,
	                        tag: tagName
	                    });
	                } else {
	                    return null;
	                }
	            }
	        }
	    }]);
	    return PostEditor;
	}(React.Component);

	var _default = PostEditor;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(ImageUpload, 'ImageUpload', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(RichEditor, 'RichEditor', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(TextArea, 'TextArea', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(Input, 'Input', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(FinishBtn, 'FinishBtn', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(newDreamsCon, 'newDreamsCon', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(MOOD, 'MOOD', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(HEALTH, 'HEALTH', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(BTNS, 'BTNS', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(NAME_MAP, 'NAME_MAP', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(FIELDS, 'FIELDS', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(DreamForm, 'DreamForm', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(PostEditor, 'PostEditor', 'E:/mypro/tyxb/src/PostEditor.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/PostEditor.js');
	}();

	;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(26);

	var _extends3 = _interopRequireDefault(_extends2);

	var _objectWithoutProperties2 = __webpack_require__(123);

	var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var striptags = __webpack_require__(121);

	var TextEditor = function (_React$Component) {
	    (0, _inherits3.default)(TextEditor, _React$Component);

	    function TextEditor() {
	        (0, _classCallCheck3.default)(this, TextEditor);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (TextEditor.__proto__ || (0, _getPrototypeOf2.default)(TextEditor)).call(this));

	        _this.emitChange = _this.emitChange.bind(_this);
	        return _this;
	    }

	    (0, _createClass3.default)(TextEditor, [{
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var _props = this.props,
	                tagName = _props.tagName,
	                html = _props.html,
	                props = (0, _objectWithoutProperties3.default)(_props, ['tagName', 'html']);


	            return React.createElement(tagName || 'div', (0, _extends3.default)({}, props, {
	                ref: function ref(e) {
	                    return _this2.htmlEl = e;
	                },
	                onInput: this.emitChange,
	                onBlur: this.props.onBlur || this.emitChange,
	                onFocus: this.props.onFocus,
	                contentEditable: !this.props.disabled,
	                dangerouslySetInnerHTML: { __html: html }
	            }), this.props.children);
	        }
	    }, {
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate(nextProps) {
	            // We need not rerender if the change of props simply reflects the user's
	            // edits. Rerendering in this case would make the cursor/caret jump.
	            return (
	                // Rerender if there is no element yet... (somehow?)
	                !this.htmlEl
	                // ...or if html really changed... (programmatically, not by user edit)
	                || nextProps.html !== this.htmlEl.innerHTML && nextProps.html !== this.props.html
	                // ...or if editing is enabled or disabled.
	                || this.props.disabled !== nextProps.disabled
	                // ...or if className changed
	                || this.props.className !== nextProps.className
	            );
	        }
	    }, {
	        key: 'componentDidUpdate',
	        value: function componentDidUpdate() {
	            if (this.htmlEl && this.props.html !== this.htmlEl.innerHTML) {
	                // Perhaps React (whose VDOM gets outdated because we often prevent
	                // rerendering) did not update the DOM. So we update it manually now.
	                this.htmlEl.innerHTML = this.props.html;
	            }
	        }
	    }, {
	        key: 'emitChange',
	        value: function emitChange(evt) {
	            if (!this.htmlEl) return;
	            var html = striptags(this.htmlEl.innerHTML, '<div><br>');
	            if (this.props.onChange && html !== this.lastHtml) {
	                evt.target = { value: html };
	                this.props.onChange(evt);
	            }
	            this.lastHtml = html;
	        }
	    }, {
	        key: 'focus',
	        value: function focus() {
	            this.htmlEl && this.htmlEl.focus();
	        }
	    }]);
	    return TextEditor;
	}(React.Component);

	var _default = TextEditor;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(TextEditor, 'TextEditor', 'E:/mypro/tyxb/src/TextEditor.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/TextEditor.js');
	}();

	;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getPrototypeOf = __webpack_require__(4);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(8);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(7);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _req = __webpack_require__(13);

	var _req2 = _interopRequireDefault(_req);

	var _effect = __webpack_require__(41);

	var _effect2 = _interopRequireDefault(_effect);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var common = __webpack_require__(21);
	var utils = __webpack_require__(9);

	var TextViewer = function (_React$Component) {
	    (0, _inherits3.default)(TextViewer, _React$Component);

	    function TextViewer(props) {
	        (0, _classCallCheck3.default)(this, TextViewer);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (TextViewer.__proto__ || (0, _getPrototypeOf2.default)(TextViewer)).call(this, props));

	        _this.state = {
	            loading: true,
	            did: '',
	            heartCls: 's s-arrow_up s-2x',
	            hasHeart: false,
	            dream: {},
	            el: null
	        };
	        return _this;
	    }

	    (0, _createClass3.default)(TextViewer, [{
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(nextProps) {
	            if (nextProps.did && nextProps.did !== this.state.did) {
	                this.loadContent(nextProps);
	            }
	        }
	    }, {
	        key: 'loadContent',
	        value: function loadContent(props) {
	            var _this2 = this;

	            var did = props.did,
	                el = props.el;


	            this.setState({
	                loading: true
	            });

	            _req2.default.getJSON("/dream/textloaded", {
	                did: did
	            }, function (data) {
	                try {
	                    common.xhrReponseManage(data, function (data) {
	                        var dream = {};

	                        if (data.data && data.data.dream) {
	                            dream = data.data.dream;
	                        }

	                        var hasHeart = !!(dream.good && dream.good[0]),
	                            heartCls = hasHeart ? "s s-arrow_up s-2x s-ac" : "s s-arrow_up s-2x";

	                        var state = {
	                            dream: dream,
	                            hasHeart: hasHeart,
	                            did: did,
	                            heartCls: heartCls,
	                            loading: false
	                        };

	                        if (el) state.el = el;

	                        _this2.setState(state);
	                    });
	                } catch (err) {
	                    alert(err.message);
	                }
	            }, function () {
	                _this2.close();
	                alert("网络异常，内容获取失败");
	            });
	        }
	    }, {
	        key: 'showLogin',
	        value: function showLogin() {
	            try {
	                this.close();
	                var state = History.getState(),
	                    action = state.data.action;

	                if (action && action !== 'signin') {
	                    History.replaceState({ action: 'signin' }, 'signin', "?popup=signin");
	                }
	            } catch (err) {
	                alert(err.message);
	            }
	        }
	    }, {
	        key: 'deleteDream',
	        value: function deleteDream() {
	            var _this3 = this;

	            var _state = this.state,
	                did = _state.did,
	                el = _state.el;

	            _req2.default.post("/dream/delete", {
	                did: did
	            }, function (data) {
	                try {
	                    switch (data.result) {
	                        case 0:
	                            _this3.close();
	                            if (el) {
	                                _effect2.default.fadeOut(el, function (el) {
	                                    el.parentNode.removeChild(el);
	                                });
	                            }
	                            break;
	                        case 1:
	                            alert(data.info);
	                            break;
	                        case 2:
	                            _this3.showLogin();
	                            break;
	                        default:
	                            break;
	                    };
	                } catch (err) {
	                    alert(err.message);
	                }
	            }, function () {});
	        }
	    }, {
	        key: 'heartIt',
	        value: function heartIt(ev) {
	            var _this4 = this;

	            var _state2 = this.state,
	                did = _state2.did,
	                dream = _state2.dream,
	                hasHeart = _state2.hasHeart,
	                el = _state2.el;


	            if (!hasHeart) {
	                _req2.default.post("/dream/goodit", {
	                    did: did
	                }, function (data) {
	                    switch (data.result) {
	                        case 0:
	                            if (data.data) {
	                                var num = parseInt(data.data.num);
	                                dream.vote = isNaN(num) ? 0 : num;
	                                var cls = "s s-arrow_up s-2x s-ac";
	                                if (el) {
	                                    var heart = el.querySelector("a.owed"),
	                                        heartNum = heart.querySelector('[rel="vote-num"]');
	                                    utils.addClass(heart.querySelector('i'), "s-ac");
	                                    utils.setData(heart, { 'hasgood': true });
	                                    heartNum.innerHTML = dream.vote;
	                                }
	                                _this4.setState({
	                                    dream: dream,
	                                    hasHeart: true,
	                                    heartCls: cls
	                                });
	                            }
	                            break;
	                        case 1:
	                            alert(data.info);
	                            break;
	                        case 2:
	                            _this4.showLogin();
	                            break;
	                        default:
	                            break;
	                    }
	                }, function () {});
	            } else {
	                _req2.default.post("/dream/cgood", {
	                    did: did
	                }, function (data) {
	                    switch (data.result) {
	                        case 0:
	                            if (data.data) {
	                                var num = parseInt(data.data.num);
	                                dream.vote = isNaN(num) ? 0 : num;
	                                var cls = "s s-arrow_up s-2x s-ac";
	                                if (el) {
	                                    var heart = el.querySelector("a.owed"),
	                                        heartNum = heart.querySelector('[rel="vote-num"]');
	                                    utils.removeClass(heart.querySelector('i'), "s-ac");
	                                    utils.setData(heart, { 'hasgood': false });
	                                    heartNum.innerHTML = dream.vote;
	                                }
	                                _this4.setState({
	                                    dream: dream,
	                                    hasHeart: false,
	                                    heartCls: "s s-arrow_up s-2x"
	                                });
	                            }
	                            break;
	                        case 1:
	                            alert(data.info);
	                            break;
	                        case 2:
	                            _this4.showLogin();
	                            break;
	                        default:
	                            break;
	                    }
	                }, function () {});
	            }
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var dialog = this.props.dialog;

	            dialog.close();

	            window.curDreamItem = null;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _state3 = this.state,
	                loading = _state3.loading,
	                dream = _state3.dream,
	                did = _state3.did,
	                heartCls = _state3.heartCls;

	            var href = "/user/" + (dream._belong_u && dream._belong_u._id || "unknow");
	            var username = dream._belong_u && dream._belong_u.username || "未知";

	            if (!loading) {
	                return React.createElement(
	                    'div',
	                    { className: 'dialog-inner' },
	                    React.createElement(
	                        'div',
	                        { className: 'dialog-header' },
	                        React.createElement(
	                            'div',
	                            { className: 'userinfo' },
	                            React.createElement(
	                                'a',
	                                { className: 'username', href: href },
	                                username
	                            ),
	                            React.createElement(
	                                'span',
	                                { className: 'datetime' },
	                                common.dateBeautify(new Date(dream.date))
	                            ),
	                            React.createElement(
	                                'span',
	                                { className: 'things' },
	                                '\u5199\u4E86\u4E00\u7BC7\u201C\u6587\u5B57\u201D...'
	                            )
	                        ),
	                        React.createElement(
	                            'div',
	                            { className: 'userctrl' },
	                            this.removeText,
	                            React.createElement(
	                                'a',
	                                { href: 'javascript:;',
	                                    className: 'close',
	                                    onClick: this.close.bind(this)
	                                },
	                                React.createElement('i', { className: 's s-close s-2x' })
	                            )
	                        )
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'dialog-container' },
	                        React.createElement(
	                            'div',
	                            { className: 'text-viewer-box' },
	                            React.createElement(
	                                'h1',
	                                null,
	                                dream.content || ""
	                            ),
	                            React.createElement('div', { className: 'text-viewer-content',
	                                dangerouslySetInnerHTML: { __html: dream.text || "文字没有找到..." }
	                            })
	                        )
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'dialog-footer' },
	                        React.createElement(
	                            'div',
	                            { className: 'ctrl-box' },
	                            React.createElement(
	                                'a',
	                                { className: 'owed',
	                                    href: 'javascript:;',
	                                    title: '\u559C\u6B22',
	                                    onClick: this.heartIt.bind(this)
	                                },
	                                React.createElement(
	                                    'div',
	                                    { className: 'owed-inner' },
	                                    React.createElement('i', { className: heartCls }),
	                                    React.createElement(
	                                        'span',
	                                        { className: 'vote-num', rel: 'vote-num' },
	                                        '\u6709',
	                                        dream.vote || 0,
	                                        '\u4EBA\u559C\u6B22...'
	                                    )
	                                )
	                            )
	                        )
	                    )
	                );
	            } else {
	                return React.createElement(
	                    'div',
	                    { id: 'loading' },
	                    React.createElement(
	                        'div',
	                        { id: 'loading-center' },
	                        React.createElement(
	                            'div',
	                            { id: 'loading-center-absolute' },
	                            React.createElement('div', { className: 'object', id: 'object_zero' }),
	                            React.createElement('div', { className: 'object', id: 'object_one' }),
	                            React.createElement('div', { className: 'object', id: 'object_two' }),
	                            React.createElement('div', { className: 'object', id: 'object_three' }),
	                            React.createElement('div', { className: 'object', id: 'object_four' }),
	                            React.createElement('div', { className: 'object', id: 'object_five' }),
	                            React.createElement('div', { className: 'object', id: 'object_six' }),
	                            React.createElement('div', { className: 'object', id: 'object_seven' }),
	                            React.createElement('div', { className: 'object', id: 'object_eight' })
	                        )
	                    )
	                );
	            }
	        }
	    }, {
	        key: 'removeText',
	        get: function get() {
	            var dream = this.state.dream;


	            if (dream.isowner) {
	                if (!dream.isremove) {
	                    return React.createElement(
	                        'a',
	                        { href: 'javascript:;',
	                            onClick: this.deleteDream.bind(this)
	                        },
	                        React.createElement('i', { className: 's s-remove s-lg' }),
	                        '\u5220\u9664'
	                    );
	                } else {
	                    return React.createElement(
	                        'span',
	                        null,
	                        '\u5DF2\u5220\u9664'
	                    );
	                }
	            } else {
	                return null;
	            }
	        }
	    }]);
	    return TextViewer;
	}(React.Component);

	var _default = TextViewer;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(TextViewer, 'TextViewer', 'E:/mypro/tyxb/src/TextViewer.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/tyxb/src/TextViewer.js');
	}();

	;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof2 = __webpack_require__(24);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function (root, factory) {
	    if (true) {
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof module === 'undefined' ? 'undefined' : (0, _typeof3.default)(module)) === 'object' && module.exports) {
	        // Node. Does not work with strict CommonJS, but
	        // only CommonJS-like environments that support module.exports,
	        // like Node.
	        module.exports = factory();
	    } else {
	        // Browser globals (root is window)
	        root.striptags = factory();
	    }
	})(undefined, function () {
	    var STATE_OUTPUT = 0,
	        STATE_HTML = 1,
	        STATE_PRE_COMMENT = 2,
	        STATE_COMMENT = 3,
	        WHITESPACE = /\s/,
	        ALLOWED_TAGS_REGEX = /<(\w*)>/g;

	    function striptags(html, allowableTags) {
	        var html = html || '',
	            state = STATE_OUTPUT,
	            depth = 0,
	            output = '',
	            tagBuffer = '',
	            inQuote = false,
	            i,
	            length,
	            c;

	        if (typeof allowableTags === 'string') {
	            // Parse the string into an array of tags
	            allowableTags = parseAllowableTags(allowableTags);
	        } else if (!Array.isArray(allowableTags)) {
	            // If it is not an array, explicitly set to null
	            allowableTags = null;
	        }

	        for (i = 0, length = html.length; i < length; i++) {
	            c = html[i];

	            switch (c) {
	                case '<':
	                    {
	                        // ignore '<' if inside a quote
	                        if (inQuote) {
	                            break;
	                        }

	                        // '<' followed by a space is not a valid tag, continue
	                        if (html[i + 1] == ' ') {
	                            consumeCharacter(c);
	                            break;
	                        }

	                        // change to STATE_HTML
	                        if (state == STATE_OUTPUT) {
	                            state = STATE_HTML;

	                            consumeCharacter(c);
	                            break;
	                        }

	                        // ignore additional '<' characters when inside a tag
	                        if (state == STATE_HTML) {
	                            depth++;
	                            break;
	                        }

	                        consumeCharacter(c);
	                        break;
	                    }

	                case '>':
	                    {
	                        // something like this is happening: '<<>>'
	                        if (depth) {
	                            depth--;
	                            break;
	                        }

	                        // ignore '>' if inside a quote
	                        if (inQuote) {
	                            break;
	                        }

	                        // an HTML tag was closed
	                        if (state == STATE_HTML) {
	                            inQuote = state = 0;

	                            if (allowableTags) {
	                                tagBuffer += '>';
	                                flushTagBuffer();
	                            }

	                            break;
	                        }

	                        // '<!' met its ending '>'
	                        if (state == STATE_PRE_COMMENT) {
	                            inQuote = state = 0;
	                            tagBuffer = '';
	                            break;
	                        }

	                        // if last two characters were '--', then end comment
	                        if (state == STATE_COMMENT && html[i - 1] == '-' && html[i - 2] == '-') {

	                            inQuote = state = 0;
	                            tagBuffer = '';
	                            break;
	                        }

	                        consumeCharacter(c);
	                        break;
	                    }

	                // catch both single and double quotes
	                case '"':
	                case '\'':
	                    {
	                        if (state == STATE_HTML) {
	                            if (inQuote == c) {
	                                // end quote found
	                                inQuote = false;
	                            } else if (!inQuote) {
	                                // start quote only if not already in one
	                                inQuote = c;
	                            }
	                        }

	                        consumeCharacter(c);
	                        break;
	                    }

	                case '!':
	                    {
	                        if (state == STATE_HTML && html[i - 1] == '<') {

	                            // looks like we might be starting a comment
	                            state = STATE_PRE_COMMENT;
	                            break;
	                        }

	                        consumeCharacter(c);
	                        break;
	                    }

	                case '-':
	                    {
	                        // if the previous two characters were '!-', this is a comment
	                        if (state == STATE_PRE_COMMENT && html[i - 1] == '-' && html[i - 2] == '!') {

	                            state = STATE_COMMENT;
	                            break;
	                        }

	                        consumeCharacter(c);
	                        break;
	                    }

	                case 'E':
	                case 'e':
	                    {
	                        // check for DOCTYPE, because it looks like a comment and isn't
	                        if (state == STATE_PRE_COMMENT && html.substr(i - 6, 7).toLowerCase() == 'doctype') {

	                            state = STATE_HTML;
	                            break;
	                        }

	                        consumeCharacter(c);
	                        break;
	                    }

	                default:
	                    {
	                        consumeCharacter(c);
	                    }
	            }
	        }

	        function consumeCharacter(c) {
	            if (state == STATE_OUTPUT) {
	                output += c;
	            } else if (allowableTags && state == STATE_HTML) {
	                tagBuffer += c;
	            }
	        }

	        function flushTagBuffer() {
	            var normalized = '',
	                nonWhitespaceSeen = false,
	                i,
	                length,
	                c;

	            normalizeTagBuffer: for (i = 0, length = tagBuffer.length; i < length; i++) {
	                c = tagBuffer[i].toLowerCase();

	                switch (c) {
	                    case '<':
	                        {
	                            break;
	                        }

	                    case '>':
	                        {
	                            break normalizeTagBuffer;
	                        }

	                    case '/':
	                        {
	                            nonWhitespaceSeen = true;
	                            break;
	                        }

	                    default:
	                        {
	                            if (!c.match(WHITESPACE)) {
	                                nonWhitespaceSeen = true;
	                                normalized += c;
	                            } else if (nonWhitespaceSeen) {
	                                break normalizeTagBuffer;
	                            }
	                        }
	                }
	            }

	            if (allowableTags.indexOf(normalized) !== -1) {
	                output += tagBuffer;
	            }

	            tagBuffer = '';
	        }

	        return output;
	    }

	    /**
	     * Return an array containing tags that are allowed to pass through the
	     * algorithm.
	     *
	     * @param string allowableTags A string of tags to allow (e.g. "<b><strong>").
	     * @return array|null An array of allowed tags or null if none.
	     */
	    function parseAllowableTags(allowableTags) {
	        var tagsArray = [],
	            match;

	        while ((match = ALLOWED_TAGS_REGEX.exec(allowableTags)) !== null) {
	            tagsArray.push(match[1]);
	        }

	        return tagsArray.length !== 0 ? tagsArray : null;
	    }

	    return striptags;
	});
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(124), __esModule: true };

/***/ }),
/* 123 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (obj, keys) {
	  var target = {};

	  for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
	    target[i] = obj[i];
	  }

	  return target;
	};

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(126);
	module.exports = __webpack_require__(3).Object.assign;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(20)
	  , gOPS     = __webpack_require__(42)
	  , pIE      = __webpack_require__(25)
	  , toObject = __webpack_require__(43)
	  , IObject  = __webpack_require__(61)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(17)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(14);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(125)});

/***/ }),
/* 127 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (false) {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	var emptyFunction = __webpack_require__(127);
	var invariant = __webpack_require__(128);
	var ReactPropTypesSecret = __webpack_require__(131);

	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,

	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim
	  };

	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	if (false) {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;

	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(129)();
	}


/***/ }),
/* 131 */
/***/ (function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ })
/******/ ]);