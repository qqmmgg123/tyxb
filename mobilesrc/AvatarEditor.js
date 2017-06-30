import React from 'react';
import ReactDOM from 'react-dom';
import req from 'req';
import AvatarCroper from 'AvatarCroper';

const common = require('common');

class MyEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            imageId: '',
            imageSrc: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.imageSrc && nextProps.imageSrc !== this.state.imageSrc && 
            nextProps.imageId && nextProps.imageId !== this.state.imageId) {
            this.loadImage(nextProps.imageSrc, nextProps.imageId);
        }
    }

    loadImage(src, id) {
        console.log(src, id);
        this.setState({
            imageSrc: src,
            imageId: id
        });
    }

    setEditorRef = (editor) => {
        this.editor = editor
    }

    onClickSave() {
        const rect = this.editor.getCroppingRect(),
            { imageId } = this.state;
        req.post(
            "/settings/avatar/update",
            {
                ...rect,
                image: imageId
            },
            function(data) {
                common.xhrReponseManage(data, (data) => {
                    if (data.result === 0 && data.data) {
                        const { avatar } = data.data;
                        
                        if (!avatar) return;

                        const updateAvatarBtn = document.querySelector('#updateAvatar');
                        let img = null;
                        if (updateAvatarBtn) {
                            img = updateAvatarBtn.querySelector('img');
                            img && img.setAttribute('src', avatar);
                        }
                        this.close();
                    }
                });
            },
            function() {
                alert('服务器错误');
            }
        );
    }

    close() {
        const { dialog } = this.props;
        dialog.close();
    }

    render () {
        const { imageSrc } = this.state;
        console.log(imageSrc);

        return (
            <div>
            <div className="hd">
                <button className="btn" onClick={this.onClickSave.bind(this)}>保存</button>
                <a href="javascript:;" onClick={this.close.bind(this)} className="close"><i className="s s-close s-2x"></i></a>
            </div>
            <div className="bd">
            <AvatarCroper
            ref={this.setEditorRef}
            image={imageSrc}
            width={96}
            height={96}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0}
            />
            </div>
            </div>
        )
    }
}

export default MyEditor
