/*
 * @fileOverview 下拉
 * @version 0.1
 * @author minggangqiu
 */
var utils     = require('utils');
var Share     = require('share');
var dropdown  = require('ejs!./dropdown.html');

class DropDown {
    constructor(opts) {
        this.opts = opts;
        this.init();
    }

    static toggleBtn = null;

    static dms = [];

    init() {
        var opts = this.opts || {};

        this.visible = false;
        this.width = opts.width || 180;

        this.defaultOpts = {
            el: null,
            container: null,
            selector: null,
            menu: null,
            width: this.width,
            modal: false,
            onClose: null,
            initHide: false,
            data: []
        }

        this.settings = {};
        this.setOpts(opts);
    }

    setOpts(opts) {
        for (var o in this.defaultOpts) {
            this.settings[o] = typeof opts[o] !== 'undefined'? opts[o]:this.defaultOpts[o];
        }
        this.bindEvents();
    }

    create() {
        var self = this;
        var conf = this.settings;
        var menuCls = conf.menu || '.dropdown-menu';

        var dm = this.dropdown.querySelector(menuCls);
        if (dm) {
            this.dropdownMenu = dm;
        }else{
            this.dropdownMenu = document.createElement('ul');
            this.dropdown.appendChild(this.dropdownMenu);
            this.dropdownMenu.className = menuCls;
        }
        if (DropDown.dms.indexOf(dm) === -1) {
            DropDown.dms.push(dm);
        }

        for (var o in conf) {
            switch (o.toLowerCase()) {
                case 'data':
                    if (conf[o].length > 0) {
                        this.dropdownMenu.innerHTML = dropdown(conf[o]);
                    }
                    break;
                case 'modal':
                    if (typeof conf[o] != "boolean") 
                        conf[o] = this.defaultOpts[o];

                    if (conf[o]) {
                        var body  = document.body,
                            modal = body.querySelector('.dropdown-modal');
                        if (modal) {
                            this.modal = modal;
                        } else {
                            this.modal = document.createElement('div'); 
                            body.appendChild(this.modal);
                            this.modal.className = "dropdown-modal fade-out";
                            var oheight = this.modal.offsetHeight;
                            this.modal.className = "dropdown-modal fade-in";
                        }
                        this.modal && this.modal.addEventListener('mousedown', function() {
                            self.hide();
                        });

                    }
                    break;
                case 'width':
                    var value = conf[o];
                    if (typeof value == "number")
                        value += 'px';

                    this.dropdownMenu.style[o] = value;
                    break;
                default:
                    this[o] = conf[o];
                    break;
            }
        }
    }

    reload() {
        this.dropdownMenu.innerHTML = dropdown(this.settings.data);
    }

    bindEvents() {
        var self = this,
            conf = this.settings;

        if (!conf.container || !conf.el) return;

        this.con = document.querySelector(conf.container);

        var stopp = function(ev) {
            ev.stopPropagation();
        }
        
        if (!this.con) return;

        var dropdownCls = conf.selector || '.dropdown';

        this.con.addEventListener('click', function(ev) {
            var cur = ev.target,
                matchesSelector = cur.matches 
                || cur.webkitMatchesSelector 
                || cur.mozMatchesSelector 
                || cur.msMatchesSelector;

            while (cur && cur !== cur.currentTarget) {
                if (matchesSelector.call(cur, self.settings.el)) {
                    if (cur !== DropDown.toggleBtn) {
                        self.dropdown && self.dropdown
                            .removeEventListener('mousedown', stopp);
                        self.dropdown = utils.closest(cur, dropdownCls);
                        self.dropdown.addEventListener('mousedown', stopp);
                        DropDown.toggleBtn = cur;
                        self.create();
                        self.hideAll();
                        self.show();
                    }else{
                        self.toggle();
                    }
                    break;
                }
                cur = cur.parentElement;
            }
        });

        document.body.addEventListener("mousedown", function() {
            self.hideAll();
        });
    }

    toggle() {
        if (!this.visible) {
            utils.addClass(this.dropdownMenu, 'show');
            utils.removeClass(this.dropdownMenu, 'hide');

            if (this.modal) {
                utils.removeClass(this.modal, 'fade-out');
                utils.addClass(this.modal, 'fade-in');
            }

            this.visible = true;
        } else {
            utils.removeClass(this.dropdownMenu, 'show');
            utils.addClass(this.dropdownMenu, 'hide');

            if (this.modal) {
                utils.removeClass(this.modal, 'fade-in');
                utils.addClass(this.modal, 'fade-out');
            }

            this.visible = false;
        }
    }

    show() {
        if (!this.visible) {
            utils.addClass(this.dropdownMenu, 'show');
            utils.removeClass(this.dropdownMenu, 'hide');

            if (this.modal) {
                utils.removeClass(this.modal, 'fade-out');
                utils.addClass(this.modal, 'fade-in');
            }

            this.visible = true;
        }
    }

    hide() {
        if (this.visible) {
            utils.removeClass(this.dropdownMenu, 'show');
            utils.addClass(this.dropdownMenu, 'hide');
            
            if (this.modal) {
                utils.removeClass(this.modal, 'fade-in');
                utils.addClass(this.modal, 'fade-out');
            }

            this.visible = false;
        }
    }

    hideAll() {
        DropDown.dms.forEach(function(dm) {
            utils.addClass(dm, 'hide');
        });
        if (this.visible) {
            this.visible = false;
        }
    }
};

class ShareDropDown extends DropDown {
    constructor(opts) {
        super(opts);

        this.share = new Share({
            "tit": "",
            "pic": "",
            "url": "",
            "intro": ""
        });

        this.handle = this.shareHandle.bind(this);
    }

    create() {
        var self = this;

        this.dropdownMenu && this.dropdownMenu
            .removeEventListener('click', self.handle);

        super.create();

        this.dropdownMenu && this.dropdownMenu
            .addEventListener('click', self.handle);
    }

    shareHandle(ev) {
        var self = this;
        var cur  = ev.target;

        while(cur.getAttribute &&
            ['wb_share', 'qzone_share', 'weixin_share'].indexOf(cur.getAttribute('rel'))
                === -1 && cur.parentNode &&
                cur.parentNode !== ev.currentTarget) {
                    cur = cur.parentNode;
                }

        if (cur.getAttribute && cur.getAttribute('rel')) {
            var rel = cur.getAttribute('rel'),
                pbox = cur;
            while(pbox.className.indexOf('post-box') === -1) {
                pbox = pbox.parentNode;
            }

            if (pbox !== cur && pbox.className.indexOf('post-box') !== -1) {
                var pcon = pbox.querySelector('.post-content');
                self.share.update({
                    "tit": (pcon && pcon.textContent) || "",
                    "url": (pcon && pcon.querySelector('a') && pcon.querySelector('a').href) || ""
                });

                if (rel === 'wb_share') {
                    self.share.shareToSina();
                } else if (rel === 'qzone_share') {
                    self.share.postToQzone();
                } else if (rel === 'weixin_share') {
                    console.log(3);
                };
            }
        }
    }
}

function create(opts) {
    return new DropDown(opts);
}

function shareDrop(opts) {
    return new ShareDropDown(opts);
}

export { create, shareDrop };

