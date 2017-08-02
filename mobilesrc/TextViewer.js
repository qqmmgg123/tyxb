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

    render() {
        const { loading, dream, did, heartCls } = this.state;
        const href = "/user/" + (dream._belong_u && dream._belong_u._id || "unknow");
        const avatar = (dream._belong_u && dream._belong_u._avata_mini || "/images/avatar_mini.png");
        const username = (dream._belong_u && dream._belong_u.username || "未知");

        if (!loading) {
            return (
              <div className="dialog-inner">
                <div className="dialog-header">
                  <a className="avatar" href={href}>
                    <img src={avatar} />
                  </a>
                  <div className="userinfo">
                    <a className="username" href={href}>{username}</a>
                    <span className="datetime">
                    {common.dateBeautify(new Date(dream.date))}
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
                    <div className="userstate">
                      <span className="things">
                        写了一篇“文字”...
                      </span>
                    </div>
                    <h1>{dream.content || ""}</h1>
                    <div className="text-viewer-content" 
                         dangerouslySetInnerHTML={{__html: dream.text || "文字没有找到..."}}
                    />
                  </div>
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
                        <span className="vote-num" rel="vote-num">{dream.vote || 0}</span>
                      </div>
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

