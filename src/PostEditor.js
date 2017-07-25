import BaseCom from 'basecom';
import req from 'req';
import TextEditor from 'TextEditor';

const utils  = require('utils');
const common = require('common');
const INDENT = '  ';
const BREAK  = '<br/>';

class RichEditor extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            html: ''
        }
    }

    componentDidMount(){
        this._editor.focus();
    }

    render() {
        return(
            <div>
                <TextEditor 
                html={this.state.html}
                ref={(ref) => this._editor = ref}
                placeholder="正文"
                className="text-editor"
                onChange={(evt) => {
                    this.setState({
                        html: evt.target.value
                    });
                }} 
                />
                <textarea 
                style={{display: "none"}}
                {...this.props}
                value={this.state.html}
                ></textarea>
            </div>
        );
    }
}

class TextArea extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        }
    }

    componentDidMount(){
        this._textArea.focus();
    }

    render() {
        return(
            <textarea 
            {...this.props}
            ref={(ref) => { this._textArea = ref; }}
            onChange={(evt) => {
                this.setState({
                    text: evt.target.value
                });
            }}
            value={this.state.text}
            >
            </textarea>
        );
    }
}

class Input extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        }
    }

    componentDidMount(){
        this._input.focus();
    }

    render() {
        return(
            <input 
            {...this.props}
            ref={(ref) => { this._input = ref; }}
            onChange={(evt) => {
                this.setState({
                    value: evt.target.value
                });
            }} 
            value={this.state.value}
            />
        );
    }
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

const MOOD = {
    label: '心情',
    rel: 'tab-mood-post', 
    name: 'mood', 
    active: false
}

const HEALTH = {
    label: '身体状况',
    rel: 'tab-health-post', 
    name: 'health', 
    active: false
}

const BTNS = {
    "image": [MOOD, HEALTH],
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
    }, MOOD, HEALTH], 
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
    }, MOOD, HEALTH]
};

const NAME_MAP = {
    "title": "content",
    "link" : "link",
    "image": "image",
    "text" : "text",
    "mood" : "mood",
    "health" : "health"
};

const FIELDS = {
    "text": [{
        name: "text",
        type: "text",
        com: "textField"
    }],
    "image": [{
        name: "image",
        type: "image",
        com: "imageField"
    }, {
        name: "content",
        type: "title",
        com: "titleField"
    }],
    "news": [{
        name: "link",
        type: "link",
        com: "linkField"
    }, {
        name: "content",
        type: "title",
        com: "titleField"
    }]
};

class DreamForm extends BaseCom {
    get fieldBtns() {
        let { btns, fields } = this.state;

        // 根据表单渲染表单按妞
        for (let i = 0, l = btns.length; i < l; i++) {
            let btn = btns[i];
            btn.active = false;
            for (let n = 0, l = fields.length; n < l; n++) {
                let field = fields[n];
                if (btn.name === field.type) {
                    btn.active = true;
                }
            }
        }

        return (
            <ul>
            {btns.map((btn, i) =>
                <li key={i}>
                    <a 
                    href="javascript:;" 
                    className={(btn.active? 'btn cur':'btn')}
                    data-type={btn.name}
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
        const { type, title } = this.state,
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
                    <TextArea 
                    maxLength="140" 
                    data-cname={NAME} 
                    id="dream-title" 
                    name="content" 
                    placeholder={NAME} 
                    onFocus = {this.resetField.bind(this)}
                    />
                </p>
                <p className="validate-error"></p>
            </div>
        )
    }

    get textField() {
       const { text } = this.state;

       return () => (
            <div className="form-group">
                <div 
                className="field"
                >
                    <RichEditor 
                    onFocus = {this.resetField.bind(this)}
                    name="text" 
                    />
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
        return () => (
            <div className="form-group">
                <p className="field">
                    <Input
                    data-cname="网址" 
                    type="url" 
                    name="link" 
                    placeholder="网址，例: http://www.ty-xb.com"
                    onFocus = {this.resetField.bind(this)}
                    />
                </p>
                <p className="validate-error"></p>
            </div>
        )
    }

    get moreFields() {
        const { type } = this.state;

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

    get healthField() {
        return () => (
            <div className="form-group">
                <p className="field">
                    <TextArea 
                    maxLength="30" 
                    name="health" 
                    placeholder="身体状况" 
                    />
                </p>
                <p className="validate-error"></p>
            </div>
        )
    }

    get moodField() {
        return () => (
            <div className="form-group">
                <p className="field">
                    <TextArea 
                    maxLength="30" 
                    name="mood" 
                    placeholder="心情" 
                    />
                </p>
                <p className="validate-error"></p>
            </div>
        )
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
            fields: FIELDS[type],
            btns: BTNS[type]
        }
    }

    resetField(ev) {
        let inp    = ev.target,
            field  = utils.closest(inp, '.field'),
            tips   = field && field.nextElementSibling;

        tips.innerHTML = '';
        tips.style.display = 'none';
    }

    encodeContent(text) {
        return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join(BREAK + '\n');
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
                '[rel="tab-image-post"]',
                '[rel="tab-mood-post"]',
                '[rel="tab-health-post"]'
            ],
                handles   = [
                    this.setTextFormData,
                    this.setImageFormData,
                    this.setNewsFormData,
                    this.toggleForm,
                    this.toggleForm,
                    this.toggleForm,
                    this.toggleForm,
                    this.toggleForm,
                    this.toggleForm
                ];

            this.delegate(this._con, selectors, handles);
        }

        // 编辑器获得焦点
        // this._textEditor && this._textEditor.focus();
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

    toggleForm(ev, cur) {
        const fieldType = utils.getData(cur, 'type');

        let { btns, fields } = this.state, active;
        for (let i = 0, l = btns.length; i < l; i++) {
            let btn = btns[i];
            if (btn.name === fieldType) {
                active = btn.active;
                break;
            }
        }

        if (!active) {
            fields.push({
                name: NAME_MAP[fieldType],
                type: fieldType,
                com: fieldType + 'Field'
            });
        }
        else{
            fields = fields.filter((field) => {
                return field.type !== fieldType;
            });
        }

        this.setState({
            btns: btns,
            fields: fields
        });
    }

    onCancelImage() {
        this.setState({
            curImage: ''
        });
    }

    fileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (
            e.type == "dragover" ? 
            "image-drag-box hover" : "image-drag-box"
        );
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
                            <a 
                            rel={`post-${tab.type}`} 
                            href="javascript:;">
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

    checkField(item, val, tips, i) {
        const { label } = item;

        const err = utils.getData(tips, 'err'),
              eindex = utils.getData(tips, 'eindex');

        if (err && eindex !== i) {
            return false;
        }

        // 判断是否为空
        if (item.require) {
            if (val.length === 0) {
                tips.innerHTML = item.empty_msg || (label + "木有输入");
                tips.style.display = 'block';
                utils.setData(tips, {'err': true});
                utils.setData(tips, {'eindex': i});
                return false;
            }
            else{
                tips.innerHTML = '';
                tips.style.display = 'none';
                utils.setData(tips, {'err': false});
                utils.setData(tips, {'eindex': i});
            }
        }

        let isValid  = true,
            errorText = "";
        if (item.fun) {
            if (!item.fun(val)) {
                isValid  = false;
                errorText = item.err || '';
            }

            if (!isValid) {
                tips.style.display = 'block';
                tips.innerHTML = errorText;
                utils.setData(tips, {'err': true});
                utils.setData(tips, {'eindex': i});
                return false;
            }
            else{
                tips.innerHTML = '';
                tips.style.display = 'none';
                utils.setData(tips, {'err': false});
                utils.setData(tips, {'eindex': i});
            }
        }
        return true;
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
            rules = {};

        switch (type) {
            case "news":
                rules = {
                    content: [
                        { require: true, label: '标题' }
                    ],
                    link   : [
                        { require:true, label: '网址' },
                        { label: '网址', err: "链接格式错误", fun: (val) => {
                            return (!val || utils.isUrl(val));
                        }}
                    ]
                }
                break;
            case "image":
                rules = {
                    image: [
                        { 
                            require: true, empty_msg: '图片木有添加', label: '图片'
                        }
                    ]
                }
                break;
            case "text":
                rules = {
                    text: [
                        { require: true, label: '文字' }
                    ]
                }
                break;
        }

        this._form && this._form
            .querySelectorAll(
            'input[type=text], \
            input[type=url], \
            input[type=hidden], \
            textarea'
        ).forEach((inp, key) => {
            let val    = inp.value.trim(),
                field  = utils.closest(inp, '.field'),
                tips   = field && field.nextElementSibling;

            // 判断是否有效
            for (let key in rules) {
                let rule  = rules[key],
                    name  = key;

                if (name === inp.name) {
                    if (rule.length > 0) {
                        rule.forEach((item, i) => {
                            if (!this.checkField(item, val, tips, i)) {
                                validate = false;
                            }
                        });
                    }
                    else{
                        if (!this.checkField(rule, val, tips, 0)) {
                            validate = false;
                        }
                    }
                }
            }
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

