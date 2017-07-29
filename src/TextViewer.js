import req from 'req';

const common   = require('common');

export default class TextViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            did     : '',
            content : '',
            text : ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.did && nextProps.did !== this.state.did) {
            this.loadContent(nextProps.did);
        }
    }

    loadContent(did) {
        this.setState({
            loading: true
        });
        
        req.getJSON(
            "/dream/textloaded",
            {
                did: did
            },
            (data) => {
                try {
                common.xhrReponseManage(data, (data) => {
                    let content = "", 
                        text = "文字没有找到...";

                    if (data.data && data.data.dream) {
                        let dream = data.data.dream;
                        content = dream.content;
                        text = dream.text;
                    }

                    this.setState({
                        content: content,
                        text: text,
                        loading: false,
                    });
                });
                }
                catch(err) {
                    alert(err.message);
                }
            },
            () => {
                this.close();
                alert("网络异常，内容获取失败");
            }
        );
    }

    close() {
        const { dialog } = this.props;
        dialog.close();
    }

    render() {
        const { loading, content, text } = this.state;

        if (!loading) {
            return (
                <div className="text-viewer-box">
                    <h1>{content}</h1>
                    <div dangerouslySetInnerHTML={{__html: text}} />
                </div>
            )
        }
        else{
            return (
                <div id="loading">
                    <div id="loading-center">
                        <div id="loading-center-absolute">
                            <div className="object" id="object_zero"></div>
                            <div className="object" id="object_one"></div>
                            <div className="object" id="object_two"></div>
                            <div className="object" id="object_three"></div>
                            <div className="object" id="object_four"></div>
                            <div className="object" id="object_five"></div>
                            <div className="object" id="object_six"></div>
                            <div className="object" id="object_seven"></div>
                            <div className="object" id="object_eight"></div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

