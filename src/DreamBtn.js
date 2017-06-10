import React from 'react';
import ReactDOM from 'react-dom';
import req from 'req';
import ResetForm from 'ResetForm';

var v       = require('validate'),
    common  = require('common');

export default class ForgotForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        v.validate({
            form: this.refs.forgotForm,
            fields: [
                { name: 'email', require: true, label: '邮箱' },
            ],
            onCheckInput: (formData) => {
                req.post(
                    '/forgot',
                    { 
                        email: formData.email
                    },
                    (data) => {
                        common.xhrReponseManage(data, (data) => {
                            if (data.result === 0) {
                                const { navigator } = this.props;
                                navigator.push({
                                    component: ResetForm
                                });
                            } else {
                                this.refs.infoBox.innerHTML = data.info;
                                this.refs.infoBox.style.display = "block";
                            }
                        });
                    }
                );
            },
            needP: true
        });
    }

    close() {
        const { navigator } = this.props;
        navigator.destroy();
    }

    render() {
        return (
            <div ref="forgotForm" className="forgot-area">
                <div className="row step-header">
                    <a href="javascript:;" className="close-btn" onClick={this.close.bind(this)}><i className="s s-close s-lg"></i></a>
                </div>
                <div className="step-wording">
                    <h3>忘记密码</h3>
                    <p>验证码会发送到您的邮箱，用于重置密码</p>
                </div>
                <form id="forgot-form" method="post">
                    <div ref="infoBox" className="color-warning" style={{ display: "none" }}>
                    </div>
                    <div className="form-group">
                        <div className="field">
                            <input type="email" id="email" name="email" placeholder="输入您的邮箱" required />
                            <p className="validate-error"></p>
                        </div>
                    </div>
                    <button className="btn btn-primary" type="button">获取验证码</button>
                    <div className="forgot-loading" style={{ display: "none" }}>
                        <p>请稍等...</p>
                    </div>
                </form>
            </div>
        )
    }
}

