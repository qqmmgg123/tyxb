// 版面聚合页
(function() {
    var utils    = require('utils'),
        settings = require('../const/settings'),
        req      = require('req').default,
        common   = require('common'),
        popup    = require('popup'),
        autocomplete = require('autocomplete').default;

    require('PopRouter');

    var _d = document;

    // 查找版面
    var tagSearchForm = _d.querySelector('#tagSearchForm'),
        tagSearchBtn  = _d.querySelector('#tagSearchBtn');
    tagSearchBtn && tagSearchBtn.addEventListener('click', function() {
        tagSearchForm && tagSearchForm.submit();
    });

    // 自动查询tag
    var con = _d.querySelector('.tag-input'), auc = null;
    con && (auc = autocomplete({
        con: con,
        inp: 'input[type="text"]',
        url: '/search/tags',
        style: 'link',
        map: {
            query: 'key',
            list: 'data.tags',
            key: 'key',
            value: '_id',
            fillVal: false
        },
        onEnter: function() {
            tagSearchForm && tagSearchForm.submit();
        },
        onSelected: function(item) {
            window.location.replace('/tag/' + item.value);
        }
    }));

    auc && auc.inp.focus();

    // 新增版面
    var tagAddBtn = _d.querySelector('#tagAddBtn');
    tagAddBtn && tagAddBtn.addEventListener('click', function() {
        popup.tagNewPop({
            id  : 'tagNewPop',
            data : {
                tagName: auc? auc.inp.value:''
            }
        }).show();
    });

    // 创建版面
    var tagCreateBtn = _d.querySelector('#tag-create-btn');
    tagCreateBtn && tagCreateBtn.addEventListener('click', function() {
        popup.tagNewPop({
            id  : 'tagNewPop',
            data : {
                tagName: ''
            }
        }).show();
    });
    
    // 订阅版面
    var tagList = _d.querySelector('#tag-list');
    tagList && tagList.addEventListener('click', function(ev) {
        var cur  = ev.target,
            tid  = utils.getData(cur, 'tid'),
            hasSubscribe = utils.getData(cur, 'hassubscribe');

        while(cur.getAttribute &&
            ['tag-subscribe'].indexOf(cur.getAttribute('rel'))
                === -1 && cur.parentNode &&
                cur.parentNode !== ev.currentTarget) {
                    cur = cur.parentNode;
                }

        if (cur.getAttribute && cur.getAttribute('rel')) {
            var rel = cur.getAttribute('rel');

            if (rel === 'tag-subscribe') {
                if (!hasSubscribe) {
                    req.post(
                        "/tag/subscribe",
                        {
                            tid: tid
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    cur.innerHTML = settings.CANCEL_SUBSCRIBE
                                    utils.setData(cur, { 
                                        'hassubscribe': true
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
                            }
                        },
                        function() {
                        }
                    );
                }else{
                    req.post(
                        "/tag/csubscribe",
                        {
                            tid: tid
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    cur.innerHTML = settings.SUBSCRIBE;
                                    utils.setData(cur, { 
                                        'hassubscribe': false
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
                            }
                        },
                        function() {
                        }
                    );
                }
            }
        }
    });
}())
