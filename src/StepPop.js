import React from 'react';
import ReactDOM from 'react-dom';
import keyboard from 'keyboard';
import BaseCom from 'basecom';

export default class StepPop extends BaseCom {
    constructor(props) {
        super(props);

        this.colsefn = null;
        this.routers = [];
        this.state = {
            routers: [],
            visible: 'none',
            destroy: false
        }
    }

    push(route) {
        this.state.routers.push(route);
        this.setState({
            routers: this.state.routers
        });
    }

    pop() {
        this.state.routers.pop();
        this.setState({
            routers: this.state.routers
        });
    }

    popToTop() {
        const { initRoute } = this.props;
        this.routers = [];
        initRoute && this.routers.push(initRoute);
        this.setState({
            routers: this.routers
        });
    }

    create() {
        this.popToTop();
        this.setState({
            destroy: false,
            visible: 'block'
        });
    }

    show() {
        this.setState({
            visible: 'block'
        });

        this.colsefn = this.close.bind(this);

        const { needKey } = this.props;
        needKey && keyboard.addHandle('escape_keydown', this.colsefn);
    }

    close() {
        this.setState({
            visible: 'none'
        });

        const { needKey } = this.props;
        needKey && keyboard.removeHandle('escape_keydown', this.colsefn);
    }

    destroy() {
        this.setState({
            destroy: true,
            visible: 'none'
        });
    }

    mouseClose() {
        const { needMouse } = this.props;
        needMouse && this.close();
    }

    render() {
        let rLen   = this.state.routers.length,
            route  = this.state.routers[rLen - 1],
            sence  = null,
            result = (route && this.props.renderScene && this.props.renderScene(route, this));

            if (result) {
                sence = result;
            }

        console.log(this.state.destroy, sence);

        if (!this.state.destroy) {
            return (
                <div className="dialog-box" style={{ display: this.state.visible }}>
                <div id={this.props.pid} ref="dialog" className="dialog">{sence}</div>
                <div onMouseDown={this.mouseClose.bind(this)} className="modal fade-in"></div>
                </div>
            );
        }
        else{
            return null;
        }
    }
}
