import React from 'react';
import ReactDOM from 'react-dom';

(function(factory) {
    module.exports = factory(
        require('utils'),
        require('../const/settings'),
        require('req').default,
        require('effect').default,
        require('common'),
        require('popup'),
        require('dropdown'),
        require('PopRouter'),
    );
}(function(utils, settings, req, effect, common, popup, dropdown, router) {
    const _d = document,
          _w = window;

    function uploadImage(ev) {
        var files = ev.target.files || ev.dataTransfer.files;
        var file = files[0];
        var fd = new FormData();
        fd.append("pic", file);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/pic/upload', true);
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
            }
        };
        xhr.onload = function() {
            if (this.status == 200) {
                var resp = JSON.parse(this.response);
            
                if (resp.result === 0) {
                    var url = resp.dataUrl,
                        imgId = resp.imageId;
                    if (url && imgId) common.showAvatarEditor(url, imgId);
                }
                else if (resp.result === 1) {
                    alert(resp.info)
                }
                else if (resp.result === 2) {
                    common.showSigninPop();
                }
            };
        };
        xhr.send(fd);
    }

    var avatarUpload = _d.querySelector('#avatarUpload');
    avatarUpload && avatarUpload.addEventListener('change', uploadImage);

    var updateAvatarBtn = _d.querySelector('#updateAvatar');
    updateAvatarBtn && updateAvatarBtn.addEventListener('click', () => {
        avatarUpload && avatarUpload.click();
    });

    var drtImageBtn = _d.querySelector('#dreamReleaseImage');
    drtImageBtn && drtImageBtn.addEventListener('click', () => {
        common.textNew('image');
    });

    // 发布文字
    var drtTextBtn = _d.querySelector('#dreamReleaseText');
    drtTextBtn && drtTextBtn.addEventListener('click', () => {
        common.textNew('text');
    });

    var drtLinkBtn = _d.querySelector('#dreamReleaseLink');
    drtLinkBtn && drtLinkBtn.addEventListener('click', () => {
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

    var ltnBtn = document.querySelector('#listTextNew');
    ltnBtn && ltnBtn.addEventListener('click', () => {
        common.textNew('news');
    });

    // 修改心情
    addUserInfoEdit('mood');

    // 修改身体状况
    addUserInfoEdit('health');

    // 修改用户信息
    function addUserInfoEdit(type) {
        let editBtn     = document.querySelector(`#${type}Edit`),
            editArea    = utils.closest(editBtn, 'div'),
            editContent = editArea.querySelector('em');

        if (editBtn) {
            utils.setData(editBtn, { editState: 'normal' });
            editBtn.addEventListener('click', () => {
                if (editContent) {
                    let state = utils.getData(editBtn, 'editState'),
                        tid   = utils.getData(editBtn, 'tid');
                    if (state === 'normal') {
                        let desc = editContent.textContent.trim();
                        editContent.innerHTML = `<input type="text" maxlength="30" value="${desc}" />`;
                        editBtn.innerHTML = "<i class='s s-save s-lg'></i> 保存";
                        utils.setData(editBtn, { editState: 'editing' });
                    }
                    else{
                        if (state !== 'saving') {
                            editBtn.textContent = "保存中...";
                            utils.setData(editBtn, { editState: 'saving' });
                            let editor = editContent.querySelector('input');

                            if (editor) {
                                let desc = editor.value.trim(),
                                    reqData = {};

                                reqData[type] = desc;

                                req.post(
                                    "/user/update",
                                    reqData,
                                    function(data) {
                                        common.xhrReponseManage(data, (data) => {
                                            editContent.innerHTML = desc;
                                            editBtn.innerHTML = "<i class='s s-edit s-lg'></i> 修改";
                                            utils.setData(editBtn, { editState: 'normal' });
                                        });
                                    },
                                    function() {
                                        alert('服务器错误');
                                    }
                                );
                            }
                        }
                    }
                }
            });
        }
    }

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
    var dreamList = document.querySelector('#dream-list');
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
                                        heartNum.innerHTML = "有" + (isNaN(num)? 0:num) + "人喜欢...";
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
                                        heartNum.innerHTML = "有" + (isNaN(num)? 0:num) + "人喜欢...";
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

    // 留言列表
    var commentList = {
        selector: '#commentList',
        climit: 10,
        init: function() {
            this.el = document.querySelector(this.selector);
            if (!this.el) return;

            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;

            var selectors = [
                '[rel="comment-delete"]',
                '[rel="comment-good"]',
                '[rel="comment-bad"]'
                ],
                handles   = [
                    this.commentDelete,
                    this.commentUp,
                    this.commentDown,
                ];
            this.el.addEventListener('click', function(ev) {
                var el = ev.target,
                    matchesSelector = el.matches 
                    || el.webkitMatchesSelector 
                    || el.mozMatchesSelector 
                    || el.msMatchesSelector;

                while (el && el !== ev.currentTarget) {
                    for (var i = 0, l = selectors.length; i < l; i++) {
                        var selector = selectors[i],
                            handle   = handles[i];

                        if (matchesSelector.call(el, selector)) {
                            handle.call(self, ev, el);
                            break;
                        }
                    }
                    el = el.parentElement;
                }
            });
        },
        commentUp: function(ev, cur) {
            var item = utils.closest(cur, '.comment-ctrl'),
                cid  = utils.getData(item, 'rid'),
                voteBox = utils.closest(cur, '.vote-ctrl-box'), voteNum, voteBad,
                hasGood = utils.getData(cur, 'hasgood');

            voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
            voteBox && (voteBad  = voteBox.querySelector('[rel="comment-bad"]'));
            if (!hasGood) {
                req.post(
                    "/comment/goodit",
                    {
                        cid: cid
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
                    "/comment/cgood",
                    {
                        cid: cid
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
        },
        commentDown: function(ev, cur) {
            var item = utils.closest(cur, '.comment-ctrl'),
                cid  = utils.getData(item, 'rid'),
                voteBox = utils.closest(cur, '.vote-ctrl-box'), voteNum, voteGood,
                hasBad = utils.getData(cur, 'hasbad');

            voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
            voteBox && (voteGood  = voteBox.querySelector('[rel="comment-good"]'));

            if (!hasBad) {
                req.post(
                    "/comment/badit",
                    {
                        cid: cid
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
                    "/comment/cbad",
                    {
                        cid: cid
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
        },
        commentDelete: function(ev, cur) {
            // 删除留言
            var item    = utils.closest(cur, '.list-item'),
                con     = item.querySelector('.comment-content'),
                cid     = utils.getData(cur, 'cid');

            req.post(
                "/comment/delete",
                {
                    cid: cid
                },
                function(data) {
                    common.xhrReponseManage(data, function(data) {
                        utils.addClass(con, 'no-exist-content');
                        con.innerHTML = '[该留言已删除]';
                        var state = document.createElement('span');
                        state.innerHTML = '已删除';
                        cur.replaceWith(state);
                    });
                },
                function() {

                }
            );
        }
    };

    commentList.init();

    common.statistics();
}));

