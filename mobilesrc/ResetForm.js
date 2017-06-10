import React from 'react';
import ReactDOM from 'react-dom';
import req from 'req';

var utils    = require('utils'), 
    v        = require('validate'),
    common   = require('common');

export default class ForgotForm extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
    }

    componentDidMount() {
        v.validate({
            form: this.refs.resetForm,
            fields: [
                { name: 'password',  require: true, label: '新密码' },
                { name: 'token',  require: true, label: '验证码' },
            ],
            onCheckInput: (formData) => {
                req.post(
                    '/reset',
                    { 
                        password: formData.password,
                        token: formData.token
                    },
                    (data) => {
                        common.xhrReponseManage(data, (data) => {
                            if (data.result === 0) {
                                window.location.reload();
                            }
                            else{
                                this.refs.infoBox.innerHTML = data.info;
                                this.refs.infoBox.style.display = "block";
                            }
                        });
                    }
                );
            },
            needP: true
        });

        this.countDown();
    }

    componentWillUnmount() {
        this.timer = null;
    }

    back() {
        const { navigator } = this.props;
        navigator.pop();
    }

    close() {
        const { navigator } = this.props;
        navigator.destroy();
    }

    countDown() {
        this.timer = setTimeout(() => {
            let count = +this.refs.count.innerHTML;
            if (count > 0) {
                this.refs.count.innerHTML = count - 1;
                this.countDown();
            }else{
                this.timer = null;
                this.refs.expire.innerHTML = "重新发送";
                utils.removeClass(this.refs.expire, 'disabled');
            }
        }, 1000);
    }

    render() {
        return (
            <div ref="resetForm" className="forgot-area">
                <div className="row step-header">
                    <a href="javascript:;" className="back-btn" onClick={this.back.bind(this)}>←</a>
                    <a href="javascript:;" className="close-btn" onClick={this.close.bind(this)}><i className="s s-close s-lg"></i></a>
                </div>
                <div className="step-wording">
                    <h3>重设密码</h3>
                    <p>验证码已经发送到您的邮箱，注意查收</p>
                </div>
                <form id="reset-form" method="post">
                    <div ref="infoBox" className="color-warning" style={{ display: "none" }}></div>
                    <div className="form-group">
                        <div className="field">
                            <input type="password" id="password" name="password" placeholder="输入新密码" required autoComplete="off" />
                            <p className="validate-error"></p>
                        </div>
                    </div>
                    <div className="form-group clearfix">
                        <div className="field col-8">
                            <input type="text" id="token" name="token" placeholder="输入验证码" required autoComplete="off" />
                            <p className="validate-error"></p>
                        </div>
                        <div className="col-4 expire">
                            <div ref="expire" className="btn disabled">
                                <span ref="count">60</span>
                                秒后重发
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="button">重置</button>
                    <div className="forgot-loading" style={{ display: "none" }}>
                        <p>请稍等...</p>
                    </div>
                </form>
            </div>
        )
    }
}

