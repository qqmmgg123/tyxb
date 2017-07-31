import req from 'req';

const common   = require('common');

export default class TextViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading  : true,
            did      : '',
            hasHeart : false,
            heartNum : 0,
            heartCls : 's s-arrow_up s-2x',
            content  : '',
            text     : ''
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
                    let content = "", 
                        text = "文字没有找到...";

                    if (data.data && data.data.dream) {
                        let dream = data.data.dream;
                        content = dream.content;
                        text = dream.text;
                    }

                    this.setState({
                        content: content,
                        text: text,
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
        const { did, hasHeart, heartNum } = this.state;
            
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
        const { loading, content, text, did, heartCls } = this.state;

        if (!loading) {
            return (
              <div className="dialog-inner">
                <div className="hd">
                  <a href="javascript:;" 
                     className="back" 
                     onClick={this.close.bind(this)}
                  >
                     <i className="s s-back s-2x"></i>
                     <span>返回</span>
                  </a>
                  <a className="owed" 
                     href="javascript:;" 
                     title="喜欢"
                     onClick={this.heartIt.bind(this)}
                    >
                    <div className="owed-inner">
                      <i className={heartCls}></i>
                    </div>
                  </a>
                </div>
                <div className="text-viewer-box bd">
                    <h1>大家好，你们好吗</h1>
                    <div className="text-viewer-content" dangerouslySetInnerHTML={{__html: text}} />
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

