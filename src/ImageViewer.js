import React from 'react';
import ReactDOM from 'react-dom';
import req from 'req';

export default class ImageViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            imageSrc: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.imageSrc !== this.state.imageSrc) {
            this.loadImage(nextProps.imageSrc);
        }
    }

    loadImage(src) {
        var img = new Image();
        this.setState({
            loading: true
        });
        if(img.complete) {
            this.setState({
                loading: false,
                imageSrc: src
            });
            return;
        }
        img.onload = function () {
            this.setState({
                loading: false,
                imageSrc: src
            });let state = window.history.state;
        if (state && state.release) {
            window.history.back();
        }
        };
        img.onerror = function() {
            alert("网络异常，图片加载失败");
        }
    }

    close() {
        const { dialog } = this.props;
        dialog.close();
    }

    render() {
        const { loading, imageSrc } = this.state;

        if (!loading) {
            return (
                <img className="center" src={imageSrc} />
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

