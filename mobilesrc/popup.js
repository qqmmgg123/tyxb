/*
 * @fileOverview 弹出窗口
 * @version 0.1
 * @author minggangqiu
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseCom from 'basecom';
import keyboard from 'keyboard';
import autocomplate from 'autocomplete';
import req from 'req';
var settings     = require('../const/settings');
var utils        = require('utils');
var v            = require('validate');
var picpop       = require('ejs!./picpop.html');
var wintpl       = require('ejs!./wintpl.html');
var registration = require('ejs!./registration.html');
var tagnewtpl    = require('ejs!./tagnewpop.html');

const INDENT = '  ';
const BREAK = '<br/>';

class FinishBtn extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onFinishClick();
    }

    render() {
        return (
            <button ref={(ref) => {this._self = ref}} id="finish_cdream_btn" onClick={this.handleClick} type="button" className="btn">分享 → </button>
        );
    }

    enable() {
        utils.removeClass(this._self, 'disabled');
    }

    disable() {
        utils.addClass(this._self, 'disabled');
    }
}

class DreamForm extends BaseCom {
    constructor(props) {
        super(props);

        this.tagCheckPassed = false;
        this.btnDis  = true;
        this.formData = null;
        let btns = [
            { label: '网址', rel: 'tab-link-post', name: 'link', active: false },
            { label: '文字', rel: 'tab-text-post', name: 'text', active: false },
            { label: '图片', rel: 'tab-image-post', name: 'image', active: false },
        ]

        let formsEls = [];
        if (props.type !== 'news') {
            let upcase = this.firstLetter(props.type);
            formsEls = [{
                name: props.type,
                com: this['render' + upcase + 'Form'].bind(this)
            }];
        }

        this.state = {
            curForm: props.type,
            curImage: '',
            curImageId: '',
            formEls: formsEls,
            text: '',
            link: '',
            linkType: '',
            addBtns: btns
        }
    }
    
    encodeContent(text) {
        return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join(BREAK + '\n');
    }
    
    encodeAttr(text) {
        return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
    }

    componentDidMount() {
        if (this._tabNav) {
            let selectors = [
                '[rel="tab-text-post"]',
                '[rel="tab-link-post"]',
                '[rel="tab-image-post"]',
            ],
                handles   = [
                    this.toggleTextForm,
                    this.toggleLinkForm,
                    this.toggleImageForm,
                ];

            this.delegate(this._tabNav, selectors, handles);
        }

        this._form && this._form.querySelectorAll('input[type=text], input[type=url], textarea').forEach((inp) => {
            inp.onfocus = (ev) => {
                let inp    = ev.target,
                    field  = utils.closest(inp, '.field'),
                    tips   = field && field.nextElementSibling;

                tips.innerHTML = '';
                tips.style.display = 'none';
            }
        });
    }

    firstLetter(str) {
        return str.replace(/^([a-z]{1})([a-z]+)$/, function() {
            return RegExp.$1.toLocaleUpperCase() + RegExp.$2;
        });
    }

    toggleForm(type) {
        let { addBtns, formEls } = this.state;
        let active;
        for (let i = 0, l = addBtns.length; i < l; i++) {
            let btn = addBtns[i];
            if (btn.name === type) {
                active = btn.active;
                btn.active = !active;
                break;
            }
        }
        if (!active) {
            let upcase = this.firstLetter(type);
            formEls.push({
                name: type,
                com: this['render' + upcase + 'Form'].bind(this)
            });
        }
        else{
            formEls = formEls.filter((form) => {
                return form.name !== type;
            });
        }

        this.setState({
            addBtns: addBtns,
            formEls: formEls
        });
    }

    toggleTextForm() {
        this.toggleForm('text');
    }

    toggleLinkForm() {
        this.toggleForm('link');
    }

    toggleImageForm() {
        this.toggleForm('image');
    }

    xhrReponseManage(data, callback) {
        var self = this;
        switch (data.result) {
            case 0:
                callback(data);
                break;
            case 1:
                alert(data.info);
                break;
            case 2:
                registrationPop({ 
                    cur: 'signin'
                }).show();
                break;
            default:
                break;
        };
    }

    resizeConHeight() {
        const h = this._con.offsetHeight;
        this._tabCon.style.height = (h - 86) + 'px';
    }

    onCancelImage() {
        this.setState({
            curImage: ''
        });
    }

    renderImageForm() {
        let { curImage } = this.state;

        if (!curImage) {
            return (
                <div className="form-group">
                    <div className="image-drag-box" onClick={this.onAddImage.bind(this)}>
                        <button type="button" className="btn">添加图片 +</button>
                        <input ref={(imageUpload) => { this._imageUpload = imageUpload }} accept="image/*" onChange={this.uploadImage.bind(this)} style={{ display : "none" }} id="image-upload" type="file" name="upload_file" />
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="image-preview-area">
                    <a href="javascript:;" className="image-cancel-btn" onClick={this.onCancelImage.bind(this)}>
                        <i className="s s-close s-lg"></i>
                    </a>
                    <img src={curImage} />
                    <input type="hidden" name="image" value={this.state.curImageId} />
                </div>
            )
        }
    }

    loadImage(url, id) {
        var img = new Image();
        /*this.setState({
            loading: true
        });*/
        img.src = url;
        if(img.complete) {
            this.setState({
                //loading: false,
                curImageId: id,
                curImage: url
            });
            this.resizeConHeight();
            return;
        }
        img.onload = () => {
            this.setState({
                //loading: false,
                curImageId: id,
                curImage: url
            });
            this.resizeConHeight();
        };
        img.onerror = () => {
            alert("网络异常，图片加载失败");
        }
    }

    uploadImage(ev) {
        var self = this;
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
                var url = resp.dataUrl,
                    imgId = resp.imageId;
                if (url && imgId) self.loadImage(url, imgId);
            };
        };
        xhr.send(fd);
    }

    onAddImage() {
        this._imageUpload.click();
    }

    changeText(text) {
        this.setState({
            text: text
        });
        this.resizeConHeight();
    }

    textChange(ev) {
        this.setState({
            text: this.encodeContent(ev.target.value)
        });
    }

    linkChange(ev) {
        let link = ev.target.value,
            linkType = '';

        if (/^http\:\/\/www\.ximalaya\.com.*$/.test(link)) {
            linkType = "ximalaya";
        }

        this.setState({
            linkType: linkType,
            link: link
        })
    }

    renderTextForm() {
        return (
            <div className="form-group">
                <p className="field"><textarea id="textContent" onChange={this.textChange.bind(this)} onChange={this.textChange.bind(this)} placeholder="正文" value={this.state.text} name="text"></textarea></p>
                <p className="validate-error"></p>
            </div>
        )
    }

    renderLinkForm() {
            let { link, linkType } = this.state;

            switch(linkType) {
                case 'ximalaya':
                    return (
                        <div className="form-group">
                        <p className="field"><input onChange={this.linkChange.bind(this)} value={this.state.link} data-cname="网址" type="url" name="link" placeholder="网址，例: http://www.ty-xb.com" /></p>
                        <p className="validate-error"></p>
                        <object type="application/x-shockwave-flash" id="ximalaya_player" data={link} width="260" height="36"></object>
                        </div>
                    )
                    break;
                default:
                    return (
                        <div className="form-group">
                        <p className="field"><input onChange={this.linkChange.bind(this)} value={this.state.link} data-cname="网址" type="url" name="link" placeholder="网址，例: http://www.ty-xb.com" /></p>
                        <p className="validate-error"></p>
                        </div>
                    )
                    break;
            }
    }

    render() {
        const { formEls, addBtns, defTagWord, stateComplate } = this.state;
        const { type } = this.props;

        let header = null;
        if (type === "news") {
            header = (
                <div ref={(ref) => { this._tabNav = ref }} id="dreamReleaseBar" className="nav-group">
                    <ul>
                        <li>
                            <span className="tab">标题</span>
                        </li>
                        {addBtns.map((btn, i) =>
                            <li key={i}>
                                <a href="javascript:;" 
                                   className={(btn.active? 'btn cur':'btn')} 
                                   rel={btn.rel}><i className={btn.active? 's s-subtract s-lg':"s s-plus s-lg"}></i>
                                   {btn.label}
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            )
        }

        let tagField = null,
            tagTips = '内容将分享到您的日常',
            { tid, tag } = this.props;
        if (tid && tag) {
            tagField = (
                <input 
                type="hidden" 
                name="tag" 
                value={tid} 
                />
            );
            tagTips = `内容将分享到圈子”${tag}“`;
        }

        return (
            <div className="post-form" ref={(ref) => { this._con = ref }}>
                {header}
                <div className="tab-content" ref={(ref) => { this._tabCon = ref }}>
                    <div ref={(popbd) => { this._popbd = popbd }} className="dream-area">
                        <div ref={(createInfo) => { this._createInfo = createInfo }} className="alert" style={{ display: "none" }}>
                        </div>
                        <form ref={(ref) => this._form = ref} action="/dream/new" method="post">
                            <div ref={(tagInfo) => { this._tagInfo = tagInfo }} className="alert form-group" style={{ display: "none" }}>
                            </div>
                            {tagField}
                            <div className="form-group">
                                <p className="field"><textarea maxLength="140" data-cname="标题" id="dream-title" name="content" placeholder="标题[必须]"></textarea></p>
                                <p className="validate-error"></p>
                            </div>
                            {formEls.map((form, i) => {
                                let Form = form.com;
                                return (<Form key={i} />)
                            })}
                            <input type="hidden" name="category" value={type} />
                            <div className="dream-release-ctrl">
                                {tagTips} 
                                <FinishBtn ref={(ref) => {this._finishBtn = ref}} onFinishClick={this.validate.bind(this)} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    getFormData() {
        this.formData = {};
        this._form && this._form
            .querySelectorAll(
            'input[type=text], \
            input[type=url], \
            input[type=hidden], \
            textarea'
        ).forEach((inp, key) => {
            const val    = inp.value;
            this.formData[inp.name] = val;
        });
    }

    validate() {
        let validate = true;

        self.fields = [
            { name: 'content',  require: true, label: '标题' },
            { name: 'link', label: '网址', err: "链接格式错误", fun: (val) => {
                return (!val || utils.isUrl(val));
            } }
        ]

        this._form && this._form
            .querySelectorAll(
            'input[type=text], \
            input[type=url], \
            textarea'
        ).forEach((inp, key) => {
            let val    = inp.value,
                field  = utils.closest(inp, '.field'),
                tips   = field && field.nextElementSibling;

            if (!tips) {
                validate = false;
                return;
            }

            // 判断是否有效
            self.fields && self.fields.forEach((field) => {
                let name = field.name,
                    label = field.label;
                if (name === inp.name) {
                    val = val.trim();

                    // 判断是否为空
                    if (field.require) {
                        if (val.length === 0) {
                            tips.innerHTML = field.empty_msg || (label + "未填写");
                            tips.style.display = 'block';
                            validate = false;
                            return;
                        }else{
                            tips.innerHTML = '';
                            tips.style.display = 'none';
                        }
                    }

                    let isValid  = true,
                        errorText = "";
                    if (field.fun) {
                        if (!field.fun(val)) {
                            validate = false;
                            isValid  = false;
                            errorText = field.err || '';
                        }
                    }

                    if (!isValid) {
                        tips.style.display = 'block';
                        tips.innerHTML = errorText;
                        validate = false;
                        return;
                    }else{
                        tips.innerHTML = '';
                        tips.style.display = 'none';
                    }
                }
            });
        });

        if (validate) {
            this._finishBtn.disable();
            this.getFormData();
            this.submit();
        }
    }

    hasCon() {
        let fields = [
            { name: 'tag' },
            { name: 'content' },
            { name: 'link' },
            { name: 'text' },
            { name: 'image' },
        ];

        return this._form && [].slice.call(this._form.querySelectorAll(
            'input[type=text], input[type=url], input[type=hidden], textarea'
        )).filter(function(item) {
            for (let i = 0, l = fields.length; i < l; i++) {
                let field = fields[i];
                if (item.name === field.name && item.value.trim()) {
                    return true;
                }
            };
        }).length > 0;
    }

    submit() {
        req.post(
            '/dream/new',
            this.formData,
            (data) => {
                this.xhrReponseManage(data, (data) => {
                    if (data.result === 0 && data.data) {
                        const { did } = data.data;
                        did && window.location.replace('/dream/' + did);
                    }
                });
            }
        );
    }
}

class Popup {
    constructor(opts) {
        this.opts = opts;
        this.init();
    }

    init() {
        var opts = this.opts || {};

        this.visible = false;
        this.width = opts.width || 400,
            this.height = typeof opts.height == 'number'? 
            opts.height:(typeof opts.height == "string"? 0:320);

        this.defaultOpts = {
            id: '',
            width: this.width,
            height: this.height,
            arrow: true,
            direction: 'top',
            modal: false,
            onClose: null,
            html: ''
        }

        this.div = document.createElement('div');
        this.div.className = "dialog none";

        this.settings = {};
        this.setOpts(opts);
    }

    setOpts(opts) {
        for (var o in this.defaultOpts) {
            this.settings[o] = typeof opts[o] !== 'undefined'? opts[o]:this.defaultOpts[o];
        }
    }

    updateSettings(opts) {
        for (var o in opts) {
            if (typeof this.settings[o] !== 'undefined') {
                this.settings[o] = opts[o];
            }
        }
    }

    create() {
        for (var o in this.settings) {
            switch (o.toLowerCase()) {
                case 'width':
                case 'height':
                case 'arrow':
                    if (typeof this.settings[o] != "boolean") 
                        this.settings[o] = this.defaultOpts[o]

                    if (this.settings[o]) {
                        var arrowCls = ['arrow-border', 'arrow'];
                        for (var i=0;i<arrowCls.length;++i) {
                            var div = document.createElement('div');
                            div.className = arrowCls[i];
                            this.div.appendChild(div);
                            div = null;
                        }
                    }
                    break;
                case 'id':
                    var id = this.settings[o];
                    if (id) {
                        this.div.id = this.settings[o];
                    }
                    break;
                case 'direction':
                    var cls = this.settings[o];
                    this.div.className += ' ' + cls;
                    break;
                case 'modal':
                    this.modal = document.createElement('div');
                    break;
                case 'html':
                    this.div.innerHTML = this.settings[o];
                    break;
                default:
                    this[o] = this.settings[o];
                    break;
            }
        }
    }

    bindEvents() {
        var self = this;
        self.colsefn = self.close.bind(this);

        // 键盘操作关闭窗口
        keyboard.addHandle('escape_keydown', self.colsefn);
    }

    show() {
        utils.addClass(document.body, 'un-scroll');
        var win_width = window.innerWidth;
        var win_height = window.innerHeight;

        //this.defaultOpts.left = (win_width - this.width) * 0.5;
        //this.defaultOpts.top  = (win_height - this.height) * 0.5;
        this.create();
        this.bindEvents();
        document.body.appendChild(this.div);
        document.body.appendChild(this.modal);

        this.div.className = this.div
            .className.replace(' none','');

        this.modal.className = "modal fade-out";
        var oheight = this.modal.offsetHeight;
        this.modal.className = "modal fade-in";

        this.visible = true;
    }

    close() {
        utils.removeClass(document.body, 'un-scroll');
        if (document.body.contains(this.div)) {
            document.body.removeChild(this.div);
            document.body.removeChild(this.modal);
            // this.modal = this.div = null;
            this.visible = false;
            keyboard.removeHandle('escape_keydown', this.colsefn);
            self.onClose && self.onClose.call(self);
        }
    }
};

class Win extends Popup {
    constructor(opts) {
        super(opts);
        this.settings.content = '';
        this.settings.title = '标题';
        this.updateSettings({
            width   : 'auto',
            height  : 'auto',
            html    : wintpl(),
            onClose : function() {}
        });
    }

    create() {
        super.create();
        this.ti = this.div.querySelector('.title');
        this.bd = this.div.querySelector('.bd');
        this.hd = this.div.querySelector('.hd');
        this.ti.innerHTML = this.settings.title;
        this.bd.innerHTML = this.settings.content;
    }

    bindEvents() {
        super.bindEvents();
        var closeBtn = this.hd.querySelector('.close');

        closeBtn && closeBtn
            .addEventListener('click', this.close.bind(this), false);
    }
}

class TextNewPop extends Win {
    constructor(opts) {
        super(opts);
        this.tags   = opts.tags;
        this.type   = opts.type;
        this.curTag = opts.tag;
        this.form = null;

        this._map = {
            'link' : '发网址',
            'text' : '发文字',
            'image': '发图片',
            'news' : '发图文链接',
        }

        this.updateSettings({
            title: this._map[this.type]
        });
    }

    checkUser(cb) {
        if (this.curTag) {
            req.getJSON(
                '/tag/getinfo',
                { tid: this.curTag },
                cb.bind(this),
                () => {
                    alert('网络异常');
                }
            );
        }
        else{
            req.getJSON(
                '/islogin',
                null,
                cb.bind(this),
                () => {
                    alert('网络异常');
                }
            );
        }
    }

    bindEvents() {
        super.bindEvents();
        var self = this;
        const CheckUserTips = () => (
            <div className="loading">正在验证用户状态...</div>
        );

        ReactDOM.render(
            <CheckUserTips />,
            this.bd
        );

        this.checkUser((data) => {
            const ret = +data.result;
            if (ret === 0) {
                let { tag = '' } = data.data || {};
                this.form = ReactDOM.render(
                    <DreamForm 
                    type={this.type}
                    tid={this.curTag}
                    tag={tag}
                    />,
                    this.bd
                );
                utils.placeholder(this._popbd);
            }
            else if (ret === 2) {
                super.close();
                const state = History.getState(),
                    { action } = state.data;
                if (action && action !== 'signin') {
                    History.replaceState({ action: 'signin'}, 'signin', "?popup=signin");
                }
            }
            else{
                alert(data.info);
            }
        });
    }

    close() {
        const state = History.getState(),
              { action } = state.data;
        if (action && action === "share") {
            History.back();
        }
        else{
            if (this.form && this.form.hasCon && this.form.hasCon()) {
                if (window.confirm("您编辑的内容将不会被保存，确认关闭?")) { 
                    super.close();
                }
            }else{
                super.close();
            }
        }
    }
}

// 登录注册弹窗
class RegPop extends Win {
     constructor(opts) {
         if (!opts.cur) return;
         
         var title = settings.REGISTRATION.WORDING;

         super(opts);
         this.updateSettings({
             title: title,
             id: 'registration',
             content: registration({ data: { current: opts.cur } })
         });
    }

    loginFinish(data) {
        var self = this;
        switch (data.result) {
            case 0:
                data.redirect && window.location.replace(data.redirect);
                break;
            case 1:
                alert(data.info);
                break;
            case 3:
                var infoBox = self.form.querySelector('[rel=info]');
                infoBox && (infoBox.innerHTML = data.info);
                infoBox && (infoBox.style.display = "block");
                break;
            default:
                break;
        };
    }

    bindEvents() {
        super.bindEvents();
        var self = this;

        this.tabNav = this.bd.querySelector('.tab-nav');
        this.tabCon = this.bd.querySelector('.tab-content');
        this.tabUl  = this.tabNav.querySelector('ul');
        
        this.tabNav && this.tabNav
            .addEventListener('click', this.tabChange.bind(this), false);

        this.signupForm = this.bd.querySelector('#signup-form');
        this.signinForm = this.bd.querySelector('#signinForm');

        this.vSignup();
        this.vSignin();
    }

    vSignup() {
        var self = this;
        v.validate({
            form: this.signupForm,
            onCheckInput: function() {
                req.post(
                    '/signup',
                    { 
                        tag      : this.formData.tag,
                        username : this.formData.username,
                        email    : this.formData.email,
                        password : this.formData.password
                    },
                    self.loginFinish.bind(this)
                );
            },
            needP: true
        });
    }

    vSignin() {
        var self = this;
        v.validate({
            form: this.signinForm,
            fields: [
                { name: 'username', require: true, label: '名字' },
                { name: 'password',  require: true, label: '密码' }
            ],
            onCheckInput: function() {
                req.post(
                    '/signin',
                    { 
                        username: this.formData.username,
                        password: this.formData.password
                    },
                    self.loginFinish.bind(this)
                );
            },
            needP: true
        });
    }

    tabChange(ev) {
        var ctab = ev.target;

        if (ctab.nodeName.toLowerCase() === 'a') {
            if (this.tabUl.hasChildNodes()) {
                var children = this.tabUl.childNodes;

                var tabs = [];
                for (var i = 0; i < children.length; i++) {
                    var node = children[i];

                    if (node.nodeType === 1) {
                        var tab = node.querySelector('a');
                        tab.className = tab.className.replace(' cur', '');
                        tabs.push(tab);
                    }
                }

                var index = tabs.indexOf(ctab);
                ctab.className += ' cur';
            }
            
            if (this.tabCon.hasChildNodes()) {
                var children = this.tabCon.childNodes;
                
                var cons = [];
                for (var i = 0; i < children.length; i++) {
                    var node = children[i];

                    if (node.nodeType === 1) {
                        node.style.display = 'none';
                        cons.push(node);
                    }
                }
                cons[index].style.display = "";
            }
        }
    }

    close() {
        const state = History.getState(),
            { action } = state.data;
        if (action && (action === "signin" || action === "signup")) {
            History.back();
        }
        else{
            super.close();
        }
    }
}

class TagNewPop extends Win {
    constructor(opts) {
        super(opts);
        this.updateSettings({
            title: '创建版面',
            content : tagnewtpl(opts.data),
        });
    }

    bindEvents() {
        super.bindEvents();

        this.form = this.bd.querySelector('form');

        this.submitBtn = this.form.querySelector('button')

        this.submitBtn && this.submitBtn
            .addEventListener('click', this.validate.bind(this), false);

        utils.placeholder(this.form);
    }

    checkInput() {
        var self = this;
        req.post(
            '/tag/check',
            { 
                key: this.formData.key,
                description: this.formData.description
            },
            function(data) {
                if (data.result === 0) {
                    self.form.submit();
                } else {
                    var infoBox = self.form.querySelector('[rel="err-info"]');
                    infoBox && (infoBox.innerHTML = data.info);
                    infoBox && utils.addClass(infoBox, 'alert-warning');
                    infoBox && (infoBox.style.display = "block");
                }
            }
        );
    }

    validate(ev) {
        var formData = {}, validate = true;
        this.form.querySelectorAll('input').forEach(function(inp) {
            var val    = inp.value,
                field  = utils.closest(inp, '.field'),
                label  = utils.getData(inp, 'label') || '',
                require = utils.getData(inp, 'require'),
                tips   = field && field.nextElementSibling;

            if (!tips) {
                validate = false;
                return;
            }

            // 判断是否为空
            if (require) {
                if (val.trim().length === 0) {
                    tips.innerHTML = label + "未填写";
                    tips.style.display = 'block';
                    validate = false;
                    return;
                }else{
                    tips.innerHTML = '';
                    tips.style.display = 'none';
                }
            }

            var isValid = true;
            var errorText = "";
            // 判断是否有效
            switch(inp.name) {
                case 'key':
                    if (!utils.isTag(val)) {
                        errorText = label + "必须是1~24个小写字母、数字、下划线组成";
                        validate = false;
                        isValid = false;
                    }
                    break;
                default:
                    break;
            }
            if (!isValid) {
                tips.style.display = 'block';
                tips.innerHTML = errorText;
                validate = false;
                return;
            }else{
                tips.innerHTML = '';
                tips.style.display = 'none';
            }
            formData[inp.name] = val;
        });

        if (validate) {
            this.formData = formData;
            this.checkInput();
        }
    }
}

class PresidentPop extends Win {
    constructor(opts) {
        super(opts);
        this.updateSettings({
            title: '选版主',
            content : '<div class="building">' + settings.BUILDING_WORD + '</div>'
        });
    }
}

function popup(opts) {
    return new Popup(opts);
}

function textNewPop(opts) {
    return new TextNewPop(opts);
}

function registrationPop(opts) {
    return new RegPop(opts);
}

function tagNewPop(opts) {
    return new TagNewPop(opts);
}

function presidentPop(opts) {
    return new PresidentPop(opts);
}

export { popup, textNewPop, registrationPop, tagNewPop, presidentPop };
