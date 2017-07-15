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
            imageSrc: '',
            scale: 3
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

    rangeChange(ev) {
        const { value } = ev.target;

        this.setState({
            scale: value
        });
    }

    close() {
        const { dialog } = this.props;
        dialog.close();
    }

    render () {
        const { imageSrc, scale } = this.state;

        return (
            <div className="dialog-inner">
              <div className="hd">
                  <a href="javascript:;" className="back" onClick={this.close.bind(this)}><i className="s s-back s-2x"></i><span>返回</span></a>
                  <button className="btn" onClick={this.onClickSave.bind(this)}>保存</button>
              </div>
              <div className="bd">
              <AvatarCroper
              ref={this.setEditorRef}
              image={imageSrc}
              width={96}
              height={96}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={scale}
              rotate={0}
              />
                <div className="slider-wrapper">
                    <input onChange={this.rangeChange.bind(this)} value={scale} min="0.1" max="5" step="0.1" type="range" />
                </div>
              </div>
            </div>
        )
    }
}

export default MyEditor
