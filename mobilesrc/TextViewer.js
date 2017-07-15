import React from 'react';
import ReactDOM from 'react-dom';
import req from 'req';

export default class TextViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            content: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dreamUrl && nextProps.dreamUrl !== this.state.dreamUrl) {
            this.loadContent(nextProps.dreamUrl);
        }
    }

    loadContent(url) {
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
        img.onload = () => {
            this.setState({
                loading: false,
                imageSrc: src
            });
        };
        img.onerror = () => {
            alert("网络异常，图片加载失败");
        }
    }

    close() {
        const { dialog } = this.props;
        dialog.close();
    }

    render() {
        const { loading, content } = this.state;

        if (!loading) {
            return (
                <div className="">{content}</div>
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

