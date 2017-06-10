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
        require('ejs!../views/partials/postitem.html')
    );
}(function(utils, req, effect, common, dropdown, popup, dreamTpl) {
    var _d = document;

    let viewerCon = document.querySelector('#imageViewer');
    
    let imageViewer = ReactDOM.render(
        <Dialog 
            needMouse={true} 
            needKey={true} 
            needWin={false}
            sence={{
            name: "ImageViewer",
            component: ImageViewer
        }} />,
        viewerCon
    );

    imageViewer.create();

    let textPop = null;
        
    History.Adapter.bind(window, 'statechange', function() {
        console.log('come on...')
        let state = History.getState();
        console.log(state);
        if (state.data && state.data.release) {
            if (state.data.release === "dialog") {
                imageViewer.show();
            }
            else if (state.data.release === "register") {
                window.regPop = popup.registrationPop({ 
                    cur: 'signin'
                });
                window.regPop.show();
            }
            else{
                console.log('~~~~~~~~~~~~~~~~~~~')
                textPop = common.textNew(state.data.release);
            }
        }
        else{
            imageViewer && imageViewer.close();
            textPop && textPop.close();
            window.regPop && window.regPop.close();
        }
    });

    var drtImageBtn = _d.querySelector('#dreamReleaseImage');
    drtImageBtn && drtImageBtn.addEventListener('click', () => {
        textPop = common.textNew('image');
    });

    // 发布文字
    var drtTextBtn = _d.querySelector('#dreamReleaseText');
    drtTextBtn && drtTextBtn.addEventListener('click', () => {
        textPop = common.textNew('text');
    });

    var drtLinkBtn = _d.querySelector('#dreamReleaseLink');
    drtLinkBtn && drtLinkBtn.addEventListener('click', () => {
        textPop = common.textNew('link');
    });

    var drtNewsBtn = _d.querySelector('#dreamReleaseNews');
    drtNewsBtn && drtNewsBtn.addEventListener('click', () => {
        let state = History.getState();
        if (!state.data.release) {
            History.pushState({ release: "news"}, "发图文链接", "/release");
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
            ['dream-good', 'dream-bad', 'dream-favourite', 'dream-delete', 'dream-picsrc', 'dream-more'].indexOf(cur.getAttribute('rel'))
                === -1 && cur.parentNode &&
                cur.parentNode !== ev.currentTarget) {
                    cur = cur.parentNode;
                }

        if (cur.getAttribute && cur.getAttribute('rel')) {
            var rel = cur.getAttribute('rel'),
                did = utils.getData(cur, 'did');

            if (rel === 'dream-good') {
                var voteBox = utils.closest(cur, '.vote-ctrl-box'), voteNum, voteBad,
                    hasGood = utils.getData(cur, 'hasgood');
            
                voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
                voteBox && (voteBad  = voteBox.querySelector('[rel="dream-bad"]'));
                if (!hasGood) {
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
                                        voteNum.innerHTML = (isNaN(num)? 0:num);
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
                                        voteNum.innerHTML = (isNaN(num)? 0:num);
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
            // 反对
            else if (rel === 'dream-bad') {
                var voteBox = utils.closest(cur, '.vote-ctrl-box'), voteNum, voteGood,
                    hasBad = utils.getData(cur, 'hasbad');

                voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
                voteBox && (voteGood  = voteBox.querySelector('[rel="dream-good"]'));

                if (!hasBad) {
                    req.post(
                        "/dream/badit",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.addClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasbad': true });
                                        voteNum.innerHTML = (isNaN(num)? 0:num);;
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
                        },
                        function() {
                        }
                    );
                }else{
                    req.post(
                        "/dream/cbad",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.removeClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasbad': false });
                                        voteNum.innerHTML = (isNaN(num)? 0:num);
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
            }else if (rel === 'dream-picsrc') {
                ev.preventdefault;
                let thumb   = cur.querySelector('img'),
                    src     = thumb.src.replace('picmini', 'pic');

                imageViewer.setComProps({
                    imageSrc: src
                });
                imageViewer.show();
            }
        }
    });

    common.statistics();
}));

