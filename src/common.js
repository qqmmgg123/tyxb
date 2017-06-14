'use strict';

(function (factory) {
    module.exports = factory(
        require('tools').default,
        require('polyfill'),
        require('req').default,
        require('effect').default,
        require('utils'),
        require('dropdown'),
        require('popup')
    );
}(function (_t, polyfill, req, effect, utils, dropdown, popup) {
    var common = {
        isScroll: true,
        getPageSize: function(){
            var xScroll, yScroll;

            if (window.innerHeight && window.scrollMaxY) { 
                xScroll = document.body.scrollWidth;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }

            var windowWidth, windowHeight;
            if (self.innerHeight) { // all except Explorer
                windowWidth = self.innerWidth;
                windowHeight = self.innerHeight;
            } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else if (document.body) { // other Explorers
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            } 

            // for small pages with total height less then height of the viewport
            var pageWidth, pageHeight, arrayPageSize;
            if(yScroll < windowHeight){
                pageHeight = windowHeight;
            } else {
                pageHeight = yScroll;
            }
            // for small pages with total width less then width of the viewport
            if(xScroll < windowWidth){ 
                pageWidth = windowWidth;
            } else {
                pageWidth = xScroll;
            }

            arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight)
            return arrayPageSize;
        },
        checkMobile: function() {
            if(window.innerWidth <= 800 && window.innerHeight <= 600) {
                return true;
            } else {
                return false;
            }
        },
        dateBeautify: function(date) {
            var hour      = 60 * 60 * 1000,
                day       = 24 * hour,
                currDate  = this.dateFormat(new Date, 'yyyy-MM-dd'),
                today     = new Date(currDate + ' 00:00:00').getTime(),
                yesterday = today - day,
                currTime  = date.getTime(),
                cHStr     = this.dateFormat(date, 'hh:mm:ss');

            if (currTime >= today) {
                var time    = (currTime - today) / hour;
                var cHour   = date.getHours();
                var amCHour = cHour - 12;
                var cMStr   = this.dateFormat(date, 'mm:ss');
                var str     = time <= 12? '上午 ' + cHStr:'下午 ' + (amCHour < 10? amCHour: '0' + amCHour) + ':' + cMStr;
                return str;
            }else if (currTime < today && currTime >= yesterday) {
                return "昨天 " + cHStr;
            }else {
                return this.dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
            }
        },
        dateFormat: function(date, format){
            var o = {
                "M+" : date.getMonth()+1, //month
                "d+" : date.getDate(),    //day
                "h+" : date.getHours(),   //hour
                "m+" : date.getMinutes(), //minute
                "s+" : date.getSeconds(), //second
                "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
                "S" : date.getMilliseconds() //millisecond
            }

            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o) if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1 ? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));

            return format;
        },
        textNew: function(type, tag) {
            /*let pop = popup.textNewPop({
                id   : 'textReleasePop',
                type : type,
                tag  : tag
            });
            pop.show();
            return pop;*/
            const state = History.getState(),
                  { action } = state.data;
            if (!action && action !== 'share') {
                History.pushState({ 
                    action: 'share',
                    params: {
                        type : type,
                        tag  : tag
                    }
                }, 'share', `?popup=share&type=${type}` + (tag? `&tag=${tag}`:''));
            }
        },
        showSigninPop: function() {
            //popup.registrationPop({ cur: 'signin' }).show();
            const state = History.getState(),
                  { action } = state.data;
            if (!action && action !== 'signin') {
                History.pushState({ action: 'signin'}, 'signin', "?popup=signin");
            }
        },
        showSignupPop: function() {
            //popup.registrationPop({ cur: 'signup' }).show();
            const state = History.getState(),
                  { action } = state.data;
            if (!action && action !== 'signup') {
                History.pushState({ action: 'signup'}, 'signup', "?popup=signup");
            }
        },
        showImageViewer: function(src) {
            const state = History.getState(),
                  { action } = state.data;
            if (!action && action !== 'imageview') {
                History.pushState({ 
                    action: 'imageview',
                    params: {
                        src: src
                    }
                }, 'imageview', "?popup=imageview");
            }
        },
        autoScroll: function(obj) {
            if (this.isScroll) {
                $(obj).find("ul:first").animate({
                    marginTop: "-25px"
                }, 500, function () {
                    $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
                });
            }
        }, 
        xhrReponseManage: function(data, callback) {
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
        statistics: function() {
            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?93021e0f5cc3538c992cf608b6c30431";
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

    signinBtn && signinBtn.addEventListener('click', function() {
        common.showSigninPop();
    });
    signupBtn && signupBtn.addEventListener('click', function() {
        common.showSignupPop();
    });

    // 错误提示
    var errTips = document.querySelectorAll('.validate-error');
    errTips && errTips.forEach(function(el) {
        var error = el.textContent.trim();
        if (error) {
            el.style.display = 'block';
        }
    });

    // Pad, mobile 下的搜索按钮
    var inputBox    = document.getElementById('search-area'),
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
    }, false);

    // 查看消息列表
    var msgNav     = document.querySelector('#message-nav');

    if (msgNav) {
        var msgViewBtn = msgNav.querySelector('[rel="msg-view"]'),
            list   = msgNav.querySelector('.message-list'),
            newTag = msgNav.querySelector('.message-new');

        utils.setData(msgViewBtn, { show: false });

        list.addEventListener('click', function(ev) {
            var el = ev.target,
                matchesSelector = el.matches 
                || el.webkitMatchesSelector 
                || el.mozMatchesSelector 
                || el.msMatchesSelector;

            while (el && el !== ev.currentTarget) {
                if (matchesSelector.call(el, 'a.btn')) {
                    var mid     = utils.getData(el, 'mid'),
                        msgCurr = utils.closest(el, 'li');

                    req.post(
                        "/message/remove",
                        {
                            mid: mid
                        },
                        function(data) {
                            common.xhrReponseManage(data, function() {
                                effect.fadeOut(msgCurr, function(cur) {
                                    cur.parentNode.removeChild(cur);
                                });
                            });
                        },
                        function() {

                        }
                    );

                    break;
                }
                el = el.parentElement;
            }
        });

        msgViewBtn.addEventListener('click', function() {
            if (common.checkMobile()) {
                window.location.replace('/message');
                return;
            }

            if (!utils.getData(this, 'show')) {
                list.innerHTML = '加载中...';
                list.style.display = 'block';
                utils.setData(this, { show: true });
                req.getJSON(
                    "/message/boxshow",
                    null,
                    function(data) {
                        common.xhrReponseManage(data, function() {
                            if (data.data && data.data.length > 0) {
                                var mtpl  = '<li>{{ title }}<a href="{{ url }}"> {{ content }}</a> <a class="btn btn-small" data-mid="{{ _id }}">移除</a></li>',
                                    html  = data.data.map(function(item) {
                                    return _t.template(mtpl, item);
                                }).join('');
                                list.innerHTML = html
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
                    },
                    function() {
                        list.innerHTML = '加载失败。';
                    }
                );
            } else {
                list.style.display = 'none';
                utils.setData(this, { show: false });
            }
        });

        msgViewBtn.addEventListener('mousedown', function(ev) {
            ev.stopPropagation();
        });

        list.addEventListener('mousedown', function(ev) {
            ev.stopPropagation();
        });

        document.body.addEventListener('mousedown', function() {
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
    (submitBtn && submitform) && submitform.addEventListener('submit', function(){
        submitBtn.disabled = true;
        utils.addClass(submitBtn, 'disabled');
    });

    document.addEventListener("touchstart", function(){}, true);

    return common;
}));
