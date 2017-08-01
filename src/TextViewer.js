import req from 'req';

const common   = require('common');

export default class TextViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading  : true,
            did      : '',
            heartCls : 's s-arrow_up s-2x',
            hasHeart : false,
            dream    : {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.did && nextProps.did !== this.state.did) {
            this.loadContent(nextProps.did);
        }
    }

    loadContent(did) {
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
                        hasCls = hasHeart? "s s-arrow_up s-2x s-ac":"s s-arrow_up s-2x";

                    this.setState({
                        dream: dream,
                        hasHeart: hasHeart,
                        did: did,
                        hasCls: hasCls,
                        loading: false,
                    });
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
        const { container } = this.props;
        container.close();
        const state = History.getState(),
            { action } = state.data;
        if (action && action !== 'signin') {
            History.replaceState({ action: 'signin'}, 'signin', "?popup=signin");
        }
    }

    heartIt(ev) {
        const { did, dream } = this.state,
            hasHeart = !!(dream.good && dream.good[0]);

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
                                this.setState({
                                    hearNum: data.data.num,
                                    hasHeart: true,
                                    heartCls: "s s-arrow_up s-2x s-ac"
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
                                this.setState({
                                    hearNum: data.data.num,
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
                    {dream.date}
                    </span>
                    <span className="things">
                        写了一篇“文字”...
                    </span>
                  </div>
                  <div className="userctrl">
                    <a href="javascript:;">
                      <i className="s s-remove s-lg"></i>删除
                    </a>
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

