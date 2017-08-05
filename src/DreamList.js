import req from 'req';
import effect from 'effect';

const common   = require('common');
const utils    = require('utils');

class DreamItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dream    : props.dream,
            heartCls : 's s-arrow_up s-2x s-ac',
            hasHeart : true
        }
    }

    componentDidMount() {
        let { dream } = this.state;
        if (dream.state === "new") {
            console.log('new...');
            const { container } = this.props;
            effect.fadeIn(this._dreamEl, {
                duration: 2000,
                complete: () => {
                    dream.state = 'normal';
                    container.waiting = false;
                }
            });
        }
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

    heartIt(ev) {
        let { dream, hasHeart } = this.state;

        if (!hasHeart) {
            req.post(
                "/dream/goodit",
                {
                    did: dream._id
                },
                (data) => {
                    common
                    .xhrReponseManage(data, 
                      (data) => {
                        if (data.data) {
                            let num = parseInt(data.data.num);
                            dream.vote = (isNaN(num)? 0:num);
                            let cls = "s s-arrow_up s-2x s-ac";
                            this.setState({
                                dream: dream,
                                hasHeart: true,
                                heartCls: cls
                            });
                        }
                    });
                },
                () => {
                    alert("网络异常");
                }
            );
        }else{
            req.post(
                "/dream/cgood",
                {
                    did: dream._id
                },
                (data) => {
                    common
                    .xhrReponseManage(data, 
                      (data) => {
                        if (data.data) {
                            let num = parseInt(data.data.num);
                            dream.vote = (isNaN(num)? 0:num);
                            let cls = "s s-arrow_up s-2x s-ac";
                            this.setState({
                                dream: dream,
                                hasHeart: false,
                                heartCls: "s s-arrow_up s-2x"
                            });
                        }
                    });
                },
                () => {
                    alert("网络异常");
                }
            );
        }
    }

    deleteDream() {
        const { dream } = this.state;
        const { container } = this.props;
        req.post(
            "/dream/delete",
            {
                did: dream._id
            },
            (data) => {
                common
                    .xhrReponseManage(data, 
                      (data) => {
                          effect.fadeOut(this._dreamEl, {
                              duration: 2000,
                              complete: () => {
                                  container.removeItem(dream);
                              }
                          });
                      });
            },
            () => {
                alert("网络异常");
            }
        );
    }

    render() {
        const { dream, heartCls } = this.state;
        const href = "/user/" + (dream._belong_u && dream._belong_u._id || "unknow");
        const username = (dream._belong_u && dream._belong_u.username || "未知");

        return (
            <li 
              ref={ (ref) => this._dreamEl = ref } 
              className="list-item">
              <div className="post-box">
                <div className="user-info-box">
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
                  </div>
                </div>
                <div className="post-content">
                  <div className="text-viewer-box">
                    <h1>{dream.content || ""}</h1>
                    <div className="text-viewer-content" 
                         dangerouslySetInnerHTML={{__html: dream.text || "文字没有找到..."}}
                    />
                  </div>
                </div>
                <div className="post-footer">
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
            </li>
        )
    }
}

export default class DreamList extends React.Component {
    constructor(props) {
        super(props);

        this.waiting = false;
        this.state = {
            list     : []
        }
    }

    addItem(item) {
        console.log('add item and set list ...' + this.state.list);
        this.waiting = true;
        let list = this.state.list;
        item.state = 'new';
        list.unshift(item);
        this.setState({
            list: list,
        });
    }

    removeItem(item) {
        console.log('remove 2...');
        let list = this.state.list;
        console.log(list.length)
        let index = list.indexOf(item);
        list.splice(index, 1);
        console.log(list.length)
        this.setState({
            list: list,
        });
    }

    get item() {
        return (props) => {
            return (<DreamItem container={this} dream={props.dream} />);
        }
    }

    render() {
        const { list } = this.state;

        console.log('render list ...');

        return (
            <ul {...this.props} className="list-group">
                {list.map((dream, i) => {
                    const Item = this.item;
                    return (<Item key={i} dream={dream} />);
                })}
            </ul>
        )
    }
}

