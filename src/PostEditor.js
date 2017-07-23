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

const BTNS = {
    "image": [],
    "news": [{ 
        label: '摘要', 
        rel: 'tab-text-post', 
        name: 'text', 
        active: false
    }, { 
        label: '配图',
        rel: 'tab-image-post', 
        name: 'image', 
        active: false 
    }], 
    "text": [{ 
        label: '标题', 
        rel: 'tab-title-post', 
        name: 'title', 
        active: false 
    }, { 
        label: '配图',
        rel: 'tab-image-post', 
        name: 'image', 
        active: false 
    }]
};

const FIELDS = {
    "text": [{
        name: "text",
        com: "textField"
    }],
    "image": [{
        name: "image",
        com: "imageField"
    }, {
        name: "content",
        com: "titleField"
    }],
    "news": [{
        name: "link",
        com: "linkField"
    }, {
        name: "content",
        com: "titleField"
    }]
};

class DreamForm extends BaseCom {
    get fieldBtns() {
        const { btns } = this.state;

        return (
            <ul>
            {btns.map((btn, i) =>
                <li key={i}>
                    <a 
                    href="javascript:;" 
                    className={(btn.active? 'btn cur':'btn')} 
                    rel={btn.rel}
                    >
                        <i className={
                            btn.active? 's s-subtract s-lg':"s s-plus s-lg"
                        }>
                        </i>
                        {btn.label}
                    </a>
                </li>
            )}
            </ul>
        )
    }

    get fieldEls() {
        const { type, fields } = this.state;

        return (
            <form 
            ref={(ref) => this._form = ref} 
            action="/dream/new" 
            method="post"
            >
                {fields.map((form, i) => {
                    let Form = this[form.com];
                    return (<Form key={i} />)
                })}
                <input 
                type="hidden" 
                name="category" 
                value={type} 
                />
            </form>
          )
    }

    get titleField() {
        const { type } = this.state,
            TITLES_MAP = {
                'text'  : '简单描述一下文字内容...',
                'image' : '简单描述一下图片内容...',
                'news'  : '简单描述一下网页的内容...'
            },
            TITLE = TITLES_MAP[type],
            NAME = TITLE? TITLE:'';

        return () => (
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

    get textField() {
       const { text } = this.state;

       return () => (
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
                    value={text}
                    ></textarea>
                </div>
                <p className="validate-error"></p>
            </div>
        )
    }

    get imageField() {
        const { image, imageId } = this.state;

        if (!image) {
            return () => (
                <div className="form-group">
                    <div className="image-drag-box" 
                    onDragOver={this.fileDragHover.bind(this)} 
                    onDragLeave={this.fileDragHover.bind(this)} 
                    onDrop={this.fileSelectHandler.bind(this)} 
                    onClick={this.onAddImage.bind(this)}>
                        <button 
                        type="button" 
                        className="btn"
                        >
                        添加图片 +
                        </button>
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
                    <p className="field">
                        <input 
                        type="hidden" 
                        name="image" 
                        value={imageId} 
                        />
                    </p>
                    <p className="validate-error"></p>
                </div>
            );
        }
        else{
            return () => (
                <div className="image-preview-area">
                    <a href="javascript:;" 
                    className="image-cancel-btn" 
                    onClick={this.onCancelImage.bind(this)}
                    >
                        <i className="s s-close s-lg"></i>
                    </a>
                    <img src={image} />
                    <p className="field">
                        <input type="hidden" name="image" value={imageId} />
                    </p>
                    <p className="validate-error"></p>
                </div>
            )
        }
    }

    get linkField() {
        const { link } = this.state;

        return () => (
            <div className="form-group">
                <p className="field">
                    <input onChange={
                        this.linkChange.bind(this)
                    } 
                    value={link} 
                    data-cname="网址" 
                    type="url" 
                    name="link" 
                    placeholder="网址，例: http://www.ty-xb.com" />
                </p>
                <p className="validate-error"></p>
            </div>
        )
    }

    get moreFields() {
        const { type } = this.state;

        if (type === "news" || type === "text") {
            return (
                <div 
                id="dreamReleaseBar" 
                className="nav-group"
                >
                    {this.fieldBtns}
                    <FinishBtn 
                    ref={(ref) => {this._finishBtn = ref}} 
                    onFinishClick={this.validate.bind(this)} 
                    />
                </div>
            )
        }
    }

    constructor(props) {
        super(props);

        const { type } = props;

        this.formData = null;

        this.state = {
            type: type,
            image: '',
            imageId: '',
            text: '',
            link: '',
            fields: FIELDS[type],
            btns: BTNS[type]
        }
    }
    
    encodeContent(text) {
        return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join(BREAK + '\n');
    }
    
    encodeAttr(text) {
        return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
    }

    componentDidMount() {
        this.initState();
    }

    initState() {
        if (this._con) {
            let selectors = [
                '[rel="post-text"]',
                '[rel="post-image"]',
                '[rel="post-news"]',
                '[rel="tab-title-post"]',
                '[rel="tab-text-post"]',
                '[rel="tab-link-post"]',
                '[rel="tab-image-post"]'
            ],
                handles   = [
                    this.setTextFormData,
                    this.setImageFormData,
                    this.setNewsFormData,
                    this.toggleTextForm,
                    this.toggleImageForm,
                    this.toggleLinkForm,
                ];

            this.delegate(this._con, selectors, handles);
        }

        this._form && this._form.querySelectorAll(
            'input[type=text], input[type=url], textarea'
        ).forEach((inp) => {
            inp.onfocus = (ev) => {
                let inp    = ev.target,
                    field  = utils.closest(inp, '.field'),
                    tips   = field && field.nextElementSibling;

                tips.innerHTML = '';
                tips.style.display = 'none';
            }
        });
        
        // 编辑器获得焦点
        this._textEditor && this._textEditor.focus();
    }

    setFormData(type) {
        this.setState({
            type: type,
            fields: FIELDS[type],
            btns: BTNS[type]
        });
    }

    setTextFormData(type) {
        this.setFormData('text');
    }

    setImageFormData(ev) {
        this.setFormData('image');
    }

    setNewsFormData(ev) {
        this.setFormData('news');
    }

    toggleForm(fieldType) {
        let { btns, fields } = this.state;

        let active;
        for (let i = 0, l = btns.length; i < l; i++) {
            let btn = btns[i];
            if (btn.name === fieldType) {
                active = btn.active;
                btn.active = !active;
                break;
            }
        }
        if (!active) {
            fields.push({
                name: fieldType === "title"? "content":fieldType,
                com: fieldType + 'Field'
            });
        }
        else{
            fields = fields.filter((field) => {
                return field.name !== fieldType;
            });
        }

        this.setState({
            btns: btns,
            fields: fields
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

    loadImage(url, id) {
        var img = new Image();
        /*this.setState({
            loading: true
        });*/
        img.src = url;
        if(img.complete) {
            this.setState({
                //loading: false,
                imageId: id,
                image: url
            });
            return;
        }
        img.onload = () => {
            this.setState({
                //loading: false,
                imageId: id,
                image: url
            });
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
    }

    textChange(evt) {
        this.setState({
            text: evt.target.value
        });
    }

    linkChange(ev) {
        let link = ev.target.value;

        this.setState({
            link: link
        })
    }

    render() {
        const { type } = this.state;
        const { container } = this.props;
        const tabs = [{
                        type: "text",
                        icon: "edit",
                        label: "文字"
                      }, {
                        type: "image",
                        icon: "image",
                        label: "图片"
                      }, {
                          type: "news",
                          icon: "link",
                          label: "网址"
                      }];

        return (
            <div 
            className="post-editor-form" 
            ref={(ref) => { this._con = ref }}>
                <div className="post-editor-header">
                    <ul className="category-list">
                        {tabs.map((tab, i) => 
                        <li key={i} className={tab.type === type? "cur":""}>
                            <a rel={`post-${tab.type}`} href="javascript:;">
                                <i className={
                                    `s s-${tab.icon} s-2x`
                                }>
                                </i>
                                <span>{tab.label}</span>
                            </a>
                        </li>
                        )}
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
                <div className="tab-content">
                    <div 
                    ref={(popbd) => { this._popbd = popbd }} 
                    className="dream-area"
                    >
                    {this.fieldEls}
                    </div>
                </div>
                {this.moreFields}
            </div>
        );
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
        const { type } = this.state;
        let validate = true, 
            fields = [];

        switch (type) {
            case "news":
                fields = [
                    { name: 'content', require: true, label: '标题' },
                    { name: 'link', label: '网址', err: "链接格式错误", fun: (val) => {
                        return (!val || utils.isUrl(val));
                    } }
                ]
                break;
            case "image":
                fields = [
                    { name: 'image', require: true, empty_msg: '图片木有添加', label: '图片' },
                ]
                break;
            case "text":
                fields = [
                    { name: 'text', require: true, label: '文字' },
                ]
                break;
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
            fields && fields.forEach((field) => {
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

