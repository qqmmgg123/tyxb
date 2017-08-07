import req from 'req';
import effect from 'effect';

const common   = require('common');
const utils    = require('utils');

export default class TextViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading  : true,
            did      : '',
            heartCls : 's s-arrow_up s-2x',
            hasHeart : false,
            dream    : {},
            el       : null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.did && nextProps.did !== this.state.did) {
            this.loadContent(nextProps);
        }
    }

    loadContent(props) {
        const { did, el } = props;

        this.setState({
            loading: true
        });

        req.getJSON(
            "/dream/textloaded",
            {
                did: did
            },
            (data) => {
                try {
                    common.xhrReponseManage(data, (data) => {
                        let dream = {};

                        if (data.data && data.data.dream) {
                            dream = data.data.dream;
                        }

                        let hasHeart = !!(dream.good && dream.good[0]),
                            heartCls = hasHeart? "s s-arrow_up s-2x s-ac":"s s-arrow_up s-2x";

                        let state = {
                            dream: dream,
                            hasHeart: hasHeart,
                            did: did,
                            heartCls: heartCls,
                            loading: false
                        }

                        if (el) state.el = el;

                        this.setState(state);
                    });
                }
                catch(err) {
                    alert(err.message);
                }
            },
            () => {
                this.close();
                alert("网络异常，内容获取失败");
            }
        );
    }

    showLogin() {
        try{
            this.close();
            const state = History.getState(),
                { action } = state.data;
            if (action && action !== 'signin') {
                History.replaceState({ action: 'signin'}, 'signin', "?popup=signin");
            }
        }
        catch(err) {
            alert(err.message);
        }
    }

    deleteDream() {
        const { did, el } = this.state;
        req.post(
            "/dream/delete",
            {
                did: did
            },
            (data) => {
                try {
                    switch (data.result) {
                        case 0:
                            this.close();
                            if (el) {
                                effect.fadeOut(el, function(el) {
                                    el.parentNode.removeChild(el);
                                });
                            }
                            break;
                        case 1:
                            alert(data.info);
                            break;
                        case 2:
                            this.showLogin();
                            break;
                        default:
                            break;
                    };
                } catch(err) {
                    alert(err.message);
                }
            },
            () => {
            }
        );
    }

    heartIt(ev) {
        let { did, dream, hasHeart, el } = this.state;

        if (!hasHeart) {
            req.post(
                "/dream/goodit",
                {
                    did: did
                },
                (data) => {
                    switch(data.result) {
                        case 0:
                            if (data.data) {
                                let num = parseInt(data.data.num);
                                dream.vote = (isNaN(num)? 0:num);
                                let cls = "s s-arrow_up s-2x s-ac";
                                if (el) {
                                    let heart = el.querySelector("a.owed"),
                                        heartNum = heart.querySelector('[rel="vote-num"]');
                                    utils.addClass(heart.querySelector('i'), "s-ac");
                                    utils.setData(heart, { 'hasgood': true });
                                    heartNum.innerHTML = dream.vote;
                                }
                                this.setState({
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
                            this.showLogin();
                            break;
                        default:
                            break;
                    }
                },
                () => {
                }
            );
        }else{
            req.post(
                "/dream/cgood",
                {
                    did: did
                },
                (data) => {
                    switch(data.result) {
                        case 0:
                            if (data.data) {
                                let num = parseInt(data.data.num);
                                dream.vote = (isNaN(num)? 0:num);
                                let cls = "s s-arrow_up s-2x s-ac";
                                if (el) {
                                    let heart = el.querySelector("a.owed"),
                                        heartNum = heart.querySelector('[rel="vote-num"]');
                                    utils.removeClass(heart.querySelector('i'), "s-ac");
                                    utils.setData(heart, { 'hasgood': false });
                                    heartNum.innerHTML = dream.vote;
                                }
                                this.setState({
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
                            this.showLogin();
                            break;
                        default:
                            break;
                    }
                },
                () => {
                }
            );
        }
    }

    close() {
        const { dialog } = this.props;
        dialog.close();

        window.curDreamItem = null;
    }

    get removeText() {
        const { dream } = this.state;

        if (dream.isowner) {
            if (!dream.isremove) {
                return (
                    <a href="javascript:;"
                    onClick={this.deleteDream.bind(this)}
                    >
                    <i className="s s-remove s-lg"></i>删除
                    </a>
                );
            }
            else{
                return (
                    <span>已删除</span>
                );
            }
        }
        else{
            return null;
        }
    }

    // 回复输入框操作
    comentInput(ev, cur) {
        var cchild   = utils.closest(cur, '.comment-child'),
            cctrl    = cchild.previousElementSibling,
            hasLogged = utils.getData(cctrl, 'haslogged');


        if (!hasLogged) {
            cchild.querySelector('textarea').blur();
            common.showSigninPop();
        }
    }

    itemDelete(ev, cur) {
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

    loadComments(ev, cur) {
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
                                '<li class="list-item"><div ',
                                'data-rid="' + data.comments[0]._reply_c + '" data-reply="1" data-cnext="1" data-sort="' + data.role + '" ',
                                'rel="load-comments-prev" class="more">',
                                '<a class="btn">查看上层留言</a>',
                                '</div></li>'
                            ].join('');
                            html += prev;
                        }

                        html += listComment(data.comments);

                        if (data.hasmore) {
                            var more = [
                                '<li class="list-item"><div ',
                                'data-rid="' + rid + '" data-reply="1" data-cnext="' + data.cnext + '" data-sort="' + data.role + '" ',
                                'rel="load-comments-next" class="more">',
                                '<a class="btn">查看更多 ></a>',
                                '</div></li>'
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
                                        '<li class="list-item"><div ',
                                        'data-rid="' + comment._id + '" data-reply="1" data-cnext="2" data-sort="' + data.role + '" ',
                                        'rel="load-comments-next" class="more">',
                                        '<a class="btn">查看更多 ></a>',
                                        '</div></li>'
                                    ].join('');
                                    comment.replys += more;
                                }
                            } else if (level === 3) {
                                if (comment.hasmore) {
                                    var more = [
                                        '<li class="list-item"><div ',
                                        'data-rid="' + comment._id + '" data-reply="1" data-cnext="1" data-sort="' + data.role + '" ',
                                        'rel="load-comments-next" class="more">',
                                        '<a class="btn">查看下层留言</a>',
                                        '</div></li>'
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
            var nav = self.el.querySelector('.tag-list');
            nav.querySelectorAll('a').forEach(function(tab) {
                var did = utils.getData(tab, 'did');
                utils.setData(tab, { focus: 'dream' });
                utils.setData(tab, { rid: did });
                utils.setData(tab, { reply: 0 });
            });
        }

    }

    showInput(ev, cur) {
        // 添加回复
        var self = this,
            belong = utils.closest(cur, '.comment-ctrl'),
            commentChild = belong.nextElementSibling,
            input   = commentChild.querySelector('.comment-input');

        // 显示并切换到展开回复状态
        input.style.display = 'block';
    }

    commentUp(ev, cur) {
        var item = utils.closest(cur, '.comment-ctrl'),
            cid  = utils.getData(item, 'rid'),
            hasHeart = utils.getData(cur, 'hasgood'),
            heartNum = cur.querySelector('[rel="vote-num"]');
        if (!hasHeart) {
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

    commentDown(ev, cur) {
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
    }

    commentNew(cur, belong, reply, iscomment) {
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
    }

    dCommentNew(ev, cur) {
        var self        = this,
            belong       = document.querySelector('#dreamComment'),
            reply        = settings.OBJEXT_TYPE.DREAM;

        self.commentNew(cur, belong, reply);
    }

    cCommentNew(ev, cur) {
        var self         = this,
            belong       = utils.closest(cur, '.comment-child'),
            reply        = settings.OBJEXT_TYPE.COMMENT;

        self.commentNew(cur, belong, reply, true);
    }

    cancelReply(ev, cur) {
        // 添加回复
        var self = this,
            input = utils.closest(cur, '.comment-input');

        // 显示并切换到展开回复状态
        input.style.display = 'none';
    }

    render() {
        const { loading, dream, did, heartCls } = this.state;
        const href = "/user/" + (dream._belong_u && dream._belong_u._id || "unknow");
        const username = (dream._belong_u && dream._belong_u.username || "未知");

        if (!loading) {
            return (
              <div className="dialog-inner">
                <div className="dialog-header">
                  <div className="userinfo">
                    <a className="username" href={href}>{username}</a>
                    <span className="datetime">
                    {common.dateBeautify(new Date(dream.date))}
                    </span>
                    <span className="things">
                        写了一篇“文字”...
                    </span>
                  </div>
                  <div className="userctrl">
                    {this.removeText}
                    <a href="javascript:;" 
                       className="close" 
                       onClick={this.close.bind(this)}
                    >
                      <i className="s s-close s-2x"></i>
                    </a>
                  </div>
                </div>
                <div className="dialog-container">
                  <div className="text-viewer-box">
                    <h1>{dream.content || ""}</h1>
                    <div className="text-viewer-content" 
                         dangerouslySetInnerHTML={{__html: dream.text || "文字没有找到..."}}
                    />
                  </div>
                  <div data-rid={dream._id} 
                    id="dreamComment" 
                    className="dream-comment"
                  >
                    <div className="comment-input">
                      <textarea 
                        id="comment-editor" 
                        placeholder="说说你的看法..." 
                        name="content"></textarea>
                      <div className="btn-group">
                        <button type="submit" 
                          id="comment_create_btn" 
                          className="btn">送出 ></button>
                        <div className="common-new-state" 
                          style="display: none;">
                        </div>
                      </div>
                    </div>
                  <div>
                  <div className="tag-list">
                    <ul>
                      <li>
                        <a data-rid={dream._id} 
                          data-reply="0" 
                          data-cnext="1" 
                          data-sort="1" 
                          data-focus="<% data.focus %>" 
                          rel="comments-hot" 
                          className="tag cur" href="javascript:;">受欢迎的
                        </a>
                      </li>
                      <li>
                        <a data-rid={dream._id} 
                          data-reply="0" 
                          data-cnext="1" 
                          data-sort="2" 
                          data-focus="<% data.focus %>" 
                          rel="comments-new" 
                          className="tag cur" href="javascript:;">新发布的
                        </a>
                      </li>
                    </ul>
                  </div>
                  <ul className="list-group comment-list">
                  </ul>
                </div>
                <div className="dialog-footer">
                  <div className="ctrl-box">
                    <a className="owed" 
                      href="javascript:;" 
                      title="喜欢" 
                      onClick={this.heartIt.bind(this)}
                      >
                      <div className="owed-inner">
                        <i className={heartCls}></i>
                        <span className="vote-num" rel="vote-num">有{dream.vote || 0}人喜欢...</span>
                      </div>
                    </a>
                    <a href="javascript:;" 
                      data-did="<%= dream._id %>" 
                      rel="comment-view"
                    >留言&nbsp;
                      <span className="comment-num">{dream.cnum}</span>
                    </a>
                  </div>
                </div>
            </div>
            )
        }
        else{
            return (
                <div id="loading">
                    <div id="loading-center">
                        <div id="loading-center-absolute">
                            <div className="object" id="object_zero"></div>
                            <div className="object" id="object_one"></div>
                            <div className="object" id="object_two"></div>
                            <div className="object" id="object_three"></div>
                            <div className="object" id="object_four"></div>
                            <div className="object" id="object_five"></div>
                            <div className="object" id="object_six"></div>
                            <div className="object" id="object_seven"></div>
                            <div className="object" id="object_eight"></div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

