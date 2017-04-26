/*
 * @fileOverview 弹出窗口
 * @version 0.1
 * @author minggangqiu
 */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseCom from 'basecom';
import "babel-polyfill";
import { ContentState, EditorState, RichUtils} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { List, Map } from 'immutable';
import createImagePlugin from 'draft-js-image-plugin';
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
var stateToHTML  = require('statetohtml/stateToHTML').default;

class RichEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()};

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this.setState({editorState});

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        this.onAddImage = (url) => this._onAddImage(url);
    }

    _uploadImage(ev) {
        var self = this;
        var file = ev.target.files[0];
        var fd = new FormData();
        fd.append("pic", file);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/pic/upload', true);
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                console.log(percentComplete + '% uploaded');
            }
        };
        xhr.onload = function() {
            if (this.status == 200) {
                var resp = JSON.parse(this.response);
                var url = resp.dataUrl;


                url && self.onChange(
                    imagePlugin.addImage(self.state.editorState, url)
                );
            };
        };
        xhr.send(fd);
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    _onAddImage(url) {
        this._imageUpload.click();
    }

    render() {
        const {editorState} = this.state;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div className="RichEditor-root form-group">
                <div className="RichEditor-command">
                <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
                />
                <AtomicStyleControls
            editorState={editorState}
            onAddImage={this.onAddImage}
            modifier={imagePlugin.addImage}
                />
                <input ref={(imageUpload) => { this._imageUpload = imageUpload }} onChange={this._uploadImage.bind(this)} style={{ display : "none" }} id="image-upload" type="file" name="upload_file" />
                </div>
                <div className={className} onClick={this.focus}>
                <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="请君妙笔生辉..."
            plugins={plugins}
            ref='editor'
            spellCheck={true}
                />
                </div>
                </div>
        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onMouseDown = (e) => {
            e.preventDefault();
            this.props.onMouseDown(this.props.style);
        };

        this.onClick = (e) => {
            e.preventDefault();
            this.props.onClick(this.props.url);
        };
    }

    render() {
        let className = 'RichEditor-styleButton',
            iconCls   = this.props.label + '-icon',
            props     = {
                className: className,
            };

        this.props.onMouseDown && (props.onMouseDown = this.onMouseDown);
        this.props.onClick && (props.onClick = this.onClick);

        if (this.props.active) {
            props.className += ' RichEditor-activeButton';
        }

        let span = React.createElement(
            'span',
            props,
            <i className={iconCls}></i>
        );
        return span;
    }
}

const imagePlugin = createImagePlugin();

const plugins = [imagePlugin];

const ATOMIC_TYPES = [
    {label: 'image-add', style: 'image-add', url: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3965210363,3436209601&fm=80&w=179&h=119&img.JPEG'},
];

const AtomicStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {ATOMIC_TYPES.map((type) =>
                <StyleButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onClick={props.onAddImage}
                style={type.style}
                url={type.url}
                    />
            )}
            </div>
    );
};

const BLOCK_TYPES = [
    {label: 'h', style: 'header-two'},
    {label: 'blockquote', style: 'blockquote'},
    {label: 'ul', style: 'unordered-list-item'},
    {label: 'ol', style: 'ordered-list-item'},
    {label: 'code-block', style: 'code-block'}
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onMouseDown={props.onToggle}
                style={type.style}
                    />
            )}
            </div>
    );
};

var INLINE_STYLES = [
    {label: 'bold', style: 'BOLD'},
    {label: 'italic', style: 'ITALIC'},
    {label: 'underline', style: 'UNDERLINE'}
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onMouseDown={props.onToggle}
                style={type.style}
                    />
            )}
            </div>
    );
};

const ScreenControls = (props) => {
    return (
        <div className="RichEditor-controls-r">
            <span className="RichEditor-screenButton">
            <i className="s s-full s-lg"></i>
            </span>
            </div>
    );
}

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
                <button id="finish_cdream_btn" onClick={this.handleClick} type="button" className="btn">分享 > </button>
        );
    }
}

class MyTagList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.tags);

        return (<ul>
            {this.props.tags.map((tag, index) => (
                <li key={index}><a href="javascript:;" data-tid={tag._id}>{tag.key}</a></li>
            ))}
                </ul>);
    }
}

class DreamForm extends BaseCom {
    constructor(props) {
        super(props);

        self.tagCheckPassed = false;
        self.btnDis  = true;

        this.state = {
            curForm: 'link',
            curImage: '',
        }
    }

    componentDidMount() {
        let selectors = [
            '[rel="tab-text-post"]',
            '[rel="tab-link-post"]',
            '[rel="tab-image-post"]',
        ],
        handles   = [
            this.showTextForm,
            this.showLinkForm,
            this.showImageForm,
        ];

        this.delegate(this._tabNav, selectors, handles);
    }

    showTextForm() {
        this.setState({
            curForm: 'text'
        });
    }

    showLinkForm() {
        this.setState({
            curForm: 'link'
        });
    }

    showImageForm() {
        this.setState({
            curForm: 'image'
        });
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

    tagCheckStart() {
        this.btnDis  = true;
        this._tagInfo.innerHTML = '版面信息加载中...';
        this._tagInfo.style.display = 'block';
    }

    tagCheckEnd(key, cb) {
        if (typeof key != 'string') {
            this.btnDis  = false;
            this._tagInfo.innerHTML = '';
            this._tagInfo.style.display = 'none';
            return;
        };

        var self    = this,
            tagInfo = this._tagInfo;

        this._tagInfo.className = 'alert';
        if (key) {
            self.tagCheckPassed = true;
            tagInfo.innerHTML = [
                '<h3>您的贴文将发布到”' + key + '“</h3>',
                '<p>该版面版主功能即将开放，敬请关注，</p>',
                '<p>也因此抱歉，当前暂时无法制定版面规则。<p>'
            ].join('');
            utils.addClass(tagInfo, 'alert-success');
            self.tagDescModify = self._popbd.querySelector('#tagDescModify');
            self.tagDescModify && self.tagDescModify.addEventListener('change', function() {
                self._popbd.querySelector('#tagDescInput').style.display = '';
            });
            self.btnDis = false;
            if (cb) {
                cb.call(self);
            }
        }else{
            self.tagCheckPassed = false;
            tagInfo.innerHTML = [
                '<div>',
                '您选择的版面不存在，如需创建，请点击',
                '<a href="/tag/hot" class="btn">去创建 ></a>',
                '</div>'
            ].join('');
            utils.addClass(tagInfo, 'alert-warning');
        }
    }

    checkTag(newKey, cb) {
        var self = this,
            inp = this._dreamTagInp,
            key = inp.value.trim(),
            newKey = newKey.trim();

        if (typeof newKey !== 'string' && newKey.length === 0) return;

        var tagInfo = self._tagInfo;
        if (key !== newKey) {
            self.btnDis  = true;
            tagInfo.innerHTML = '版面信息加载中...';
            tagInfo.style.display = 'block';
            req.getJSON(
                '/search/tag',
                { key: newKey },
                function(data) {
                    self.xhrReponseManage(data, function(data) {
                        var data = data.data;
                        
                        if (data.tag) {
                            self.tagCheckEnd(newKey, cb);
                        } else {
                            self.tagCheckEnd('');
                        }
                    });
                }
            );
        }else{
            if (cb) {
                if (self.tagCheckPassed) {
                    cb.call(self);
                }
            }
        }
    }

    tagSelected(e) {
        var self = this,
            ctag = e.target,
            tagSelect = e.currentTarget;
        if(ctag && ctag.nodeName.toLowerCase() == "a") {
            var newKey = ctag.lastChild.nodeValue.trim();
            self.checkTag(newKey);
            self._dreamTagInp.value = newKey;
        }
    }

    getEditorContent() {
        return stateToHTML(this._editor.state.editorState.getCurrentContent());
    }

    onCancelImage() {
        this.setState({
            curImage: ''
        });
    }

    renderPicArea() {
        let { curImage } = this.state;

        if (!curImage) {
            return (
                <div onClick={this.onAddImage.bind(this)}>
                <p>上传图片 +</p>
                <input ref={(imageUpload) => { this._imageUpload = imageUpload }} onChange={this.uploadImage.bind(this)} style={{ display : "none" }} id="image-upload" type="file" name="upload_file" />
                </div>
            );
        }
        else{
            return (
                <div>
                    <a onClick={this.onCancelImage.bind(this)}>
                        <i className="s s-close s-lg"></i>
                    </a>
                    <img src={curImage} />
                </div>
            )
        }
    }

    uploadImage(ev) {
        var self = this;
        var file = ev.target.files[0];
        var fd = new FormData();
        fd.append("pic", file);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/pic/upload', true);
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");

        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                console.log(percentComplete + '% uploaded');
            }
        };
        xhr.onload = function() {
            if (this.status == 200) {
                var resp = JSON.parse(this.response);
                var url = resp.dataUrl;
                self.image.push(url);
                
                this.setState({
                    curImage: url
                });
            };
        };
        xhr.send(fd);
    }

    onAddImage() {
        this._imageUpload.click();
    }

    renderImageForm() {
        let [MyTags, tags = this.props.tags] = [],
            selTips = "请选择" + settings.OBJECT.TAG.CNNAME;

        if (tags && tags.length > 0) {
            MyTags = <MyTagList tags={tags} />
        }

        return (
            <div ref={(popbd) => { this._popbd = popbd }} className="dream-area">
                <div ref={(createInfo) => { this._createInfo = createInfo }} className="alert" style={{ display: "none" }}>
                </div>
                <form id="deamcreat-form" action="/dream/new" method="post">
                    <div className="title-head">
                        <span className="require">*&nbsp;</span>标题
                    </div>
                    <div className="form-group">
                        <p className="field"><textarea data-cname="标题" id="dream-title" name="content" placeholder="标题"></textarea></p>
                    </div>
                    <div className="title-head">
                        <span className="require">*&nbsp;</span>网址
                    </div>
                    <div className="pic-list">
                        {this.renderPicArea()}
                    </div>
                    <div className="tag-head">
                        <span className="require">*&nbsp;</span>{selTips}
                    </div>
                    <div className="form-group" id="dreamTagBox">
                        <p className="field"><input data-cname={settings.OBJECT.TAG.CNNAME} ref={(dreamTagInp) => {this._dreamTagInp = dreamTagInp}} id="dream-tag" type="text" name="tag" placeholder={settings.OBJECT.TAG.CNNAME} autoComplete="off" /></p>
                    </div>
                    <div id="tagSelect" onClick={this.tagSelected.bind(this)} className="tagList form-group">
                    {MyTags}
                    </div>
                    <div ref={(tagInfo) => { this._tagInfo = tagInfo }} className="alert form-group" style={{ display: "none" }}>
                    </div>
                    <input type="hidden" name="image" value={this.state.image} />
                    <input type="hidden" name="category" value="image" />
                    <div><FinishBtn onFinishClick={this.validate.bind(this)} /></div>
                </form>
            </div>
        );
    }

    renderTextForm() {
        let [MyTags, tags = this.props.tags] = [],
            selTips = "请选择" + settings.OBJECT.TAG.CNNAME;

        if (tags && tags.length > 0) {
            MyTags = <MyTagList tags={tags} />
        }

        return (
            <div ref={(popbd) => { this._popbd = popbd }} className="dream-area">
                <div ref={(createInfo) => { this._createInfo = createInfo }} className="alert" style={{ display: "none" }}>
                </div>
                <form id="deamcreat-form" action="/dream/new" method="post">
                    <div className="title-head">
                        <span className="require">*&nbsp;</span>标题
                    </div>
                    <div className="form-group">
                        <p className="field"><textarea data-cname="标题" id="dream-title" name="content" placeholder="标题"></textarea></p>
                    </div>
                    <div className="desc-head">
                        正文
                    </div>
                    <RichEditor ref={(editor) => {this._editor = editor}} />
                    <div style={{ display: 'none' }}>
                        <p className="field"><textarea id="textContent" placeholder="正文" name="text"></textarea></p>
                    </div>
                    <div className="tag-head">
                        <span className="require">*&nbsp;</span>{selTips}
                    </div>
                    <div className="form-group" id="dreamTagBox">
                        <p className="field"><input data-cname={settings.OBJECT.TAG.CNNAME} ref={(dreamTagInp) => {this._dreamTagInp = dreamTagInp}} id="dream-tag" type="text" name="tag" placeholder={settings.OBJECT.TAG.CNNAME} autoComplete="off" /></p>
                    </div>
                    <div id="tagSelect" onClick={this.tagSelected.bind(this)} className="tagList form-group">
                    {MyTags}
                    </div>
                    <div ref={(tagInfo) => { this._tagInfo = tagInfo }} className="alert form-group" style={{ display: "none" }}>
                    </div>
                    <input type="hidden" name="category" value="text" />
                    <div><FinishBtn onFinishClick={this.validate.bind(this)} /></div>
                </form>
            </div>
        )
    }

    renderLinkForm() {
        let [MyTags, tags = this.props.tags] = [],
            selTips = "请选择" + settings.OBJECT.TAG.CNNAME;

        if (tags && tags.length > 0) {
            MyTags = <MyTagList tags={tags} />
        }

        return (
            <div ref={(popbd) => { this._popbd = popbd }} className="dream-area">
                <form id="deamcreat-form" action="/dream/new" method="post">
                    <div ref={(createInfo) => { this._createInfo = createInfo }} className="alert" style={{ display: "none" }}>
                    </div>
                    <div className="title-head">
                        <span className="require">*&nbsp;</span>网址
                    </div>
                    <div className="form-group">
                        <p className="field"><input data-cname="网址" type="url" name="link" placeholder="网址" /></p>
                    </div>
                    <div className="title-head">
                        <span className="require">*&nbsp;</span>标题
                    </div>
                    <div className="form-group">
                        <p className="field"><textarea data-cname="标题" name="content" placeholder="标题"></textarea></p>
                    </div>
                    <div className="tag-head">
                        <span className="require">*&nbsp;</span>{selTips}
                    </div>
                    <div className="form-group" id="dreamTagBox">
                        <p className="field"><input data-cname={settings.OBJECT.TAG.CNNAME} ref={(dreamTagInp) => {this._dreamTagInp = dreamTagInp}} id="dream-tag" type="text" name="tag" placeholder={settings.OBJECT.TAG.CNNAME} autoComplete="off" /></p>
                    </div>
                    <div id="tagSelect" onClick={this.tagSelected.bind(this)} className="tagList form-group">
                    {MyTags}
                    </div>
                    <div ref={(tagInfo) => { this._tagInfo = tagInfo }} className="alert form-group" style={{ display: "none" }}>
                    </div>
                    <input type="hidden" name="category" value="link" />
                    <div><FinishBtn onFinishClick={this.validate.bind(this)} /></div>
                </form>
            </div>
        )
    }

    _getTabCls(name) {
        const { curForm } = this.state;

        if (name === curForm) {
            return 'tab cur';
        }
        else{
            return 'tab';
        }
    }

    render() {
        const { curForm } = this.state;
        let formEl = null,
            tabs = [
                { label: '网址', rel: 'tab-link-post', name: 'link' },
                { label: '文字', rel: 'tab-text-post', name: 'text' },
                { label: '图片', rel: 'tab-image-post', name: 'image' },
            ];

        switch(curForm) {
            case 'link':
                formEl = this.renderLinkForm();
                break;
            case 'text':
                formEl = this.renderTextForm();
                break;
            case 'image':
                formEl = this.renderImageForm();
                break;
        }

        return (
            <div>
                <div ref={(ref) => { this._tabNav = ref }} className="tab-nav">
                    <ul>
                        {tabs.map((tab, i) =>
                            <li key={i}>
                                <a href="javascript:;" rel={tab.rel} className={this._getTabCls(tab.name)}>{tab.label}</a>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="tab-content">
                    {formEl}
                </div>
            </div>
        )
    }

    validate() {
        var self = this,
            validate = true;

        var ins = [].slice
            .call(self._popbd.querySelectorAll('textarea'));

        ins.push(self._popbd.querySelector('input'));

        var texts = [];

        ins.forEach(function(inp) {
            if (['content','tag'].indexOf(inp.name) !== -1 && !inp.value.trim()) {
                var name = inp.getAttribute('data-cname');
                texts.push('您的' + name + '没有填写');
                validate = false;
            }
        });

        var infoBox = self._createInfo;
        if (texts.length > 0) {
            utils.addClass(infoBox, 'alert-danger');
            infoBox && (infoBox.innerHTML = texts.join('，') + '!');
            infoBox.style.display = '';
        }else{
            utils.removeClass(infoBox, 'alert-danger');
            infoBox.style.display = 'none';
        }

        if (validate) {
            this.checkTag(self._dreamTagInp.value, function() {
                 self.submit();
            });
        }
    }

    submit() {
        var self = this;
        var form = self._popbd.querySelector('#deamcreat-form');
        
        const { curForm } = this.state;

        if (curForm === 'text') {
            let content = self.getEditorContent();
            self._popbd.querySelector('#textContent').value = content;
        }
        form.submit();
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
            html: '',
            left: 0,
            top: 0
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
                case 'left':
                case 'top':
                    var value = this.settings[o];
                    if (typeof value == "number")
                        value += 'px';

                    this.div.style[o] = value;
                    break;
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
        this.tags = opts.tags;
        this.updateSettings({
            title: "发布文章"
        });
    }

    bindEvents() {
        var self = this;
        var dreamForm = ReactDOM.render(
            <DreamForm tags={this.tags} />,
            this.bd
        );

        utils.placeholder(dreamForm._popbd);

        super.bindEvents();

        var con = this.bd.querySelector("#dreamTagBox");
        if (con) {
            var auc = autocomplate({
                con: con,
                inp: '#dream-tag',
                url: '/search/tags',
                map: {
                    query: 'key',
                    list: 'data.tags',
                    key: 'key',
                    value: '_id'
                },
                onQueryStart: function() {
                    dreamForm.tagCheckStart();
                },
                onQueryEnd: function(key) {
                    dreamForm.tagCheckEnd(key);
                },
                onSelected: function(item) {
                    dreamForm.checkTag(item.key);
                }
            })
        };

    }

    close() {
        var ins = [].slice
            .call(this.bd.querySelectorAll('textarea'));

        ins.push(this.bd.querySelector('input'));

        var hasCon = ins.filter(function(item) {
            if (item.value.trim()) {
                return true;
            }
        }).length > 0;

        if (hasCon) {
            if (window.confirm("您编辑的内容将不会被保存，确认关闭?")) { 
                super.close();
            }
        }else{
            super.close();
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

    bindEvents() {
        super.bindEvents();

        this.tabNav = this.bd.querySelector('.tab-nav');
        this.tabCon = this.bd.querySelector('.tab-content');
        this.tabUl  = this.tabNav.querySelector('ul');
        
        this.tabNav && this.tabNav
            .addEventListener('click', this.tabChange.bind(this), false);

        this.signupForm = this.bd.querySelector('#signup-form');
        this.signinForm = this.bd.querySelector('#signinForm');

        v.validate({
            form: this.signupForm,
            needP: true
        });

        this.vSignin();
    }

    vSignin() {
        v.validate({
            form: this.signinForm,
            fields: [
                { name: 'email', require: true, label: '邮箱' },
                { name: 'password',  require: true, label: '密码' }
            ],
            onCheckInput: function() {
                var self = this;
                req.post(
                    '/signin/check',
                    { 
                        email: self.formData.email,
                        password: self.formData.password
                    },
                    function(data) {
                        if (data.result === 0) {
                            self.form.style.display = 'none';
                            self.form.nextElementSibling.style.display = 'block';
                            self.form.submit();
                        } else {
                            var infoBox = self.form.querySelector('#signinInfo');
                            infoBox && (infoBox.innerHTML = data.info);
                            infoBox && (infoBox.style.display = "block");
                        }
                    }
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
