(function(factory) {
    module.exports = factory(
        require('polyfill'),
        require('../const/settings'),
        require('req').default,
        require('effect').default,
        require('utils'),
        require('common'),
        require('dropdown'),
        require('share'),
        require('ejs!../views/partials/commentitem.html')
    );
} (function(p, settings, req, effect, utils, common, dropdown, Share, commentTpl) {
    // 排序下拉
    var sortSelect = dropdown.create({
        el: '[rel="nav-toggle"]',
        container: '#dream-tab-bar',
        selector: '.tab-nav',
        menu: '.nav-list',
        modal: true
    });
    
    // 分享下拉
    var shareSelect = dropdown.create({
        el: '[rel="dream-share"]',
        container: '#dreamCtrlBox',
        selector: '.share-box',
        menu: '.share-list',
        width: 'auto',
        modal: false
    });

    var viewerMore = document.querySelector('.viewer-summary-more');

    viewerMore && viewerMore.addEventListener('click', function() {
        var summary = utils.closest(this, '.viewer-summary'),
            content = summary.nextElementSibling;
        summary && summary.parentNode.removeChild(summary);
        content && (content.style.display = 'block');
    });

    var text = settings.COMMENT_TEXT;

        // 留言列表
        var commentList = {
            selector: '#dreamComment',
            climit: 10,
            init: function() {
                this.el = document.querySelector(this.selector);
                this.num = document.querySelector('#commentNum');
                
                this.bindEvent();
            },
            bindEvent: function() {
                var self = this;

                var selectors = [
                    '#comment_create_btn',
                    '[rel="comments-hot"]',
                    '[rel="comments-new"]',
                    '[rel="comment-good"]',
                    '[rel="comment-bad"]',
                    '[rel="comment-delete"]',
                    '[rel="comment-new"]',
                    '[rel="comment-reply"]',
                    '[rel="cancel-reply"]',
                    '[rel="comment-input"]',
                    '[rel="query-all-comments"]',
                    '[rel="load-comments-prev"]',
                    '[rel="load-comments-next"]'],
                    handles   = [
                        this.dCommentNew,
                        this.loadComments,
                        this.loadComments,
                        this.commentUp,
                        this.commentDown,
                        this.itemDelete,
                        this.showInput,
                        this.cCommentNew,
                        this.cancelReply,
                        this.comentInput,
                        this.loadComments,
                        this.loadComments,
                        this.loadComments
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
            // 回复输入框操作
            comentInput: function(ev, cur) {
                var cchild   = utils.closest(cur, '.comment-child'),
                    cctrl    = cchild.previousElementSibling,
                    hasLogged = utils.getData(cctrl, 'haslogged');

                
                if (!hasLogged) {
                    cchild.querySelector('textarea').blur();
                    common.showSigninPop();
                }
            },
            itemDelete: function(ev, cur) {
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
            },
            loadComments: function(ev, cur) {
                var self  = this,
                    page  = utils.getData(cur, 'cnext'),
                    reply = utils.getData(cur, 'reply'),
                    role  = utils.getData(cur, 'sort'),
                    rid = utils.getData(cur, 'rid'),
                    type = '',
                    commentList = null;

                switch(parseInt(reply, 10)) {
                    case settings.OBJEXT_TYPE.DREAM:
                        type = 'dream';
                        break;
                    case settings.OBJEXT_TYPE.COMMENT:
                        type = 'comment';
                        break;
                }

                if (!type) return;

                var ctrlType = cur.getAttribute('rel'),
                    ctrlBox = cur,
                    url     = '/' + type + '/' + rid + "/comments";

                // 加载中显示
                if (ctrlType === 'query-all-comments') {
                    ctrlBox = cur.parentNode.parentNode;
                    ctrlBox.innerHTML = "<p>加载中...</p>";
                    commentList = ctrlBox.nextElementSibling;
                } else if (ctrlType === 'comments-hot' || ctrlType === 'comments-new') {
                    var focus = utils.getData(cur, 'focus');

                    ctrlBox = document.createElement('div');
                    ctrlBox.className = 'more';
                    ctrlBox.innerHTML = '<a class="btn">加载中...</a>';
                    commentList = this.el.querySelector('.comment-list');
                    commentList.innerHTML = '';
                    commentList.appendChild(ctrlBox);

                    if (focus === 'comment') {
                        url     = '/' + type + '/' + rid;
                    }

                    utils.closest(cur, 'ul').querySelectorAll('a').forEach(function(tab) {
                        if (utils.hasClass(tab, 'cur')) {
                            utils.removeClass(tab, 'cur');
                        }
                    });
                    utils.addClass(cur, 'cur');
                } else {
                    if (ctrlType === 'load-comments-prev') {
                        url     = '/' + type + '/' + rid;
                    } else {
                        var btext = ctrlBox.querySelector('.btn');
                        btext.lastChild.nodeValue = "加载中...";
                    }
                    commentList = utils.closest(cur, '.comment-list');
                }

                req.getJSON(
                    url,
                    {
                        p: page || 1,
                        r: role
                    },
                    function(data) {
                        var tpl = "";
                        common.xhrReponseManage(data, function(data) {
                            var user  = !!data.user,
                                level = 0;

                            data = data.data;

                            if (data.comments && data.comments.length > 0) {
                                var html = '';
                                if (data.hasprev) {
                                    var prev =  [
                                        '<div ',
                                        'data-rid="' + data.comments[0]._reply_c + '" data-reply="1" data-cnext="1" data-sort="' + data.role + '" ',
                                        'rel="load-comments-prev" class="more">',
                                        '<a class="btn">查看上层留言</a>',
                                        '</div>'
                                    ].join('');
                                    html += prev;
                                }
                                
                                html += listComment(data.comments);

                                if (data.hasmore) {
                                    var more = [
                                        '<div ',
                                        'data-rid="' + rid + '" data-reply="1" data-cnext="' + data.cnext + '" data-sort="' + data.role + '" ',
                                        'rel="load-comments-next" class="more">',
                                        '<a class="btn">查看更多 ></a>',
                                        '</div>'
                                    ].join('');
                                    html += more;
                                }
                                ctrlBox.parentNode.removeChild(ctrlBox);
                                if (ctrlType === 'query-all-comments' || 
                                    ctrlType === 'load-comments-prev' || 
                                    ctrlType === 'comments-hot' ||
                                    ctrlType === 'comments-new') {
                                    commentList.innerHTML = html;
                                } else {
                                    commentList.innerHTML += html;
                                }
                            }else{
                                if (ctrlType === 'comments-hot' ||
                                    ctrlType === 'comments-new') {
                                        var failText = '<li class="list-item"><div class="result">: ( 该贴文没有留言。</div></li>';
                                        commentList.innerHTML = failText;
                                    }
                            }

                            function listComment(comments) {
                                level++;
                                return comments.map(function(comment, i) {
                                    if (comment.replys && comment.replys.length > 0) {
                                        comment.replys = listComment(comment.replys);

                                        if (comment.hasmore) {
                                            var more = [
                                                '<div ',
                                                'data-rid="' + comment._id + '" data-reply="1" data-cnext="2" data-sort="' + data.role + '" ',
                                                'rel="load-comments-next" class="more">',
                                                '<a class="btn">查看更多 ></a>',
                                                '</div>'
                                            ].join('');
                                            comment.replys += more;
                                        }
                                    } else if (level === 3) {
                                        if (comment.hasmore) {
                                            var more = [
                                                '<div ',
                                                'data-rid="' + comment._id + '" data-reply="1" data-cnext="1" data-sort="' + data.role + '" ',
                                                'rel="load-comments-next" class="more">',
                                                '<a class="btn">查看下层留言</a>',
                                                '</div>'
                                            ].join('');
                                            comment.replys = more;
                                        }
                                    }

                                    var item = {};
                                    item.comment = comment;
                                    item.user = user;
                                    item.text = data.text;
                                    item = utils.extend(item, { 
                                        timeFormat: function(date) {
                                            var date = new Date(date);
                                            return common.dateBeautify(date);
                                        }
                                    });

                                    if (i == comments.length - 1) level--;
                                    return '<li class="list-item">' + commentTpl(item) + '</li>'
                                }).join('');
                            }
                        });

                        if (ctrlType === 'query-all-comments') {
                            changeTabFocus();
                        }
                    },
                    function() {
                        var failText = "<li>加载更多失败</li>";
                        if (ctrType === 'query-all-comments') {
                            changeTabFocus();
                            commentList.innerHTML = failText;
                        } else {
                            commentList.innerHTML += failText;
                        }
                    }
                );

                function changeTabFocus() {
                    var nav = self.el.querySelector('.tab-nav');
                    nav.querySelectorAll('a').forEach(function(tab) {
                        var did = utils.getData(tab, 'did');
                        utils.setData(tab, { focus: 'dream' });
                        utils.setData(tab, { rid: did });
                        utils.setData(tab, { reply: 0 });
                    });
                }

            },
            showInput: function(ev, cur) {
                // 添加回复
                var self = this,
                    belong = utils.closest(cur, '.comment-ctrl'),
                    commentChild = belong.nextElementSibling,
                    input   = commentChild.querySelector('.comment-input');

                // 显示并切换到展开回复状态
                input.style.display = 'block';
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
            commentNew: function(cur, belong, reply, iscomment) {
                var self         = this,
                    commentList  = belong.querySelector('.comment-list'),
                    textarea     = belong.querySelector('textarea'),
                    rid          = utils.getData(belong, 'rid'),
                    newcon       = textarea.value.trim();

                var infoTip = cur.nextElementSibling;

                if (!newcon) {
                    infoTip && (infoTip.innerHTML = settings.COMMENT_REQUIRE_ERR);
                    infoTip && (infoTip.style.display = "block");
                    utils.addClass(infoTip, 'color-error');
                    return;
                }

                utils.removeClass(infoTip, 'color-error');
                infoTip && (infoTip.innerHTML = "留言发布中，请稍等...");

                var data = {
                    rid     : rid,
                    reply   : reply,
                    content : newcon
                };

                req.post(
                    "/comment/new",
                    data,
                    function(data) {
                        common.xhrReponseManage(data, function(data) {
                            infoTip && (infoTip.style.display = "none");
                            infoTip && (infoTip.innerHTML = "");
                            textarea.value = '';
                            if (iscomment) {
                                textarea.parentNode.style.display = 'none';
                            }
                            data = utils.extend(data, { 
                                timeFormat: function(date) {
                                    var date = new Date(date);
                                    return common.dateBeautify(date);
                                }
                            });

                            var newCom = document.createElement('li');
                            newCom.className = "list-item";
                            newCom.innerHTML = commentTpl(data);
                            
                            if (!commentList) {
                                commentList = document.createElement('li');
                                commentList.className = "comment-list";
                                belong.appendChild(commentList);
                            }

                            commentList.insertBefore(newCom, commentList.children[0]);
                            if (self.num) {
                                var num = parseInt(self.num.innerHTML, 10);
                                self.num.innerHTML = num + 1;
                            }

                            var nodata = commentList.querySelector('.result');
                            if (nodata) {
                                nodata.parentNode.removeChild(nodata);
                            }
                        });
                    },
                    function() {

                    }
                );
            },
            dCommentNew: function(ev, cur) {
                 var self        = this,
                    belong       = document.querySelector('#dreamComment'),
                    reply        = settings.OBJEXT_TYPE.DREAM;

                self.commentNew(cur, belong, reply);
            },
            cCommentNew: function(ev, cur) {
                var self         = this,
                    belong       = utils.closest(cur, '.comment-child'),
                    reply        = settings.OBJEXT_TYPE.COMMENT;

                self.commentNew(cur, belong, reply, true);
            },
            cancelReply: function(ev, cur) {
                // 添加回复
                var self = this,
                    input = utils.closest(cur, '.comment-input');

                // 显示并切换到展开回复状态
                input.style.display = 'none';
            }
        };

        commentList.init();

        // 分享想法
        var tit = document.querySelector("#sharetitle"),
            pic = document.querySelector("#shareimg"),
            intro = document.querySelector("#shareintro"),
            wbShareBtn = document.querySelector('#wb_share'),
            qzoneShareBtn = document.querySelector('#qzone_share');

        var dreamShare= new Share({
            "tit": tit && tit.innerHTML,
            "pic": pic && pic.src,
            "url": window.location.href,
            "intro": intro && intro.innerHTML
        });

        // 分享到微博
        wbShareBtn && wbShareBtn.addEventListener('click', function(){
            dreamShare.shareToSina();
        });

        // 分享到Qzone
        qzoneShareBtn && qzoneShareBtn.addEventListener('click', function(){
            dreamShare.postToQzone();
        });



    function animate(elem, style, unit, from, to, time, prop) {
        if (!elem) {
            return;
        }
        var start = new Date().getTime(),
            timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                if (prop) {
                    elem[style] = (from + step * (to - from))+unit;
                } else {
                    elem.style[style] = (from + step * (to - from))+unit;
                }
                if (step === 1) {
                    clearInterval(timer);
                }
            }, 25);
        if (prop) {
            elem[style] = from + unit;
        } else {
            elem.style[style] = from + unit;
        }
    }

    // 回到顶部按钮
    var backTopBtn = document.querySelector('.back-top');
    backTopBtn && backTopBtn.addEventListener('click', function() {
        var scrollEl = document.scrollingElement || document.documentElement;
        animate(scrollEl, "scrollTop", "", scrollEl.scrollTop, 0, 360, true);
    });

    // 想法操作
    var dreamCtrlBox = document.querySelector('#dreamCtrlBox');
    dreamCtrlBox && dreamCtrlBox.addEventListener('click', function(ev) {
        var cur  = ev.target;

        while(cur.getAttribute &&
            ['dream-good', 'dream-bad', 'dream-favourite', 'dream-delete'].indexOf(cur.getAttribute('rel'))
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
                                window.location.reload(true);
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
        }
    });

    common.statistics();
}));
