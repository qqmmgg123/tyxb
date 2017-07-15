import React from 'react';
import ReactDOM from 'react-dom';
import keyboard from 'keyboard';
import BaseCom from 'basecom';

export default class Dialog extends BaseCom {
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
        this.setState({
            visible: 'block'
        });

        let body = document.body;
        body.className += 'un-scroll';

        this.colsefn = this.close.bind(this);

        const { needKey } = this.props;
        needKey && keyboard.addHandle('escape_keydown', this.colsefn);

        const { props } = this.state;
        this._sence && this._sence.show && this._sence.show(props);
    }

    close() {
        const state = History.getState(),
            { action } = state.data,
            { routerName } = this.props;
        if (action && action === routerName) {
            History.back();
        }
        else{
            this.hide();
        }
    }

    hide() {
        this.setState({
            visible: 'none'
        });

        
        let body = document.body;
        body.className = body.className.replace('un-scroll', '');

        const { needKey } = this.props;
        needKey && keyboard.removeHandle('escape_keydown', this.colsefn);
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
                            <Component ref={(ref) => { this._sence = ref }} {...props} dialog={this} />
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
