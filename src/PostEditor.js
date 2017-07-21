import BaseCom from 'basecom';
import req from 'req';
import TextEditor from 'TextEditor';

const utils  = require('utils');
const common = require('common');
const INDENT = '  ';
const BREAK  = '<br/>';

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
            <button 
            ref={(ref) => {this._self = ref}} 
            id="finish_cdream_btn" 
            onClick={this.handleClick} 
            type="button" 
            className="btn btn-primary"
            >
            记录 → 
            </button>
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

        const dateTime = new Date(),
            { type } = props;
        this.tagCheckPassed = false;
        this.btnDis  = true;
        this.formData = null;
        this.state = {
            curForm: type,
            curImage: '',
            curImageId: '',
            formEls: [],
            dateTime: dateTime,
            findMe: '',
            text: '',
            link: '',
            linkType: '',
            addBtns: []
        }

        this._setTextFormData = (ev) => {
            this.formRenderDataUpdate('text')
        }

        this._setImageFormData = (ev) => {
            this.formRenderDataUpdate('image')
        }

        this._setLinkFormData = (ev) => {
            this.formRenderDataUpdate('news')
        }
    }
    
    encodeContent(text) {
        return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join(BREAK + '\n');
    }
    
    encodeAttr(text) {
        return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
    }

    componentDidMount() {
        this.formRenderDataUpdate(type);

        if (this._tabNav) {
            let selectors = [
                '[rel="postText"]',
                '[rel="postImage"]',
                '[rel="postLink"]',
                '[rel="tab-title-post"]',
                '[rel="tab-text-post"]',
                '[rel="tab-link-post"]',
                '[rel="tab-image-post"]'
            ],
                handles   = [
                    this._setTextFormData,
                    this._setImageFormData,
                    this._setLinkFormData,
                    this.toggleTitleForm,
                    this.toggleTextForm,
                    this.toggleLinkForm,
                    this.toggleImageForm
                ];

            this.delegate(this._tabNav, selectors, handles);
        }

        if (this._userInfo) {
            let selectors = [
                '[rel="mood-edit"]',
                '[rel="health-edit"]'
            ],
                handles   = [
                    this.editMood,
                    this.editHealth
                ];

            this.delegate(this._userInfo, selectors, handles);
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

        this.timer = setInterval(this.tick.bind(this), 1000);

        //this.geoFindMe();
        
        // 编辑器获得焦点
        this._textEditor && this._textEditor.focus();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // 设置表单的显示参数
    formRenderDataUpdate(curForm) {
        let newBtns = [
            { label: '文字', rel: 'tab-text-post', name: 'text', active: false },
            { label: '图片', rel: 'tab-image-post', name: 'image', active: false },
        ]

        let textBtns = [
            { label: '标题', rel: 'tab-title-post', name: 'title', active: false }
        ]

        let formsEls = [],
            btns = [];

        if (curForm === 'news') {
            btns = newBtns;
        }

        if (curForm === 'text') {
            btns = textBtns;
        }

        if (curForm !== 'news') {
            let upcase = this.firstLetter(curForm);
            formsEls = [{
                name: curForm,
                com: this['render' + upcase + 'Form'].bind(this)
            }];
        }

        this.setState({
            curForm: curForm,
            formsEls: formsEls,
            addBtns: btns
        })
    }

    tick() {
        const dateTime = new Date();
        this.setState({
            dateTime: dateTime
        });
    }

    firstLetter(str) {
        return str.replace(/^([a-z]{1})([a-z]+)$/, function() {
            return RegExp.$1.toLocaleUpperCase() + RegExp.$2;
        });
    }

    editMood(ev) {
        this.editUserInfo(ev, 'mood');
    }

    editHealth(ev) {
        this.editUserInfo(ev, 'health');
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

    toggleTitleForm() {
        this.toggleForm('title');
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

    onCancelImage() {
        this.setState({
            curImage: ''
        });
    }

    fileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "image-drag-box hover" : "image-drag-box");
    }

    fileSelectHandler(e) {
        this.fileDragHover(e);

        this.uploadImage.call(this, e);
    }

    getFindSuccess(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        const output = 'Latitude is ' + latitude + 'Longitude is ' + longitude;
        this.setState({
            findMe: output
        });
    }

    getFindError() {
        const output = "无法获取地理位置";
        this.setState({
            findMe: output
        });
    }

    geoFindMe() {
        let output = '正在确定地理位置...';

        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getFindSuccess.bind(this), this.getFindError.bind(this));
        }

        this.setState({
            findMe: output
        });
    }

    renderImageForm() {
        let { curImage } = this.state;

        if (!curImage) {
            return (
                <div className="form-group">
                    <div className="image-drag-box" 
                    onDragOver={this.fileDragHover.bind(this)} 
                    onDragLeave={this.fileDragHover.bind(this)} 
                    onDrop={this.fileSelectHandler.bind(this)} 
                    onClick={this.onAddImage.bind(this)}>
                        <button type="button" className="btn">添加图片 +</button>
                        <input 
                            ref={(imageUpload) => { this._imageUpload = imageUpload }} 
                            accept="image/gif, image/png, image/jpeg, image/jpg, image/bmp, image/webp" 
                            onChange={this.uploadImage.bind(this)} 
                            style={{ display : "none" }} 
                            id="image-upload" 
                            type="file" 
                            name="upload_file" 
                        />
                    </div>
                    <p className="field"><input type="hidden" name="image" value={this.state.curImageId} /></p>
                    <p className="validate-error"></p>
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
                    <p className="field"><input type="hidden" name="image" value={this.state.curImageId} /></p>
                    <p className="validate-error"></p>
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

                if (resp.result === 0) {
                    var url = resp.dataUrl,
                        imgId = resp.imageId;
                    if (url && imgId) self.loadImage(url, imgId);
                }
                else if (resp.result === 1) {
                    alert(resp.info)
                }
                else if (resp.result === 2) {
                    const { container } = this.props;
                    container.close();
                    const state = History.getState(),
                        { action } = state.data;
                    if (action && action !== 'signin') {
                        History.replaceState({ action: 'signin'}, 'signin', "?popup=signin");
                    }
                }

            };
        };
        xhr.send(fd);
    }

    onAddImage() {
        this._imageUpload.click();
    }

    changeText(evt) {
        this.setState({
            text: evt.target.value
        });
        //this.resizeConHeight();
    }

    textChange(evt) {
        this.setState({
            text: evt.target.value
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

    renderTitleForm() {
        const { curForm } = this.state,
            TITLES_MAP = {
                'text'  : '简单描述一下文字内容...',
                'image' : '简单描述一下图片内容...',
                'news'  : '简单描述一下网页的内容...'
            },
            TITLE = TITLES_MAP[curForm],
            NAME = TITLE? TITLE:'';

        return (
            <div className="form-group">
                <p className="field">
                    <textarea 
                    maxLength="140" 
                    data-cname={NAME} 
                    id="dream-title" 
                    name="content" 
                    placeholder={NAME}
                    >
                    </textarea>
                </p>
                <p className="validate-error"></p>
            </div>
        )
    }

    renderTextForm() {
        return (
            <div className="form-group">
                <TextEditor 
                ref={(ref) => this._textEditor = ref}
                placeholder="正文"
                className="text-editor"
                onChange={
                    this.changeText.bind(this)
                } 
                />
                <div 
                className="field"
                style={{ display: "none" }}
                >
                    <textarea 
                    id="textContent" 
                    onChange={
                        this.textChange.bind(this)
                    } 
                    name="text"
                    value={this.state.text}
                    ></textarea>
                </div>
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
        const { addBtns, defTagWord, stateComplate, dateTime, findMe } = this.state;
        const { curForm } = this.state;

        let others = null,
            { formEls } = this.state,
            linkForm = null,
            titleForm = null;
        if (curForm === "news" || curForm === "text") {
            others = (
                <div ref={(ref) => { this._tabNav = ref }} id="dreamReleaseBar" className="nav-group">
                    <ul>
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
                    <FinishBtn 
                    ref={(ref) => {this._finishBtn = ref}} 
                    onFinishClick={this.validate.bind(this)} 
                    />
                </div>
            )
            curForm === "news" && (linkForm = this.renderLinkForm());
        }

        let category = "";
        curForm === "news" && (category = "正在记录一篇网页，如下...");
        curForm === "image" && (category = "正在记录一张图片，如下...");
        curForm === "text" && (category = "正在记录一篇文字，如下...");

        curForm !== "text" && (titleForm = this.renderTitleForm());

        let tagField = null,
            tagTips = '内容将分享到您的记事本...',
            { tid, tag } = this.props;
        if (tid && tag) {
            tagField = (
                <input 
                type="hidden" 
                name="tag" 
                value={tid} 
                />
            );
            tagTips = `内容将分享到人群”${tag}“...`;
        }

        const { container } = this.props;

        return (
            <div 
            className="post-editor-form" 
            ref={(ref) => { this._con = ref }}>
                <div className="post-editor-header">
                    <ul className="category-list">
                        <li className="cur">
                            <a rel="postText" href="javascript:;">
                                <i className="s s-edit s-2x"></i>
                                <span>文字</span>
                            </a>
                        </li>
                        <li>
                            <a rel="postImage" href="javascript:;">
                                <i className="s s-image s-2x"></i>
                                <span>图片</span>
                            </a>
                        </li>
                        <li>
                            <a rel="postLink" href="javascript:;">
                                <i className="s s-link s-2x"></i>
                                <span>网址</span>
                            </a>
                        </li>
                    </ul>
                    <div className="post-editor-ctrl">
                        <a href="javascript:;" 
                        className="close" 
                        onClick={() => { container.close() }}
                        >
                        <i className="s s-close s-2x"></i>
                        </a>
                    </div>
                </div>
                <div className="tab-content" ref={(ref) => { this._tabCon = ref }}>
                    <div ref={(popbd) => { this._popbd = popbd }} className="dream-area">
                        <div ref={(createInfo) => { this._createInfo = createInfo }} className="alert" style={{ display: "none" }}>
                        </div>
                        <form ref={(ref) => this._form = ref} action="/dream/new" method="post">
                            <div ref={(tagInfo) => { this._tagInfo = tagInfo }} className="alert form-group" style={{ display: "none" }}>
                            </div>
                            {tagField}
                            {linkForm}
                            {formEls.map((form, i) => {
                                let Form = form.com;
                                return (<Form key={i} />)
                            })}
                            {titleForm}
                            <input type="hidden" name="category" value={type} />
                        </form>
                    </div>
                </div>
                {others}
            </div>
        )
    }

    // 修改用户信息
    editUserInfo(ev, type) {
        let editBtn     = ev.target,
            editArea    = utils.closest(editBtn, 'div'),
            editContent = editArea.querySelector('em');

        if (editContent) {
            let state = utils.getData(editBtn, 'editstate');

            if (state === 'normal') {
                let desc = editContent.textContent.trim();
                editContent.innerHTML = `<input type="text" maxlength="30" value="${desc}" />`;
                editBtn.innerHTML = "<i class='s s-save s-lg'></i> 保存";
                utils.setData(editBtn, { editstate: 'editing' });
            }
            else{
                if (state !== 'saving') {
                    editBtn.textContent = "保存中...";
                    utils.setData(editBtn, { editstate: 'saving' });
                    let editor = editContent.querySelector('input');

                    if (editor) {
                        let desc = editor.value.trim(),
                            reqData = {};

                        reqData[type] = desc;

                        req.post(
                            "/user/update",
                            reqData,
                            (data) => {
                                common.xhrReponseManage(data, (data) => {
                                    editContent.innerHTML = desc;
                                    editBtn.innerHTML = "<i class='s s-edit s-lg'></i> 修改";
                                    utils.setData(editBtn, { editstate: 'normal' });
                                });
                            },
                            () => {
                                alert('服务器错误');
                            }
                        );
                    }
                }
            }
        }
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
        const { curForm } = this.state;
        let validate = true;

        self.fields = [];

        if (curForm === "news") {
            self.fields = [
                { name: 'content', require: true, label: '标题' },
                { name: 'link', label: '网址', err: "链接格式错误", fun: (val) => {
                    return (!val || utils.isUrl(val));
                } }
            ]
        }
        else if (curForm === "image") {
            self.fields = [
                { name: 'image', require: true, empty_msg: '图片木有添加', label: '图片' },
            ]
        }
        else if (curForm === "text") {
            self.fields = [
                { name: 'text', require: true, label: '文字' },
            ]
        }

        this._form && this._form
            .querySelectorAll(
            'input[type=text], \
            input[type=url], \
            input[type=hidden], \
            textarea'
        ).forEach((inp, key) => {
            let val    = inp.value,
                field  = utils.closest(inp, '.field'),
                tips   = field && field.nextElementSibling;

            //if (!tips) {
                //validate = false;
                //return;
            //}

            // 判断是否有效
            self.fields && self.fields.forEach((field) => {
                let name = field.name,
                    label = field.label;
                if (name === inp.name) {
                    val = val.trim();

                    // 判断是否为空
                    if (field.require) {
                        if (val.length === 0) {
                            tips.innerHTML = field.empty_msg || (label + "木有输入");
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
        let text = this.formData.text;
        if (text) {
            this.formData.text = this.encodeContent(text);
        }

        req.post(
            '/dream/new',
            this.formData,
            (data) => {
                common.xhrReponseManage(data, (data) => {
                    if (data.result === 0 && data.data) {
                        const { did } = data.data;
                        did && window.location.replace('/dream/' + did);
                    }
                });
            }
        );
    }
}

export default class PostEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            checked: false,
            tagName: '',
            type: '',
            tag: ''
        }
    }

    checkUser(cb) {
        const { tag } = this.props;

        if (tag) {
            req.getJSON(
                '/tag/getinfo',
                { tid: this.curTag },
                cb.bind(this),
                () => {
                    alert('网络异常');
                    this.close();
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
                    this.close();
                }
            );
        }
    }

    show(params) {
        const { type, tag } = params;
        this.loadPostForm(type, tag);
    }

    loadPostForm(type, tag) {
        this.setState({
            loading: true
        });
        this.checkUser((data) => {
            try {
            const ret = +data.result;
            if (ret === 0) {
                let { tagName = '' } = data.data || {};
                this.setState({
                    loading: false,
                    checked: true,
                    type: type,
                    tag: tag,
                    tagName: tagName
                });
            }
            else if (ret === 2) {
                const { dialog } = this.props;
                dialog.hide();

                this.setState({
                    loading: false
                });

                const state = History.getState(),
                    { action } = state.data;
                if (action && action !== 'signin') {
                    History.replaceState({ action: 'signin'}, 'signin', "?popup=signin");
                }
            }
            else{
                alert(data.info);
                this.close();
            }
            }catch(err) {
                alert(err.message);
            }
        });
    }

    close() {
        const { dialog } = this.props;
        dialog.close();

        this.setState({
            checked: false
        });
    }

    render() {
        const { loading, tagName, checked } = this.state;

        if (loading) {
            return (
                <div className="loading">正在验证用户状态...</div>
            );
        }
        else{
            if (checked) {
                const { type, tag } = this.state;

                return  <DreamForm
                    container={this}
                    type={type}
                    tid={tag}
                    tag={tagName}
                    />;
            }
            else{
                return null;
            }
        }
    }
}

