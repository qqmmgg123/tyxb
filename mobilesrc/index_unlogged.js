import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'Dialog';
import ImageViewer from 'ImageViewer';

(function(factory) {
    module.exports = factory(
        require('utils'),
        require('req').default,
        require('effect').default,
        require('common'),
        require('dropdown'),
        require('popup'),
        require('PopRouter'),
    );
}(function(utils, req, effect, common, dropdown, popup, router) {
    const _d = document,
          _w = window;

    var postImageBtn = _d.querySelector('#postImage');
    postImageBtn && postImageBtn.addEventListener('click', () => {
        common.textNew('image');
    });

    // 发布文字
    var postTextEdit = _d.querySelector('#PostText');
    postTextEdit && postTextEdit.addEventListener('focus', () => {
        common.textNew('text');
    });

    var postLinkBtn = _d.querySelector('#postLink');
    postLinkBtn && postLinkBtn.addEventListener('click', () => {
        common.textNew('news');
    });

    var drtNewsBtn = _d.querySelector('#dreamReleaseNews');
    drtNewsBtn && drtNewsBtn.addEventListener('click', () => {
        const Btns = _d.querySelector('#dreamPostBtns'),
            show   = utils.getData(drtNewsBtn, 'show');
        if (!show) {
            Btns && utils.addClass(Btns, 'show');
            drtNewsBtn.querySelector('i').className = "s s-close s-2x";
            utils.setData(drtNewsBtn, {
                show: true
            });
        }else{
            Btns && utils.removeClass(Btns, 'show');
            drtNewsBtn.querySelector('i').className = "s s-edit s-2x";
            utils.setData(drtNewsBtn, {
                show: false
            });
        }
    });

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
    rfBtn && rfBtn.addEventListener('click', function() {
        utils.addClass(this, 'spin');
        window.location.reload();
    });

    // 分享下拉
    var shareSelect = dropdown.shareDrop({
        el: '[rel="dream-share"]',
        container: '#dream-list',
        selector: '.share-box',
        menu: '.share-list',
        width: 'auto',
        modal: false
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
    var dreamList = _d.querySelector('#dream-list');
    dreamList && dreamList.addEventListener('click', function(ev) {
        var cur  = ev.target;

        while(cur.getAttribute &&
            [
             'dream-good',
             'dream-bad',
             'dream-favourite',
             'dream-delete',
             'dream-picsrc',
             'text-view',
             'key-category',
             'key-mood',
             'key-health'
            ].indexOf(cur.getAttribute('rel'))
                === -1 && cur.parentNode &&
                cur.parentNode !== ev.currentTarget) {
                    cur = cur.parentNode;
                }

        if (cur.getAttribute && cur.getAttribute('rel')) {
            var rel = cur.getAttribute('rel'),
                did = utils.getData(cur, 'did');

            if (rel === 'dream-good') {
                let heartNum, Heart,
                    ctrlBox = utils.closest(cur, '.ctrl-box'),
                    hasHeart = utils.getData(cur, 'hasgood');
            
                Heart  = ctrlBox.querySelector('[rel="dream-good"]');
                heartNum = Heart.querySelector('[rel="vote-num"]');
                if (!hasHeart) {
                    req.post(
                        "/dream/goodit",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.addClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasgood': true });
                                        heartNum.innerHTML = (isNaN(num)? 0:num);
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
                        },
                        function() {
                        }
                    );
                }else{
                    req.post(
                        "/dream/cgood",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.removeClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasgood': false });
                                        heartNum.innerHTML = (isNaN(num)? 0:num);
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
                        },
                        function() {
                        }
                    );
                }
            }
            // 收藏/取消收藏
            else if (rel === 'dream-favourite') {
                var hasFav = utils.getData(cur, 'hasfav');

                if (!hasFav) {
                    req.post(
                        "/dream/following",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
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
                        },
                        function() {

                        }
                    );
                }else{
                    req.post(
                        "/dream/cfollowing",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
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
                        },
                        function() {
                        }
                    );
                }
            }
            // 删除想法
            else if (rel === 'dream-delete') {
                var curDreamItem = utils.closest(cur, '.list-item');
                req.post(
                    "/dream/delete",
                    {
                        did: did
                    },
                    function(data) {
                        switch (data.result) {
                            case 0:
                                effect.fadeOut(curDreamItem, function(el) {
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
                    },
                    function() {
                    }
                );
            }
            else if (rel === 'dream-picsrc') {
                ev.preventdefault;
                let thumb   = cur.querySelector('img'),
                    src     = thumb.src.replace('picmini', 'uploads');
                common.showImageViewer(src);
            }
            else if (rel === 'text-view') {
                ev.preventdefault;
                let did = utils.getData(cur, "did");
                _w.curDreamItem = utils.closest(cur, '.list-item');
                common.showTextViewer(did, cur);
            }
        }
    });

    common.statistics();
}));

