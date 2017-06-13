(function(factory) {
    module.exports = factory(
        require('req').default,
        require('effect').default,
        require('utils'),
        require('common'),
        require('PopRouter')
    );
} (function (req, effect, utils, common, router) {
    // 消息列表
    var msgList = {
        selector: '#msg-list',
        init: function() {
            this.el = document.querySelector(this.selector);
            this.bindEvent();
        },
        bindEvent: function() {
            this.el.addEventListener('click', function(ev) {
                var el = ev.target,
                    matchesSelector = el.matches 
                    || el.webkitMatchesSelector 
                    || el.mozMatchesSelector 
                    || el.msMatchesSelector;

                while (el && el !== ev.currentTarget) {
                    if (matchesSelector.call(el, 'a[rel="message-remove"]')) {
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
                            function() {}
                        );
                        break;
                    }
                    el = el.parentElement;
                }
            });
        }
    };

    msgList.init();

    common.statistics();
}));
