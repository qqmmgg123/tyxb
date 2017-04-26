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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function (factory) {
	    module.exports = factory(__webpack_require__(12), __webpack_require__(17).default, __webpack_require__(56).default, __webpack_require__(95), __webpack_require__(58), __webpack_require__(57), __webpack_require__(114));
	})(function (utils, req, effect, common, popup, dropdown, dreamTpl) {
	    // 发布文字
	    var drtBtn = document.querySelector('#dreamReleaseText');
	    drtBtn && drtBtn.addEventListener('click', common.textNew.bind(common, false));

	    // 排序下拉
	    var sortSelect = dropdown.create({
	        el: '[rel="nav-toggle"]',
	        container: '#dream-tab-bar',
	        selector: '.tab-nav',
	        menu: '.nav-list',
	        modal: true
	    });

	    var orderSelect = dropdown.create({
	        el: '[rel="order-select"]',
	        container: '#dream-tab-bar',
	        modal: true
	    });

	    // 刷新按钮
	    var rfBtn = document.querySelector('#dream-refresh');
	    rfBtn && rfBtn.addEventListener('click', function () {
	        utils.addClass(this, 'spin');
	        window.location.reload();
	    });

	    // 分享下拉
	    var shareSelect = dropdown.shareDrop({
	        el: '[rel="dream-share"]',
	        container: '#dream-list',
	        modal: true
	    });

	    // 更多操作下拉
	    var moreCtrlSelect = dropdown.create({
	        el: '.more-ctrl-toggle',
	        container: '#dream-list',
	        selector: '.post-ctrl',
	        menu: '.more-ctrl-box',
	        modal: true
	    });

	    // 支持
	    var dreamList = document.querySelector('#dream-list');
	    dreamList && dreamList.addEventListener('click', function (ev) {
	        var cur = ev.target;

	        while (cur.getAttribute && ['dream-good', 'dream-bad', 'dream-favourite', 'dream-delete', 'dream-picsrc'].indexOf(cur.getAttribute('rel')) === -1 && cur.parentNode && cur.parentNode !== ev.currentTarget) {
	            cur = cur.parentNode;
	        }

	        if (cur.getAttribute && cur.getAttribute('rel')) {
	            var rel = cur.getAttribute('rel'),
	                did = utils.getData(cur, 'did');

	            if (rel === 'dream-good') {
	                var voteBox = utils.closest(cur, '.vote-ctrl-box'),
	                    voteNum,
	                    voteBad,
	                    hasGood = utils.getData(cur, 'hasgood');

	                voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
	                voteBox && (voteBad = voteBox.querySelector('[rel="dream-bad"]'));
	                if (!hasGood) {
	                    req.post("/dream/goodit", {
	                        did: did
	                    }, function (data) {
	                        switch (data.result) {
	                            case 0:
	                                if (data.data) {
	                                    var num = parseInt(data.data.num);
	                                    utils.addClass(cur.querySelector('i'), "s-ac");
	                                    utils.setData(cur, { 'hasgood': true });
	                                    voteNum.innerHTML = isNaN(num) ? 0 : num;
	                                    voteBad && utils.removeClass(voteBad.querySelector('i'), "s-ac");
	                                    voteBad && utils.setData(voteBad, { 'hasbad': false });
	                                }
	                                break;
	                            case 1:
	                                alert(data.info);
	                                break;
	                            case 2:
	                                common.showSigninPop();
	                                break;
	                            default:
	                                break;
	                        }
	                    }, function () {});
	                } else {
	                    req.post("/dream/cgood", {
	                        did: did
	                    }, function (data) {
	                        switch (data.result) {
	                            case 0:
	                                if (data.data) {
	                                    var num = parseInt(data.data.num);
	                                    utils.removeClass(cur.querySelector('i'), "s-ac");
	                                    utils.setData(cur, { 'hasgood': false });
	                                    voteNum.innerHTML = isNaN(num) ? 0 : num;
	                                }
	                                break;
	                            case 1:
	                                alert(data.info);
	                                break;
	                            case 2:
	                                common.showSigninPop();
	                                break;
	                            default:
	                                break;
	                        }
	                    }, function () {});
	                }
	            }
	            // 反对
	            else if (rel === 'dream-bad') {
	                    var voteBox = utils.closest(cur, '.vote-ctrl-box'),
	                        voteNum,
	                        voteGood,
	                        hasBad = utils.getData(cur, 'hasbad');

	                    voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
	                    voteBox && (voteGood = voteBox.querySelector('[rel="dream-good"]'));

	                    if (!hasBad) {
	                        req.post("/dream/badit", {
	                            did: did
	                        }, function (data) {
	                            switch (data.result) {
	                                case 0:
	                                    if (data.data) {
	                                        var num = parseInt(data.data.num);
	                                        utils.addClass(cur.querySelector('i'), "s-ac");
	                                        utils.setData(cur, { 'hasbad': true });
	                                        voteNum.innerHTML = isNaN(num) ? 0 : num;;
	                                        voteGood && utils.removeClass(voteGood.querySelector('i'), "s-ac");
	                                        voteGood && utils.setData(voteGood, { 'hasgood': false });
	                                    }
	                                    break;
	                                case 1:
	                                    alert(data.info);
	                                    break;
	                                case 2:
	                                    common.showSigninPop();
	                                    break;
	                                default:
	                                    break;
	                            }
	                        }, function () {});
	                    } else {
	                        req.post("/dream/cbad", {
	                            did: did
	                        }, function (data) {
	                            switch (data.result) {
	                                case 0:
	                                    if (data.data) {
	                                        var num = parseInt(data.data.num);
	                                        utils.removeClass(cur.querySelector('i'), "s-ac");
	                                        utils.setData(cur, { 'hasbad': false });
	                                        voteNum.innerHTML = isNaN(num) ? 0 : num;
	                                    }
	                                    break;
	                                case 1:
	                                    alert(data.info);
	                                    break;
	                                case 2:
	                                    common.showSigninPop();
	                                    break;
	                                default:
	                                    break;
	                            }
	                        }, function () {});
	                    }
	                }
	                // 收藏/取消收藏
	                else if (rel === 'dream-favourite') {
	                        var hasFav = utils.getData(cur, 'hasfav');

	                        if (!hasFav) {
	                            req.post("/dream/following", {
	                                did: did
	                            }, function (data) {
	                                switch (data.result) {
	                                    case 0:
	                                        cur.innerHTML = "已收藏";
	                                        utils.setData(cur, { 'hasfav': true });
	                                        break;
	                                    case 1:
	                                        alert(data.info);
	                                        break;
	                                    case 2:
	                                        common.showSigninPop();
	                                        break;
	                                    default:
	                                        break;
	                                }
	                            }, function () {});
	                        } else {
	                            req.post("/dream/cfollowing", {
	                                did: did
	                            }, function (data) {
	                                switch (data.result) {
	                                    case 0:
	                                        cur.innerHTML = "收藏";
	                                        utils.setData(cur, { 'hasfav': false });
	                                        break;
	                                    case 1:
	                                        alert(data.info);
	                                        break;
	                                    case 2:
	                                        common.showSigninPop();
	                                        break;
	                                    default:
	                                        break;
	                                }
	                            }, function () {});
	                        }
	                    }
	                    // 删除想法
	                    else if (rel === 'dream-delete') {
	                            var curDreamItem = utils.closest(cur, '.list-item');
	                            req.post("/dream/delete", {
	                                did: did
	                            }, function (data) {
	                                switch (data.result) {
	                                    case 0:
	                                        effect.fadeOut(curDreamItem, function (el) {
	                                            el.parentNode.removeChild(el);
	                                        });
	                                        break;
	                                    case 1:
	                                        alert(data.info);
	                                        break;
	                                    case 2:
	                                        common.showSigninPop();
	                                        break;
	                                    default:
	                                        break;
	                                };
	                            }, function () {});
	                        } else if (rel === 'dream-picsrc') {
	                            ev.preventdefault;

	                            var thumbs = utils.closest(cur, '.thumbnail'),
	                                preview = thumbs.nextElementSibling,
	                                thumb = cur.querySelector('img'),
	                                show = utils.getData(cur, 'show');

	                            if (!preview) return;

	                            if (!show) {
	                                thumbs.querySelectorAll('li').forEach(function (img) {
	                                    utils.setData(img, { 'show': false });
	                                });
	                                utils.setData(cur, { 'show': true });
	                                var img = new Image();
	                                img.src = thumb.src.replace('picmini', 'pic');

	                                preview.innerHTML = "<p>图片预览加载中...</p>";
	                                if (img.complete) {
	                                    preview.innerHTML = "";
	                                    preview.appendChild(img);
	                                    return;
	                                }
	                                img.onload = function () {
	                                    preview.querySelector('p').style.display = "none";
	                                    preview.appendChild(img);
	                                };
	                            } else {
	                                utils.setData(cur, { 'show': false });
	                                preview.innerHTML = "";
	                            }
	                        }
	        }
	    });

	    // 留言列表
	    var commentList = {
	        selector: '#commentList',
	        climit: 10,
	        init: function init() {
	            this.el = document.querySelector(this.selector);
	            if (!this.el) return;

	            this.bindEvent();
	        },
	        bindEvent: function bindEvent() {
	            var self = this;

	            var selectors = ['[rel="comment-delete"]', '[rel="comment-good"]', '[rel="comment-bad"]'],
	                handles = [this.commentDelete, this.commentUp, this.commentDown];
	            this.el.addEventListener('click', function (ev) {
	                var el = ev.target,
	                    matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

	                while (el && el !== ev.currentTarget) {
	                    for (var i = 0, l = selectors.length; i < l; i++) {
	                        var selector = selectors[i],
	                            handle = handles[i];

	                        if (matchesSelector.call(el, selector)) {
	                            handle.call(self, ev, el);
	                            break;
	                        }
	                    }
	                    el = el.parentElement;
	                }
	            });
	        },
	        commentUp: function commentUp(ev, cur) {
	            var item = utils.closest(cur, '.comment-ctrl'),
	                cid = utils.getData(item, 'rid'),
	                voteBox = utils.closest(cur, '.vote-ctrl-box'),
	                voteNum,
	                voteBad,
	                hasGood = utils.getData(cur, 'hasgood');

	            voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
	            voteBox && (voteBad = voteBox.querySelector('[rel="comment-bad"]'));
	            if (!hasGood) {
	                req.post("/comment/goodit", {
	                    cid: cid
	                }, function (data) {
	                    switch (data.result) {
	                        case 0:
	                            if (data.data) {
	                                var num = parseInt(data.data.num);
	                                utils.addClass(cur.querySelector('i'), "s-ac");
	                                utils.setData(cur, { 'hasgood': true });
	                                voteNum.innerHTML = isNaN(num) ? 0 : num;
	                                voteBad && utils.removeClass(voteBad.querySelector('i'), "s-ac");
	                                voteBad && utils.setData(voteBad, { 'hasbad': false });
	                            }
	                            break;
	                        case 1:
	                            alert(data.info);
	                            break;
	                        case 2:
	                            common.showSigninPop();
	                            break;
	                        default:
	                            break;
	                    }
	                }, function () {});
	            } else {
	                req.post("/comment/cgood", {
	                    cid: cid
	                }, function (data) {
	                    switch (data.result) {
	                        case 0:
	                            if (data.data) {
	                                var num = parseInt(data.data.num);
	                                utils.removeClass(cur.querySelector('i'), "s-ac");
	                                utils.setData(cur, { 'hasgood': false });
	                                voteNum.innerHTML = isNaN(num) ? 0 : num;
	                            }
	                            break;
	                        case 1:
	                            alert(data.info);
	                            break;
	                        case 2:
	                            common.showSigninPop();
	                            break;
	                        default:
	                            break;
	                    }
	                }, function () {});
	            }
	        },
	        commentDown: function commentDown(ev, cur) {
	            var item = utils.closest(cur, '.comment-ctrl'),
	                cid = utils.getData(item, 'rid'),
	                voteBox = utils.closest(cur, '.vote-ctrl-box'),
	                voteNum,
	                voteGood,
	                hasBad = utils.getData(cur, 'hasbad');

	            voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
	            voteBox && (voteGood = voteBox.querySelector('[rel="comment-good"]'));

	            if (!hasBad) {
	                req.post("/comment/badit", {
	                    cid: cid
	                }, function (data) {
	                    switch (data.result) {
	                        case 0:
	                            if (data.data) {
	                                var num = parseInt(data.data.num);
	                                utils.addClass(cur.querySelector('i'), "s-ac");
	                                utils.setData(cur, { 'hasbad': true });
	                                voteNum.innerHTML = isNaN(num) ? 0 : num;;
	                                voteGood && utils.removeClass(voteGood.querySelector('i'), "s-ac");
	                                voteGood && utils.setData(voteGood, { 'hasgood': false });
	                            }
	                            break;
	                        case 1:
	                            alert(data.info);
	                            break;
	                        case 2:
	                            common.showSigninPop();
	                            break;
	                        default:
	                            break;
	                    }
	                }, function () {});
	            } else {
	                req.post("/comment/cbad", {
	                    cid: cid
	                }, function (data) {
	                    switch (data.result) {
	                        case 0:
	                            if (data.data) {
	                                var num = parseInt(data.data.num);
	                                utils.removeClass(cur.querySelector('i'), "s-ac");
	                                utils.setData(cur, { 'hasbad': false });
	                                voteNum.innerHTML = isNaN(num) ? 0 : num;
	                            }
	                            break;
	                        case 1:
	                            alert(data.info);
	                            break;
	                        case 2:
	                            common.showSigninPop();
	                            break;
	                        default:
	                            break;
	                    }
	                }, function () {});
	            }
	        },
	        commentDelete: function commentDelete(ev, cur) {
	            // 删除留言
	            var item = utils.closest(cur, '.list-item'),
	                con = item.querySelector('.comment-content'),
	                cid = utils.getData(cur, 'cid');

	            req.post("/comment/delete", {
	                cid: cid
	            }, function (data) {
	                common.xhrReponseManage(data, function (data) {
	                    utils.addClass(con, 'no-exist-content');
	                    con.innerHTML = '[该留言已删除]';
	                    var state = document.createElement('span');
	                    state.innerHTML = '已删除';
	                    cur.replaceWith(state);
	                });
	            }, function () {});
	        }
	    };

	    commentList.init();

	    common.statistics();
	});
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ },
/* 1 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 2 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(73)
	  , defined = __webpack_require__(20);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(60);

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(13)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(15)
	  , IE8_DOM_DEFINE = __webpack_require__(41)
	  , toPrimitive    = __webpack_require__(29)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(8)
	  , createDesc = __webpack_require__(18);
	module.exports = __webpack_require__(6) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(27)('wks')
	  , uid        = __webpack_require__(19)
	  , Symbol     = __webpack_require__(2).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(2)
	  , core      = __webpack_require__(1)
	  , ctx       = __webpack_require__(47)
	  , hide      = __webpack_require__(9)
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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

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
	        isValidEmail: function isValidEmail(emailAddress) {
	            var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	            return pattern.test(emailAddress);
	        },
	        isUserName: function isUserName(name) {
	            var pattern = /^(\w|_){6,12}$/i;
	            return pattern.test(name);
	        },
	        isNickName: function isNickName(name) {
	            var pattern = /^[\w|\u4e00-\u9fa5]{2,12}$/i;
	            return pattern.test(name);
	        },
	        isPassword: function isPassword(pwd) {
	            var pattern = /^\w{6,16}$/i;
	            return pattern.test(pwd);
	        },
	        isTag: function isTag(name) {
	            var pattern = /^[\w|\u4e00-\u9fa5]{1,24}$/i;
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

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(45)
	  , enumBugKeys = __webpack_require__(21);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _keys = __webpack_require__(61);

	var _keys2 = _interopRequireDefault(_keys);

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

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
	                params = (0, _keys2.default)(data).map(function (o) {
	                    return o + '=' + data[o];
	                }).join('&');
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

	    __REACT_HOT_LOADER__.register(Req, "Req", "E:/mypro/suopoearth/suopoearth/mobilesrc/req.js");

	    __REACT_HOT_LOADER__.register(req, "req", "E:/mypro/suopoearth/suopoearth/mobilesrc/req.js");

	    __REACT_HOT_LOADER__.register(_default, "default", "E:/mypro/suopoearth/suopoearth/mobilesrc/req.js");
	}();

	;

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 24 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(8).f
	  , has = __webpack_require__(7)
	  , TAG = __webpack_require__(10)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(27)('keys')
	  , uid    = __webpack_require__(19);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(2)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
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

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(2)
	  , core           = __webpack_require__(1)
	  , LIBRARY        = __webpack_require__(23)
	  , wksExt         = __webpack_require__(31)
	  , defineProperty = __webpack_require__(8).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(10);

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(15)
	  , dPs         = __webpack_require__(79)
	  , enumBugKeys = __webpack_require__(21)
	  , IE_PROTO    = __webpack_require__(26)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(40)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(72).appendChild(iframe);
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


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(20);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(63);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(62);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(24)
	  , createDesc     = __webpack_require__(18)
	  , toIObject      = __webpack_require__(3)
	  , toPrimitive    = __webpack_require__(29)
	  , has            = __webpack_require__(7)
	  , IE8_DOM_DEFINE = __webpack_require__(41)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(11)
	  , core    = __webpack_require__(1)
	  , fails   = __webpack_require__(13);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(102), __esModule: true };

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var settings = {
	    COPY_RIGHT: "© 2017 娑婆诃",
	    APP_NAME: "太阳の小报",
	    CASE_NUMBER: "粤ICP备16089330号-1",
	    DOMAIN: 'www.suopoearth.com',
	    SLOGAN: "~指引我们前进的方向→",
	    UNKNOW_ERR: '异常错误',
	    PARAMS_PASSED_ERR_TIPS: "参数传递错误!",
	    USER_EXISTS_TIPS: "对不起，该用户已经存在，请重新尝试",
	    PAGE_NOT_FOND_TIPS: "该页面不存在",
	    USER_NOT_EXIST_TIPS: "该用户不存在",
	    DREAM_NOT_EXIST_TIPS: "抱歉，你查看的内容不存在",
	    TAG_EXIST_ERR: "该版面已经存在，不能重复创建了",
	    TAG_MORE_ERR: "抱歉，目前一个用户只能创建3个版面，可以留给他人些机会，版面名称是唯一的，也请谨慎创建",
	    COMMENT_REQUIRE_ERR: "回复不能为空",
	    NICK_NAME_VALIDATION: "必须是由2~12个小写字母、数字、中文组成",
	    PASSWORD_VALIDATION: "必须是6~16个字符的小写字母或数字组成",
	    BUILDING_WORD: "该功能正在建设中，敬请谅解太阳の小报小站长一个人战斗，会累死~抱歉",
	    DREAM_PASS_ERROR: '您的发布的内容由于不符合本版面或本站的发文规则，因此被该版面驳回，敬请谅解。',
	    SUBSCRIBE: '订阅 +',
	    CANCEL_SUBSCRIBE: '取消订阅 -',
	    COMMENT_TEXT: {
	        EXPANSION_COMMENT: '回复'
	    },

	    OBJEXT_TYPE: {
	        DREAM      : 0, // 想法
	        COMMENT    : 1  // 留言
	    },

	    OBJECT: {
	        DREAM: {
	            CNNAME: '文章'
	        },
	        TAG: {
	            CNNAME: '版面'
	        }
	    },

	    SORT_ROLE: {
	        HOT       : 1,  // 好评
	        NEW       : 2   // 最新
	    },

	    REGISTRATION: {
	        WORDING: "欢迎使用太阳の小报~"
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


/***/ },
/* 39 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16)
	  , document = __webpack_require__(2).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(6) && !__webpack_require__(13)(function(){
	  return Object.defineProperty(__webpack_require__(40)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(23)
	  , $export        = __webpack_require__(11)
	  , redefine       = __webpack_require__(46)
	  , hide           = __webpack_require__(9)
	  , has            = __webpack_require__(7)
	  , Iterators      = __webpack_require__(22)
	  , $iterCreate    = __webpack_require__(75)
	  , setToStringTag = __webpack_require__(25)
	  , getPrototypeOf = __webpack_require__(48)
	  , ITERATOR       = __webpack_require__(10)('iterator')
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

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(45)
	  , hiddenKeys = __webpack_require__(21).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(7)
	  , toIObject    = __webpack_require__(3)
	  , arrayIndexOf = __webpack_require__(70)(false)
	  , IE_PROTO     = __webpack_require__(26)('IE_PROTO');

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

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(68);
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

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(7)
	  , toObject    = __webpack_require__(33)
	  , IE_PROTO    = __webpack_require__(26)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

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

	    __REACT_HOT_LOADER__.register(Tools, "Tools", "E:/mypro/suopoearth/suopoearth/mobilesrc/tools.js");

	    __REACT_HOT_LOADER__.register(tools, "tools", "E:/mypro/suopoearth/suopoearth/mobilesrc/tools.js");

	    __REACT_HOT_LOADER__.register(_default, "default", "E:/mypro/suopoearth/suopoearth/mobilesrc/tools.js");
	}();

	;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _getPrototypeOf = __webpack_require__(37);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _getOwnPropertyDescriptor = __webpack_require__(98);

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

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(99);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(97);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(34);

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

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(34);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = __webpack_require__(34);

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
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

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

	    __REACT_HOT_LOADER__.register(Effect, 'Effect', 'E:/mypro/suopoearth/suopoearth/mobilesrc/effect.js');

	    __REACT_HOT_LOADER__.register(effect, 'effect', 'E:/mypro/suopoearth/suopoearth/mobilesrc/effect.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/suopoearth/suopoearth/mobilesrc/effect.js');
	}();

	;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.shareDrop = exports.create = undefined;

	var _getPrototypeOf = __webpack_require__(37);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _get2 = __webpack_require__(50);

	var _get3 = _interopRequireDefault(_get2);

	var _inherits2 = __webpack_require__(51);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * @fileOverview 下拉
	 * @version 0.1
	 * @author minggangqiu
	 */
	var utils = __webpack_require__(12);
	var Share = __webpack_require__(94);
	var dropdown = __webpack_require__(109);

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
	            this.width = opts.width || 180;

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

	    __REACT_HOT_LOADER__.register(DropDown, 'DropDown', 'E:/mypro/suopoearth/suopoearth/mobilesrc/dropdown.js');

	    __REACT_HOT_LOADER__.register(ShareDropDown, 'ShareDropDown', 'E:/mypro/suopoearth/suopoearth/mobilesrc/dropdown.js');

	    __REACT_HOT_LOADER__.register(create, 'create', 'E:/mypro/suopoearth/suopoearth/mobilesrc/dropdown.js');

	    __REACT_HOT_LOADER__.register(shareDrop, 'shareDrop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/dropdown.js');
	}();

	;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.presidentPop = exports.tagNewPop = exports.registrationPop = exports.textNewPop = exports.popup = undefined;

	var _get2 = __webpack_require__(50);

	var _get3 = _interopRequireDefault(_get2);

	var _getPrototypeOf = __webpack_require__(37);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(52);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(51);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(53);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(54);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _keyboard = __webpack_require__(96);

	var _keyboard2 = _interopRequireDefault(_keyboard);

	var _autocomplete = __webpack_require__(93);

	var _autocomplete2 = _interopRequireDefault(_autocomplete);

	var _req = __webpack_require__(17);

	var _req2 = _interopRequireDefault(_req);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var settings = __webpack_require__(38); /*
	                                              * @fileOverview 弹出窗口
	                                              * @version 0.1
	                                              * @author minggangqiu
	                                              */

	var utils = __webpack_require__(12);
	var v = __webpack_require__(59);
	var picpop = __webpack_require__(110);
	var wintpl = __webpack_require__(113);
	var registration = __webpack_require__(111);
	var tagnewtpl = __webpack_require__(112);

	var INDENT = '  ';
	var BREAK = '<br/>';

	var FinishBtn = function (_React$Component) {
	    (0, _inherits3.default)(FinishBtn, _React$Component);

	    function FinishBtn(props) {
	        (0, _classCallCheck3.default)(this, FinishBtn);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (FinishBtn.__proto__ || (0, _getPrototypeOf2.default)(FinishBtn)).call(this, props));

	        _this.handleClick = _this.handleClick.bind(_this);
	        return _this;
	    }

	    (0, _createClass3.default)(FinishBtn, [{
	        key: 'handleClick',
	        value: function handleClick() {
	            this.props.onFinishClick();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'button',
	                { id: 'finish_cdream_btn', onClick: this.handleClick, type: 'button', className: 'btn' },
	                '\u5206\u4EAB > '
	            );
	        }
	    }]);
	    return FinishBtn;
	}(_react2.default.Component);

	var MyTagList = function (_React$Component2) {
	    (0, _inherits3.default)(MyTagList, _React$Component2);

	    function MyTagList(props) {
	        (0, _classCallCheck3.default)(this, MyTagList);
	        return (0, _possibleConstructorReturn3.default)(this, (MyTagList.__proto__ || (0, _getPrototypeOf2.default)(MyTagList)).call(this, props));
	    }

	    (0, _createClass3.default)(MyTagList, [{
	        key: 'render',
	        value: function render() {
	            console.log(this.props.tags);

	            return _react2.default.createElement(
	                'ul',
	                null,
	                this.props.tags.map(function (tag, index) {
	                    return _react2.default.createElement(
	                        'li',
	                        { key: index },
	                        _react2.default.createElement(
	                            'a',
	                            { href: 'javascript:;', 'data-tid': tag._id },
	                            tag.key
	                        )
	                    );
	                })
	            );
	        }
	    }]);
	    return MyTagList;
	}(_react2.default.Component);

	var DreamForm = function (_React$Component3) {
	    (0, _inherits3.default)(DreamForm, _React$Component3);

	    function DreamForm(props) {
	        (0, _classCallCheck3.default)(this, DreamForm);

	        var _this3 = (0, _possibleConstructorReturn3.default)(this, (DreamForm.__proto__ || (0, _getPrototypeOf2.default)(DreamForm)).call(this, props));

	        _this3.tagCheckPassed = false;
	        _this3.images = [];
	        _this3.btnDis = true;

	        return _this3;
	    }

	    (0, _createClass3.default)(DreamForm, [{
	        key: 'encodeContent',
	        value: function encodeContent(text) {
	            return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join(BREAK + '\n');
	        }
	    }, {
	        key: 'encodeAttr',
	        value: function encodeAttr(text) {
	            return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
	        }
	    }, {
	        key: 'xhrReponseManage',
	        value: function xhrReponseManage(data, callback) {
	            var self = this;
	            switch (data.result) {
	                case 0:
	                    callback(data);
	                    break;
	                case 1:
	                    alert(data.info);
	                    break;
	                case 2:
	                    registrationPop({
	                        cur: 'signin'
	                    }).show();
	                    break;
	                default:
	                    break;
	            };
	        }
	    }, {
	        key: 'tagCheckStart',
	        value: function tagCheckStart() {
	            this.btnDis = true;
	            this._tagInfo.innerHTML = '版面信息加载中...';
	            this._tagInfo.style.display = 'block';
	        }
	    }, {
	        key: 'tagCheckEnd',
	        value: function tagCheckEnd(key, cb) {
	            if (typeof key != 'string') {
	                this.btnDis = false;
	                this._tagInfo.innerHTML = '';
	                this._tagInfo.style.display = 'none';
	                return;
	            };

	            var self = this,
	                tagInfo = this._tagInfo;

	            this._tagInfo.className = 'alert';
	            if (key) {
	                self.tagCheckPassed = true;
	                tagInfo.innerHTML = ['<h3>您的贴文将发布到”' + key + '“</h3>', '<p>该版面版主功能即将开放，敬请关注，</p>', '<p>也因此抱歉，当前暂时无法制定版面规则。<p>'].join('');
	                utils.addClass(tagInfo, 'alert-success');
	                self.tagDescModify = self._popbd.querySelector('#tagDescModify');
	                self.tagDescModify && self.tagDescModify.addEventListener('change', function () {
	                    self._popbd.querySelector('#tagDescInput').style.display = '';
	                });
	                self.btnDis = false;
	                if (cb) {
	                    cb.call(self);
	                }
	            } else {
	                self.tagCheckPassed = false;
	                tagInfo.innerHTML = ['<div>', '您选择的版面不存在，如需创建，请点击', '<a href="/tag/hot" class="btn">去创建 ></a>', '</div>'].join('');
	                utils.addClass(tagInfo, 'alert-warning');
	            }
	        }
	    }, {
	        key: 'checkTag',
	        value: function checkTag(newKey, cb) {
	            var self = this,
	                inp = this._dreamTagInp,
	                key = inp.value.trim(),
	                newKey = newKey.trim();

	            if (typeof newKey !== 'string' && newKey.length === 0) return;

	            var tagInfo = self._tagInfo;
	            if (key !== newKey) {
	                self.btnDis = true;
	                tagInfo.innerHTML = '版面信息加载中...';
	                tagInfo.style.display = 'block';
	                _req2.default.getJSON('/search/tag', { key: newKey }, function (data) {
	                    self.xhrReponseManage(data, function (data) {
	                        var data = data.data;

	                        if (data.tag) {
	                            self.tagCheckEnd(newKey, cb);
	                        } else {
	                            self.tagCheckEnd('');
	                        }
	                    });
	                });
	            } else {
	                if (cb) {
	                    if (self.tagCheckPassed) {
	                        cb.call(self);
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'tagSelected',
	        value: function tagSelected(e) {
	            var self = this,
	                ctag = e.target,
	                tagSelect = e.currentTarget;
	            if (ctag && ctag.nodeName.toLowerCase() == "a") {
	                var newKey = ctag.lastChild.nodeValue.trim();
	                self.checkTag(newKey);
	                self._dreamTagInp.value = newKey;
	            }
	        }
	    }, {
	        key: 'onAddImage',
	        value: function onAddImage() {
	            this._imageUpload.click();
	        }
	    }, {
	        key: 'uploadImage',
	        value: function uploadImage(ev) {
	            if (this.images.length >= 6) {
	                alert("一次上传图片不能超过6张.");
	                return;
	            }

	            var self = this;
	            var file = ev.target.files[0];
	            var fd = new FormData();
	            fd.append("pic", file);
	            var xhr = new XMLHttpRequest();
	            xhr.open('POST', '/pic/upload', true);
	            xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

	            xhr.upload.onprogress = function (e) {
	                if (e.lengthComputable) {
	                    var percentComplete = e.loaded / e.total * 100;
	                    console.log(percentComplete + '% uploaded');
	                }
	            };
	            xhr.onload = function () {
	                if (this.status == 200) {
	                    var resp = JSON.parse(this.response);
	                    var url = resp.dataUrl;
	                    self.images.push(url);

	                    var li = document.createElement('li');
	                    li.innerHTML = '<img src="' + url.replace('/pic/', '/picmini/') + '" />';

	                    self._picList.insertBefore(li, self._picList.children[0]);
	                };
	            };
	            xhr.send(fd);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this4 = this;

	            var _ref = [],
	                MyTags = _ref[0],
	                _ref$ = _ref[1],
	                tags = _ref$ === undefined ? this.props.tags : _ref$,
	                selTips = "请选择" + settings.OBJECT.TAG.CNNAME;


	            if (tags && tags.length > 0) {
	                MyTags = _react2.default.createElement(MyTagList, { tags: tags });
	            }

	            return _react2.default.createElement(
	                'div',
	                { ref: function ref(popbd) {
	                        _this4._popbd = popbd;
	                    }, className: 'dream-area' },
	                _react2.default.createElement(
	                    'form',
	                    { id: 'deamcreat-form', action: '/dream/new', method: 'post' },
	                    _react2.default.createElement('div', { ref: function ref(createInfo) {
	                            _this4._createInfo = createInfo;
	                        }, className: 'alert', style: { display: "none" } }),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'title-head' },
	                        _react2.default.createElement(
	                            'span',
	                            { className: 'require' },
	                            '*\xA0'
	                        ),
	                        '\u6807\u9898'
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'form-group' },
	                        _react2.default.createElement(
	                            'p',
	                            { className: 'field' },
	                            _react2.default.createElement('textarea', { 'data-cname': '\u6807\u9898', id: 'dream-title', name: 'content', placeholder: '\u6807\u9898...' })
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'desc-head' },
	                        '\u6587\u7AE0\u5185\u5BB9'
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'form-group' },
	                        _react2.default.createElement(
	                            'p',
	                            { className: 'field' },
	                            _react2.default.createElement('textarea', { id: 'textContent', placeholder: '\u6587\u7AE0', name: 'text', ref: function ref(editor) {
	                                    _this4._editor = editor;
	                                } })
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'pic-list' },
	                        _react2.default.createElement(
	                            'ul',
	                            { ref: function ref(picList) {
	                                    _this4._picList = picList;
	                                } },
	                            _react2.default.createElement(
	                                'li',
	                                { onClick: this.onAddImage.bind(this) },
	                                _react2.default.createElement(
	                                    'p',
	                                    null,
	                                    '\u6DFB\u52A0\u56FE\u7247 +'
	                                )
	                            )
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'form-group' },
	                        _react2.default.createElement(
	                            'p',
	                            { className: 'field' },
	                            _react2.default.createElement('input', { ref: function ref(imageUpload) {
	                                    _this4._imageUpload = imageUpload;
	                                }, onChange: this.uploadImage.bind(this), style: { display: "none" }, id: 'image-upload', type: 'file', name: 'upload_file' })
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'tag-head' },
	                        _react2.default.createElement(
	                            'span',
	                            { className: 'require' },
	                            '*\xA0'
	                        ),
	                        selTips
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'form-group', id: 'dreamTagBox' },
	                        _react2.default.createElement(
	                            'p',
	                            { className: 'field' },
	                            _react2.default.createElement('input', { 'data-cname': settings.OBJECT.TAG.CNNAME, ref: function ref(dreamTagInp) {
	                                    _this4._dreamTagInp = dreamTagInp;
	                                }, id: 'dream-tag', type: 'text', name: 'tag', placeholder: settings.OBJECT.TAG.CNNAME, autoComplete: 'off' })
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { id: 'tagSelect', onClick: this.tagSelected.bind(this), className: 'tagList form-group' },
	                        MyTags
	                    ),
	                    _react2.default.createElement('div', { ref: function ref(tagInfo) {
	                            _this4._tagInfo = tagInfo;
	                        }, className: 'alert form-group', style: { display: "none" } }),
	                    _react2.default.createElement(
	                        'div',
	                        null,
	                        _react2.default.createElement(FinishBtn, { onFinishClick: this.validate.bind(this) })
	                    )
	                )
	            );
	        }
	    }, {
	        key: 'validate',
	        value: function validate() {
	            var self = this,
	                validate = true;

	            var ins = [].slice.call(self._popbd.querySelectorAll('textarea'));

	            ins.push(self._popbd.querySelector('input'));

	            var texts = [];

	            ins.forEach(function (inp) {
	                if (['content', 'tag'].indexOf(inp.name) !== -1 && !inp.value.trim()) {
	                    var name = inp.getAttribute('data-cname');
	                    texts.push('您的' + name + '没有填写');
	                    validate = false;
	                }
	            });

	            var infoBox = self._createInfo;
	            if (texts.length > 0) {
	                utils.addClass(infoBox, 'alert-danger');
	                infoBox && (infoBox.innerHTML = texts.join('，') + '!');
	                infoBox.style.display = '';
	            } else {
	                utils.removeClass(infoBox, 'alert-danger');
	                infoBox.style.display = 'none';
	            }

	            if (validate) {
	                this.checkTag(self._dreamTagInp.value, function () {
	                    self._editor.value = self.encodeContent(self._editor.value) + self.images.map(function (url) {
	                        return '<br><img src="' + self.encodeAttr(url) + '" />';
	                    }).join('');
	                    self.submit();
	                });
	            }
	        }
	    }, {
	        key: 'submit',
	        value: function submit() {
	            var self = this;
	            var form = self._popbd.querySelector('#deamcreat-form');
	            form.submit();
	        }
	    }]);
	    return DreamForm;
	}(_react2.default.Component);

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
	                html: '',
	                left: 0,
	                top: 0
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
	                    case 'left':
	                    case 'top':
	                        var value = this.settings[o];
	                        if (typeof value == "number") value += 'px';

	                        this.div.style[o] = value;
	                        break;
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

	        var _this5 = (0, _possibleConstructorReturn3.default)(this, (Win.__proto__ || (0, _getPrototypeOf2.default)(Win)).call(this, opts));

	        _this5.settings.content = '';
	        _this5.settings.title = '标题';
	        _this5.updateSettings({
	            width: 'auto',
	            height: 'auto',
	            html: wintpl(),
	            onClose: function onClose() {}
	        });
	        return _this5;
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

	var TextNewPop = function (_Win) {
	    (0, _inherits3.default)(TextNewPop, _Win);

	    function TextNewPop(opts) {
	        (0, _classCallCheck3.default)(this, TextNewPop);

	        var _this6 = (0, _possibleConstructorReturn3.default)(this, (TextNewPop.__proto__ || (0, _getPrototypeOf2.default)(TextNewPop)).call(this, opts));

	        _this6.tags = opts.tags;
	        _this6.updateSettings({
	            title: "发布文章"
	        });
	        return _this6;
	    }

	    (0, _createClass3.default)(TextNewPop, [{
	        key: 'bindEvents',
	        value: function bindEvents() {
	            var self = this;

	            var dreamForm = _reactDom2.default.render(_react2.default.createElement(DreamForm, { tags: this.tags }), this.bd);

	            utils.placeholder(dreamForm._popbd);

	            (0, _get3.default)(TextNewPop.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextNewPop.prototype), 'bindEvents', this).call(this);

	            var con = this.bd.querySelector("#dreamTagBox");
	            if (con) {
	                var auc = (0, _autocomplete2.default)({
	                    con: con,
	                    inp: '#dream-tag',
	                    url: '/search/tags',
	                    map: {
	                        query: 'key',
	                        list: 'data.tags',
	                        key: 'key',
	                        value: '_id'
	                    },
	                    onQueryStart: function onQueryStart() {
	                        dreamForm.tagCheckStart();
	                    },
	                    onQueryEnd: function onQueryEnd(key) {
	                        dreamForm.tagCheckEnd(key);
	                    },
	                    onSelected: function onSelected(item) {
	                        dreamForm.checkTag(item.key);
	                    }
	                });
	            };
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var ins = [].slice.call(this.bd.querySelectorAll('textarea'));

	            ins.push(this.bd.querySelector('input'));

	            var hasCon = ins.filter(function (item) {
	                if (item.value.trim()) {
	                    return true;
	                }
	            }).length > 0;

	            if (hasCon) {
	                if (window.confirm("您编辑的内容将不会被保存，确认关闭?")) {
	                    (0, _get3.default)(TextNewPop.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextNewPop.prototype), 'close', this).call(this);
	                }
	            } else {
	                (0, _get3.default)(TextNewPop.prototype.__proto__ || (0, _getPrototypeOf2.default)(TextNewPop.prototype), 'close', this).call(this);
	            }
	        }
	    }]);
	    return TextNewPop;
	}(Win);

	// 登录注册弹窗


	var RegPop = function (_Win2) {
	    (0, _inherits3.default)(RegPop, _Win2);

	    function RegPop(opts) {
	        (0, _classCallCheck3.default)(this, RegPop);

	        if (!opts.cur) return (0, _possibleConstructorReturn3.default)(_this7);

	        var title = settings.REGISTRATION.WORDING;

	        var _this7 = (0, _possibleConstructorReturn3.default)(this, (RegPop.__proto__ || (0, _getPrototypeOf2.default)(RegPop)).call(this, opts));

	        _this7.updateSettings({
	            title: title,
	            id: 'registration',
	            content: registration({ data: { current: opts.cur } })
	        });
	        return _this7;
	    }

	    (0, _createClass3.default)(RegPop, [{
	        key: 'bindEvents',
	        value: function bindEvents() {
	            (0, _get3.default)(RegPop.prototype.__proto__ || (0, _getPrototypeOf2.default)(RegPop.prototype), 'bindEvents', this).call(this);

	            this.tabNav = this.bd.querySelector('.tab-nav');
	            this.tabCon = this.bd.querySelector('.tab-content');
	            this.tabUl = this.tabNav.querySelector('ul');

	            this.tabNav && this.tabNav.addEventListener('click', this.tabChange.bind(this), false);

	            this.signupForm = this.bd.querySelector('#signup-form');
	            this.signinForm = this.bd.querySelector('#signinForm');

	            v.validate({
	                form: this.signupForm,
	                needP: true
	            });

	            this.vSignin();
	        }
	    }, {
	        key: 'vSignin',
	        value: function vSignin() {
	            v.validate({
	                form: this.signinForm,
	                fields: [{ name: 'email', require: true, label: '邮箱' }, { name: 'password', require: true, label: '密码' }],
	                onCheckInput: function onCheckInput() {
	                    var self = this;
	                    _req2.default.post('/signin/check', {
	                        email: self.formData.email,
	                        password: self.formData.password
	                    }, function (data) {
	                        if (data.result === 0) {
	                            self.form.style.display = 'none';
	                            self.form.nextElementSibling.style.display = 'block';
	                            self.form.submit();
	                        } else {
	                            var infoBox = self.form.querySelector('#signinInfo');
	                            infoBox && (infoBox.innerHTML = data.info);
	                            infoBox && (infoBox.style.display = "block");
	                        }
	                    });
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
	    }]);
	    return RegPop;
	}(Win);

	var TagNewPop = function (_Win3) {
	    (0, _inherits3.default)(TagNewPop, _Win3);

	    function TagNewPop(opts) {
	        (0, _classCallCheck3.default)(this, TagNewPop);

	        var _this8 = (0, _possibleConstructorReturn3.default)(this, (TagNewPop.__proto__ || (0, _getPrototypeOf2.default)(TagNewPop)).call(this, opts));

	        _this8.updateSettings({
	            title: '创建版面',
	            content: tagnewtpl(opts.data)
	        });
	        return _this8;
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

	var PresidentPop = function (_Win4) {
	    (0, _inherits3.default)(PresidentPop, _Win4);

	    function PresidentPop(opts) {
	        (0, _classCallCheck3.default)(this, PresidentPop);

	        var _this9 = (0, _possibleConstructorReturn3.default)(this, (PresidentPop.__proto__ || (0, _getPrototypeOf2.default)(PresidentPop)).call(this, opts));

	        _this9.updateSettings({
	            title: '选版主',
	            content: '<div class="building">' + settings.BUILDING_WORD + '</div>'
	        });
	        return _this9;
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

	    __REACT_HOT_LOADER__.register(INDENT, 'INDENT', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(BREAK, 'BREAK', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(FinishBtn, 'FinishBtn', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(MyTagList, 'MyTagList', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(DreamForm, 'DreamForm', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(Popup, 'Popup', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(Win, 'Win', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(TextNewPop, 'TextNewPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(RegPop, 'RegPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(TagNewPop, 'TagNewPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(PresidentPop, 'PresidentPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(popup, 'popup', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(textNewPop, 'textNewPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(registrationPop, 'registrationPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(tagNewPop, 'tagNewPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');

	    __REACT_HOT_LOADER__.register(presidentPop, 'presidentPop', 'E:/mypro/suopoearth/suopoearth/mobilesrc/popup.js');
	}();

	;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.validate = undefined;

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var req = __webpack_require__(17).default;
	var settings = __webpack_require__(38);
	var utils = __webpack_require__(12);

	var Validate = function () {
	    function Validate(opts) {
	        (0, _classCallCheck3.default)(this, Validate);

	        this.opts = opts;
	        this.defValidates = {
	            'username': {
	                'fun': function fun(val) {
	                    return utils.isUserName(val);
	                },
	                'err': "昵称必须是6~12个小写字母、数字、下划线组成"
	            },

	            'email': {
	                'fun': function fun(val) {
	                    return utils.isValidEmail(val);
	                },
	                'err': "邮箱的格式书写错误"
	            },

	            'nickname': {
	                'fun': function fun(val) {
	                    return utils.isNickName(val);
	                },
	                'err': '笔名' + settings.NICK_NAME_VALIDATION
	            },

	            'password': {
	                'fun': function fun(val) {
	                    return utils.isPassword(val);
	                },
	                'err': "密码必须是6~16个字符的小写字母或数字组成"
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
	                fields: [{ name: 'email', require: true, label: '邮箱' }, { name: 'nickname', require: true, label: '笔名' }, { name: 'password', require: true, label: '密码' }],
	                onCheckInput: function onCheckInput() {
	                    var self = this;
	                    req.post('/signup/check', {
	                        email: self.formData.email
	                    }, function (data) {
	                        if (data.result === 0) {
	                            self.form.style.display = 'none';
	                            self.form.nextElementSibling.style.display = 'block';
	                            self.form.submit();
	                        } else {
	                            var infoBox = self.form.querySelector('#signupInfo');
	                            infoBox && (infoBox.innerHTML = data.info);
	                            infoBox && (infoBox.style.display = "block");
	                        }
	                    });
	                },
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
	                                tips.innerHTML = label + "未填写";
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

	    __REACT_HOT_LOADER__.register(req, 'req', 'E:/mypro/suopoearth/suopoearth/mobilesrc/validate.js');

	    __REACT_HOT_LOADER__.register(Validate, 'Validate', 'E:/mypro/suopoearth/suopoearth/mobilesrc/validate.js');

	    __REACT_HOT_LOADER__.register(validate, 'validate', 'E:/mypro/suopoearth/suopoearth/mobilesrc/validate.js');
	}();

	;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(64), __esModule: true };

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(66), __esModule: true };

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(85);
	var $Object = __webpack_require__(1).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(86);
	module.exports = __webpack_require__(1).Object.keys;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(89);
	__webpack_require__(87);
	__webpack_require__(90);
	__webpack_require__(91);
	module.exports = __webpack_require__(1).Symbol;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(88);
	__webpack_require__(92);
	module.exports = __webpack_require__(31).f('iterator');

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(3)
	  , toLength  = __webpack_require__(83)
	  , toIndex   = __webpack_require__(82);
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

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(14)
	  , gOPS    = __webpack_require__(44)
	  , pIE     = __webpack_require__(24);
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

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2).document && document.documentElement;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(39);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(39);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(32)
	  , descriptor     = __webpack_require__(18)
	  , setToStringTag = __webpack_require__(25)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(9)(IteratorPrototype, __webpack_require__(10)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(14)
	  , toIObject = __webpack_require__(3);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(19)('meta')
	  , isObject = __webpack_require__(16)
	  , has      = __webpack_require__(7)
	  , setDesc  = __webpack_require__(8).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(13)(function(){
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

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(8)
	  , anObject = __webpack_require__(15)
	  , getKeys  = __webpack_require__(14);

	module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(3)
	  , gOPN      = __webpack_require__(43).f
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


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(28)
	  , defined   = __webpack_require__(20);
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

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(28)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(28)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(69)
	  , step             = __webpack_require__(76)
	  , Iterators        = __webpack_require__(22)
	  , toIObject        = __webpack_require__(3);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(42)(Array, 'Array', function(iterated, kind){
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

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(11);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(6), 'Object', {defineProperty: __webpack_require__(8).f});

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(33)
	  , $keys    = __webpack_require__(14);

	__webpack_require__(36)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 87 */
/***/ function(module, exports) {

	

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(81)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(42)(String, 'String', function(iterated){
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

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(2)
	  , has            = __webpack_require__(7)
	  , DESCRIPTORS    = __webpack_require__(6)
	  , $export        = __webpack_require__(11)
	  , redefine       = __webpack_require__(46)
	  , META           = __webpack_require__(78).KEY
	  , $fails         = __webpack_require__(13)
	  , shared         = __webpack_require__(27)
	  , setToStringTag = __webpack_require__(25)
	  , uid            = __webpack_require__(19)
	  , wks            = __webpack_require__(10)
	  , wksExt         = __webpack_require__(31)
	  , wksDefine      = __webpack_require__(30)
	  , keyOf          = __webpack_require__(77)
	  , enumKeys       = __webpack_require__(71)
	  , isArray        = __webpack_require__(74)
	  , anObject       = __webpack_require__(15)
	  , toIObject      = __webpack_require__(3)
	  , toPrimitive    = __webpack_require__(29)
	  , createDesc     = __webpack_require__(18)
	  , _create        = __webpack_require__(32)
	  , gOPNExt        = __webpack_require__(80)
	  , $GOPD          = __webpack_require__(35)
	  , $DP            = __webpack_require__(8)
	  , $keys          = __webpack_require__(14)
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
	  __webpack_require__(43).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(24).f  = $propertyIsEnumerable;
	  __webpack_require__(44).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(23)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(9)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(30)('asyncIterator');

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(30)('observable');

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	var global        = __webpack_require__(2)
	  , hide          = __webpack_require__(9)
	  , Iterators     = __webpack_require__(22)
	  , TO_STRING_TAG = __webpack_require__(10)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _req = __webpack_require__(17);

	var _req2 = _interopRequireDefault(_req);

	var _react = __webpack_require__(53);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(54);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var utils = __webpack_require__(12); /*
	                               * @fileOverview 弹出窗口
	                               * @version 0.1
	                               * @author minggangqiu
	                               */

	var AutoComplete = function () {
	    function AutoComplete(opts) {
	        (0, _classCallCheck3.default)(this, AutoComplete);

	        this.opts = opts;
	        this.init();
	    }

	    (0, _createClass3.default)(AutoComplete, [{
	        key: 'init',
	        value: function init() {
	            var opts = this.opts || {};

	            this.index = -1;
	            this.visible = false;

	            this.defaultOpts = {
	                con: null,
	                inp: '.input',
	                url: '',
	                width: 'auto',
	                query: '',
	                style: 'normal',
	                map: {
	                    query: 'query',
	                    list: 'list',
	                    key: 'key',
	                    value: 'value'
	                },
	                fillVal: true,
	                onQueryStart: null,
	                onQueryEnd: null,
	                onSelected: null,
	                onEnter: null
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
	            this.create();
	        }
	    }, {
	        key: 'create',
	        value: function create() {
	            var conf = this.settings;
	            if (!conf.inp || !conf.con) return new Error('No element specified.');

	            for (var o in conf) {
	                switch (o.toLowerCase()) {
	                    case 'con':
	                        this.con = conf.con;
	                        this.con.style.position = 'relative';
	                        var list = this.con.querySelector('.select-list');
	                        if (list) {
	                            this.selectList = list;
	                        } else {
	                            this.selectList = document.createElement('div');
	                            this.con.appendChild(this.selectList);
	                            this.selectList.className = 'select-list';
	                        }
	                        break;
	                    case 'inp':
	                        this.inp = this.con.querySelector(conf.inp);
	                        break;
	                    case 'query':
	                        if (typeof conf[o] === 'string' && conf[o].length > 0) this.inp.value = conf[o].trim();
	                        break;
	                    case 'width':
	                        var value = conf[o];
	                        if (value) {
	                            value += 'px';
	                        } else if (value === 'auto') {
	                            return;
	                        } else {
	                            value = this.inp.offsetWidth;
	                        }

	                        this.selectList.style[o] = value;
	                        break;
	                    default:
	                        this[o] = conf[o];
	                        break;
	                }
	            }
	            this.bintEvents();
	        }
	    }, {
	        key: 'reload',
	        value: function reload() {
	            var style = {
	                link: _react2.default.createElement(
	                    'ul',
	                    null,
	                    this.data.list.map(function (item) {
	                        return _react2.default.createElement(
	                            'li',
	                            null,
	                            _react2.default.createElement(
	                                'a',
	                                { href: 'javascript:;', 'data-value': item.value },
	                                item.key,
	                                ' ',
	                                _react2.default.createElement(
	                                    'i',
	                                    { className: 'enter-in' },
	                                    '\u2192'
	                                )
	                            )
	                        );
	                    })
	                ),
	                normal: _react2.default.createElement(
	                    'ul',
	                    null,
	                    this.data.list.map(function (item) {
	                        return _react2.default.createElement(
	                            'li',
	                            null,
	                            _react2.default.createElement(
	                                'a',
	                                { href: 'javascript:;', 'data-value': item.value },
	                                item.key
	                            )
	                        );
	                    })
	                )
	            };

	            _reactDom2.default.render(style[this.style], this.selectList);
	        }
	    }, {
	        key: 'bintEvents',
	        value: function bintEvents() {
	            var self = this;

	            this.inp.addEventListener("mousedown", function (ev) {
	                ev.stopPropagation();
	            });

	            this.selectList.addEventListener("mousedown", function (ev) {
	                ev.stopPropagation();
	            });

	            document.body.addEventListener("mousedown", function () {
	                self.hide();
	            });

	            this.inp.addEventListener("input", this.queryData.bind(this));

	            this.selectList.addEventListener("click", function (ev) {
	                var cur = ev.target;
	                if (cur.nodeName.toLowerCase() === 'a') {
	                    var item = {
	                        key: cur.textContent,
	                        value: utils.getData(cur, 'value')
	                    };
	                    self.onSelected && self.onSelected.call(self, item);
	                    self.fillVal && (self.inp.value = cur.textContent);
	                    self.hide();
	                }
	            });

	            this.inp.addEventListener("keydown", this.arrowCtl.bind(this));
	        }
	    }, {
	        key: 'queryData',
	        value: function queryData(ev) {
	            var self = this;
	            var inp = ev.target,
	                query = inp.value.trim();

	            var data = {};
	            data[this.map.query] = query;

	            if (typeof query != 'string') return;

	            var queryStart = function queryStart(key) {
	                self.onQueryStart && self.onQueryStart.call(self);
	            };

	            var queryEnd = function queryEnd(key) {
	                self.onQueryEnd && self.onQueryEnd.call(self, key);
	            };

	            if (query.length > 0) {
	                queryStart(query);
	                _req2.default.getJSON(this.url, data, function (data) {
	                    self.data = {};
	                    var keys = self.map.list.split('.');
	                    keys.forEach(function (key) {
	                        data = data[key];
	                    });
	                    var list = data,
	                        curKey = '';
	                    if (list && list.length > 0) {
	                        self.data.list = list.map(function (item) {
	                            var newItem = {};
	                            newItem.key = item[self.map.key];
	                            newItem.value = item[self.map.value];
	                            var key = query.trim();
	                            if (newItem.key === key) {
	                                curKey = key;
	                            }
	                            return newItem;
	                        });

	                        self.reload();

	                        self.show();
	                    } else {
	                        self.hide();
	                    }
	                    queryEnd(curKey);
	                }, function () {
	                    self.hide();
	                    queryEnd();
	                });
	            } else {
	                self.hide();
	                queryEnd();
	            }
	        }
	    }, {
	        key: 'arrowCtl',
	        value: function arrowCtl(e) {
	            e.stopPropagation();
	            var keyCode = e.keyCode,
	                self = this;

	            if (keyCode === 40 || keyCode === 38 || keyCode === 13) {
	                var list = self.selectList.querySelectorAll('a');
	                e.preventDefault();

	                switch (keyCode) {
	                    case 40:
	                        this.index += 1;
	                        if (this.index > list.length - 1) this.index = 0;
	                        if (list) {
	                            for (var i = 0; i < list.length; i++) {
	                                utils.removeClass(list[i], 'over');
	                            }
	                            utils.addClass(list[this.index], 'over');
	                        }
	                        break;
	                    case 38:
	                        this.index -= 1;
	                        if (this.index < 0) this.index = list.length - 1;
	                        if (list) {
	                            for (var i = 0; i < list.length; i++) {
	                                utils.removeClass(list[i], 'over');
	                            }
	                            utils.addClass(list[this.index], 'over');
	                        }
	                        break;
	                    case 13:
	                        var cur = list[this.index];
	                        if (!cur) {
	                            self.onEnter && self.onEnter.call(self);
	                            return;
	                        }

	                        var item = {
	                            key: cur.textContent,
	                            value: utils.getData(cur, 'value')
	                        };
	                        self.onSelected && self.onSelected.call(self, item);
	                        self.fillVal && (self.inp.value = cur.textContent);
	                        self.hide();
	                        break;
	                    case 8:
	                        break;
	                }
	            }
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            if (!this.visible) {
	                this.selectList.style.display = "block";
	                this.visible = true;
	            }
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            if (this.visible) {
	                this.selectList.style.display = "none";
	                this.visible = false;
	            }
	        }
	    }]);
	    return AutoComplete;
	}();

	;

	function autocomplete(opts) {
	    return new AutoComplete(opts);
	}

	var _default = autocomplete;
	exports.default = _default;
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }

	    __REACT_HOT_LOADER__.register(AutoComplete, 'AutoComplete', 'E:/mypro/suopoearth/suopoearth/mobilesrc/autocomplete.js');

	    __REACT_HOT_LOADER__.register(autocomplete, 'autocomplete', 'E:/mypro/suopoearth/suopoearth/mobilesrc/autocomplete.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/suopoearth/suopoearth/mobilesrc/autocomplete.js');
	}();

	;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

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

	    __REACT_HOT_LOADER__.register(shareaside, 'shareaside', 'E:/mypro/suopoearth/suopoearth/mobilesrc/share.js');
	}();

	;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	(function (factory) {
	    module.exports = factory(__webpack_require__(49).default, __webpack_require__(55), __webpack_require__(17).default, __webpack_require__(56).default, __webpack_require__(12), __webpack_require__(57), __webpack_require__(58));
	})(function (_t, polyfill, req, effect, utils, dropdown, popup) {
	    var common = {
	        isScroll: true,
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
	        textNew: function textNew() {
	            req.getJSON('/tag/simplemine', null, function (data) {
	                common.xhrReponseManage(data, function () {
	                    if (data.data) {
	                        var tags = data.data.tags;

	                        tags && popup.textNewPop({
	                            id: 'textReleasePop',
	                            tags: tags
	                        }).show();
	                    }
	                });
	            }, function () {
	                alert('网络异常');
	            });
	        },
	        showSigninPop: function showSigninPop() {
	            popup.registrationPop({ cur: 'signin' }).show();
	        },
	        showSignupPop: function showSignupPop() {
	            popup.registrationPop({ cur: 'signup' }).show();
	        },
	        autoScroll: function autoScroll(obj) {
	            if (this.isScroll) {
	                $(obj).find("ul:first").animate({
	                    marginTop: "-25px"
	                }, 500, function () {
	                    $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
	                });
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
	                hm.src = "//hm.baidu.com/hm.js?9ef942b0d6b160b80ac87ad7fdbb7d5f";
	                var s = document.getElementsByTagName("script")[0];
	                s.parentNode.insertBefore(hm, s);
	            })();
	        }
	    };

	    utils.placeholder(document);

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
	        el: '#navbar-toggle',
	        container: '.user-in',
	        selector: '.user-in',
	        menu: '#navbar-collapse',
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
	    var inputBox = document.getElementById('search-area'),
	        backBtn = document.getElementById('search-back'),
	        resetBtn = document.getElementById('search-reset'),
	        searchInput = document.getElementById('search-input'),
	        searchBtn = document.getElementById('search_dream_btn');

	    searchBtn && searchBtn.addEventListener('click', function () {
	        if (inputBox.className.indexOf(' visible') === -1) {
	            inputBox.className += ' visible';
	        }
	    }, false);

	    backBtn && backBtn.addEventListener('click', function () {
	        inputBox.className = inputBox.className.replace(' visible', '');
	    }, false);

	    resetBtn && resetBtn.addEventListener('click', function () {
	        searchInput.value = '';
	    }, false);

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

	    // 创建下拉
	    var configDropdown = document.querySelector('#config-dropdown');
	    configDropdown && dropdown.create({
	        el: '[rel="conf-toggle"]',
	        container: '#config-dropdown',
	        selector: '#config-dropdown',
	        menu: '.config-list',
	        width: 'auto'
	    });

	    var submitBtn = document.querySelector('button[type="submit"]'),
	        submitform = utils.closest(submitBtn, 'form');
	    submitBtn && submitform && submitform.addEventListener('submit', function () {
	        submitBtn.disabled = true;
	        utils.addClass(submitBtn, 'disabled');
	    });

	    document.addEventListener("touchstart", function () {}, true);

	    return common;
	});
	;

	var _temp = function () {
	    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
	        return;
	    }
	}();

	;

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(4);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(5);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _tools = __webpack_require__(49);

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

	    __REACT_HOT_LOADER__.register(Keyboard, 'Keyboard', 'E:/mypro/suopoearth/suopoearth/mobilesrc/keyboard.js');

	    __REACT_HOT_LOADER__.register(keyboard, 'keyboard', 'E:/mypro/suopoearth/suopoearth/mobilesrc/keyboard.js');

	    __REACT_HOT_LOADER__.register(_default, 'default', 'E:/mypro/suopoearth/suopoearth/mobilesrc/keyboard.js');
	}();

	;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(100), __esModule: true };

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(101), __esModule: true };

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(105);
	var $Object = __webpack_require__(1).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(106);
	var $Object = __webpack_require__(1).Object;
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $Object.getOwnPropertyDescriptor(it, key);
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(107);
	module.exports = __webpack_require__(1).Object.getPrototypeOf;

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(108);
	module.exports = __webpack_require__(1).Object.setPrototypeOf;

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(16)
	  , anObject = __webpack_require__(15);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(47)(Function.call, __webpack_require__(35).f(Object.prototype, '__proto__').set, 2);
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

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(11)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(32)});

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject                 = __webpack_require__(3)
	  , $getOwnPropertyDescriptor = __webpack_require__(35).f;

	__webpack_require__(36)('getOwnPropertyDescriptor', function(){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(33)
	  , $getPrototypeOf = __webpack_require__(48);

	__webpack_require__(36)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(11);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(104).set});

/***/ },
/* 109 */
/***/ function(module, exports) {

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

/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="dream-area">\r\n    <form id="deamcreat-form" action="/dream/new" method="post">\r\n        <div class="title-head">\r\n            <p class="title-prompt">你可以畅所欲言，但不要长篇大论</p>\r\n            此刻的想法（必填）\r\n            <a href="javascript:;" title="表情" alt="表情" class="desc-face">(∩＿∩)</a>\r\n        </div>\r\n        <div>\r\n            <p class="field"><textarea id="dream-title" name="content" placeholder="想法..."></textarea></p>\r\n            <p class="validate-error"></p>\r\n        </div>\r\n        <div class="desc-head">\r\n            图片\r\n        </div>\r\n        <div><p class="field"><input id="image-upload" type="file" name="upload_file"></p></div>\r\n        <div><img id="image-preview" src="" /></div>\r\n        <div><p class="field"><input id="dream-tag" type="tag" name="tag" placeholder="选择版面"></p></div>\r\n        <input type="hidden" name="did" value="" />\r\n        <div><button id="finish_cdream_btn" type="submit" class="btn">分享 > </button></div>\r\n    </form>\r\n</div>\r\n\r\n';

	}
	return __p
	}

/***/ },
/* 111 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="tab-nav">\r\n    <ul>\r\n        <li><a href="javascript:;" class="tab ' +
	((__t = ( data.current === 'signup'? 'cur':'' )) == null ? '' : __t) +
	'">成为作者</a></li>\r\n        <li><a href="javascript:;" class="tab ' +
	((__t = ( data.current === 'signin'? 'cur':'' )) == null ? '' : __t) +
	'">登录</a></li>\r\n    </ul>\r\n</div>\r\n<div class="tab-content">\r\n    <div class="signup-area" style="display: ' +
	((__t = ( data.current === "signup"? '':'none' )) == null ? '' : __t) +
	'">\r\n        <form id="signup-form" action="/signup" method="post" novalidate>\r\n            <div id="signupInfo" class="color-warning" style="display: none;">\r\n            </div>\r\n            <div class="form-group">\r\n                <p class="field"><input type="email" data-label="邮箱" name="email" id="emial" placeholder="邮箱" required></p>\r\n                <p class="validate-error"></p>\r\n            </div class="form-group">\r\n            <div class="form-group">\r\n                <p class="field"><input type="text" data-label="笔名" name="nickname" id="nickname" placeholder="笔名" required></p>\r\n                <p class="validate-error"></p>\r\n            </div class="form-group">\r\n            <div class="form-group">\r\n                <p class="field"><input type="password" data-label="密码" name="password" id="password" placeholder="密码" autocomplete="off" required></p>\r\n                <p class="validate-error"></p>\r\n            </div>\r\n            <div>\r\n                <button id="signup-btn" type="button" class="btn btn-primary">确定</button>&nbsp;\r\n            </div>\r\n        </form>\r\n        <div class="signup-loading" style="display: none;">\r\n            <p>请稍等...</p>\r\n        </div>\r\n    </div>\r\n    <div class="signin-area" style="display: ' +
	((__t = ( data.current === "signin"? '':'none' )) == null ? '' : __t) +
	'">\r\n        <form id="signinForm" action="/signin" method="post" autocomplete="off">\r\n            <div id="signinInfo" class="color-warning" style="display: none;"></div>\r\n            <div class="form-group">\r\n                <p class="field"><input type="text" data-label="用户名" id="email" name="email" placeholder="邮箱" required></p>\r\n                <p class="validate-error"></p>\r\n            </div>\r\n            <div class="form-group">\r\n                <p class="field"><input type="password" data-label="密码" id="password" name="password" placeholder="密码" required autocomplete="off"></p>\r\n                <p class="validate-error"></p>\r\n            </div>\r\n            <div class="other-ctrl form-group">\r\n                <a class="forget-pwd" href="/forgot">忘记密码 ?</a>\r\n            </div>\r\n            <div class="btn-group">\r\n                <button class="btn btn-primary" type="button">登录</button>\r\n            </div>\r\n        </form>\r\n        <div class="signin-loading" style="display: none;">\r\n            <p>登录中...请稍等</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n';

	}
	return __p
	}

/***/ },
/* 112 */
/***/ function(module, exports) {

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

/***/ },
/* 113 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="hd">\r\n    <span class="title">标题...</span>\r\n    <a href="javascript:;" class="close"><i class="s s-close s-lg"></i></a>\r\n</div>\r\n<div class="bd">\r\n    正文...\r\n</div>\r\n';

	}
	return __p
	}

/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
	function print() { __p += __j.call(arguments, '') }
	with (obj) {
	__p += '<li class="list-item">\r\n    <div class="post-box">\r\n        <div class="post-header">\r\n             <div class="postHeaderUserInfo">\r\n                ';
	 if (dream._belong_u) { ;
	__p += '\r\n                <a class="avatar" href="/user/' +
	((__t = ( dream._belong_u._id )) == null ? '' : __t) +
	'"><img width="25" height="25" src="' +
	((__t = ( dream._belong_u.avatar_mini || '/images/avatar_mini.png' )) == null ? '' : __t) +
	'" /></a>\r\n                <a class="postHeaderUname" href="/user/' +
	((__t = ( dream._belong_u._id )) == null ? '' : __t) +
	'">' +
	((__t = ( dream._belong_u.nickname )) == null ? '' : __t) +
	'</a>\r\n                ';
	 } else { ;
	__p += '\r\n                <a class="avatar" href="/user/unknow"><img width="25" height="25" src="/images/avatar_mini.png" /></a>\r\n                <a class="postHeaderUname" href="/user/unknow">未知用户</a>\r\n                ';
	 } ;
	__p += '\r\n            </div>\r\n            ';
	 if (dream._belong_t) { ;
	__p += '\r\n            <div class="postHeaderTagInfo">\r\n                <a class="tag" href="/tag/' +
	((__t = ( dream._belong_t._id || 'unknow' )) == null ? '' : __t) +
	'">' +
	((__t = ( dream._belong_t? dream._belong_t.key:'未知' )) == null ? '' : __t) +
	'</a>\r\n            </div>\r\n            ';
	 } ;
	__p += '\r\n            <div class="postHeaderDateInfo">\r\n                ' +
	((__t = ( timeFormat(dream.date) )) == null ? '' : __t) +
	'\r\n            </div>\r\n        </div>\r\n        <div class="post-content thumb-mode\r\n">\r\n            <a href="/dream/' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'">\r\n                ';
	 if (dream.isremove) { ;
	__p += '\r\n                [已被作者删除]\r\n                ';
	 } else { ;
	__p += '\r\n                <div class="entry">\r\n                    ';
	 if (data.query) { ;
	__p += '\r\n                    ' +
	__e( highLight(dlimit(dream.content), data.query) ) +
	'\r\n                    ';
	 } else { ;
	__p += '\r\n                    ' +
	((__t = ( dlimit(dream.content) )) == null ? '' : __t) +
	'\r\n                    ';
	 } ;
	__p += '\r\n                </div>\r\n            </a>\r\n            ';
	 if (dream.text) { ;
	__p += '\r\n            ';
	 if (dream.text.summary) { ;
	__p += '\r\n            <div class="summary">\r\n                ' +
	__e( dream.text.summary ) +
	'\r\n            </div>\r\n            ';
	 } ;
	__p += '\r\n            ';
	 if (dream.text.images && dream.text.images.split('|').length > 0) { ;
	__p += '\r\n            <div class="thumbnail">\r\n                <ul>\r\n                    ';
	 dream.text.images.split('|').forEach(function(img) { ;
	__p += '\r\n                    <li rel="dream-picsrc" data-show="false">\r\n                        <img src="' +
	((__t = ( img )) == null ? '' : __t) +
	'" />\r\n                    </li>\r\n                    ';
	 }); ;
	__p += '\r\n                </ul>\r\n            </div>\r\n            <div class="preview"></div>\r\n            ';
	 } ;
	__p += '\r\n            ';
	 } ;
	__p += '\r\n            ';
	 } ;
	__p += '\r\n        </div>\r\n        <div class="post-footer">\r\n             <div class="comment-ctrl-box"><a href="/dream/' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'#dreamCtrlBox"><i class="s s-comment s-lg"></i>&nbsp;留言(' +
	((__t = ( dream.cnum )) == null ? '' : __t) +
	')&nbsp;';
	 dream.nodes.length ;
	__p += '</a></div>\r\n            <div class="vote-ctrl-box">\r\n                ';
	 if (user) { ;
	__p += '\r\n                ';
	 if (dream.good && dream.good.length > 0) { ;
	__p += '\r\n                <a href="javascript:;" title="帮他顶上去" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasgood="true" rel="dream-good"><i class="s s-arrow_up s-lg s-ac"></i></a>\r\n                ';
	 } else { ;
	__p += '\r\n                <a href="javascript:;" title="帮他顶上去" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasgood="false" rel="dream-good"><i class="s s-arrow_up s-lg"></i></a>\r\n                ';
	 } ;
	__p += '\r\n                ';
	 } else { ;
	__p += '\r\n                <a href="javascript:;" title="帮他顶上去" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasgood="false" rel="dream-good"><i class="s s-arrow_up s-lg"></i></a>\r\n                ';
	 } ;
	__p += '\r\n                <span class="vote-num" rel="vote-num">' +
	((__t = ( dream.vote )) == null ? '' : __t) +
	'</span>\r\n                ';
	 if (user) { ;
	__p += '\r\n                ';
	 if (dream.bad && dream.bad.length > 0) { ;
	__p += '\r\n                <a href="javascript:;" title="给他挤下去" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasbad="true" rel="dream-bad"><i class="s s-arrow_down s-lg s-ac"></i></a>\r\n                ';
	 } else { ;
	__p += '\r\n                <a href="javascript:;" title="给他挤下去" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasbad="false" rel="dream-bad"><i class="s s-arrow_down s-lg"></i></a>\r\n                ';
	 } ;
	__p += '\r\n                ';
	 } else { ;
	__p += '\r\n                <a href="javascript:;" title="给他挤下去" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasbad="false" rel="dream-bad"><i class="s s-arrow_down s-lg"></i></a>\r\n                ';
	 } ;
	__p += '\r\n            </div>\r\n            <div class="more-ctrl-toggle">\r\n                <a href="javascript:;">•••</a>\r\n            </div>\r\n            <div class="more-ctrl-box">\r\n                ';
	 if (user) { ;
	__p += '\r\n                ';
	 if (dream._followers_u && dream._followers_u.length > 0) { ;
	__p += '\r\n                <a data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasfav="true" rel="dream-favourite" href="javascript:;">已收藏</a>\r\n                ';
	 } else { ;
	__p += '\r\n                <a data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasfav="false" rel="dream-favourite" href="javascript:;">收藏</a>\r\n                ';
	 } ;
	__p += '\r\n                ';
	 } else { ;
	__p += '\r\n                <a data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" data-hasfav="false" rel="dream-favourite" href="javascript:;">收藏</a>\r\n                ';
	 } ;
	__p += '\r\n                ';
	 if (user && (data.tag && data.tag.delperm)) { ;
	__p += '\r\n                <a href="javascript:;" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" rel="dream-reject">学派驳回</a>\r\n                ';
	 } ;
	__p += '\r\n                ';
	 if (user && dream._belong_u) { ;
	__p += '\r\n                ';
	 if (dream._belong_u._id.equals(user._id)) { ;
	__p += '\r\n                ';
	 if (!dream.isremove) { ;
	__p += '\r\n                <a href="javascript:;" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" rel="dream-delete">个人删除</a>\r\n                ';
	 } else { ;
	__p += '\r\n                <span>已删除</span>\r\n                ';
	 } ;
	__p += '\r\n                ';
	 } ;
	__p += '\r\n                ';
	 } ;
	__p += '\r\n                <!--<div class="share-box dropdown">\r\n                    <a rel="dream-share" href="javascript:;" class="dropdown-toggle" data-did="' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'">分享到</a>\r\n                    <ul class="dropdown-menu">\r\n                        <li class="only-pc"><a rel="wb_share" href="javascript:;"><i class="s s-wb s-3x"></i></a></li>\r\n                        <li class="only-pc"><a rel="qzone_share" href="javascript:;"><i class="s s-qzone s-3x"></i></a></li>\r\n                        <li><a rel="weixin_share" href="javascript:;"><i class="s s-weixin s-3x"></i></a></li>\r\n                        <li>\r\n                            <div class="only-mobile">长按以下地址拷贝到你要分享到的站点...</div>\r\n                            <input name="query" placeholder="拷贝地址到你要分享到的站点..." value="http://' +
	((__t = ( data.domain )) == null ? '' : __t) +
	'/dream/' +
	((__t = ( dream._id )) == null ? '' : __t) +
	'" />\r\n                        </li>\r\n                    </ul>\r\n                </div>-->\r\n            </div>\r\n        </div>\r\n    </div>\r\n</li>\r\n\r\n';

	}
	return __p
	}

/***/ }
/******/ ]);