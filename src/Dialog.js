import React from 'react';
import ReactDOM from 'react-dom';
import keyboard from 'keyboard';
import BaseCom from 'basecom';

export default class StepPop extends BaseCom {
    constructor(props) {
        super(props);
        let { sence } = props;

        if (!sence) {
            throw new Error("没有指定窗口内容组件...");
        }

        this.colsefn = null;
        this.state = {
            visible: 'none',
            destroy: false,
            props: sence.props || {}
        }
    }

    create() {
        this.setState({
            destroy: false
        });
    }

    show() {
        let state = window.history.state;
        if (state === null) {
            history.pushState({ release: 'dialog'}, 'dialog', "");
        }
        this.setState({
            visible: 'block'
        });
        let body = document.body;
        body.className += 'un-scroll';

        this.colsefn = this.close.bind(this);

        const { needKey } = this.props;
        needKey && keyboard.addHandle('escape_keydown', this.colsefn);
    }

    close() {
        this.setState({
            visible: 'none'
        });

        let body = document.body;
        body.className = body.className.replace('un-scroll', '');

        const { needKey } = this.props;
        needKey && keyboard.removeHandle('escape_keydown', this.colsefn);
        let state = window.history.state;
        if (state && state.release) {
            window.history.back();
        }
    }

    destroy() {
        this.setState({
            destroy: true
        });
    }

    setComProps(props) {
        this.setState({
            props: props
        });
    }

    mouseClose() {
        const { needMouse } = this.props;
        needMouse && this.close();
    }

    render() {
        const { sence, pid, needWin } = this.props;
        const Component = sence.component;
        let { props, destroy, visible } = this.state;

        if (!destroy) {
            if (needWin) {
                return (
                    <div className="dialog-box" style={{ display: visible }}>
                        <div id={pid} ref="dialog" className="dialog">
                            <Component {...props} dialog={this} />
                        </div>
                        <div onMouseDown={this.mouseClose.bind(this)} className="modal fade-in"></div>
                    </div>
                );
            }
            else{
                return (
                    <div className="dialog-box" style={{ display: visible }}>
                        <Component {...props} dialog={this} />
                        <div onMouseDown={this.mouseClose.bind(this)} className="modal fade-in"></div>
                    </div>
                )
            }
        }
        else{
            return null;
        }
    }
}
