/*
 * @fileOverview 弹出窗口
 * @version 0.1
 * @author minggangqiu
 */
import keyboard from 'keyboard';
import req from 'req';
var settings     = require('../const/settings');
var utils        = require('utils');
var v            = require('validate');
var picpop       = require('ejs!./picpop.html');
var wintpl       = require('ejs!./wintpl.html');
var registration = require('ejs!./registration.html');
var tagnewtpl    = require('ejs!./tagnewpop.html');

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
