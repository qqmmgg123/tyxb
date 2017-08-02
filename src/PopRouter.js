import Dialog from 'Dialog';
import PostEditor from 'PostEditor';
import ImageViewer from 'ImageViewer';
import AvatarEditor from 'AvatarEditor';
import TextViewer from 'TextViewer';

(function(factory) {
    module.exports = factory(
        require('utils'),
        require('common'),
        require('popup')
    );
} (function(utils, common, popup) {
    const _d = document,
          _w = window,
        popups = [
            'avatareditor', 
            'imageview', 
            'signin', 
            'signup', 
            'posteditor',
            'textview'
        ],
        postCon = _d.querySelector('#postEditorCon'),
        viewerCon = _d.querySelector('#imageViewerCon'),
        avatarCon = _d.querySelector('#avatarEditorCon'),
        textViewerCon = _d.querySelector('#textViewerCon');

    if (postCon) {
        _w.postEditor = ReactDOM.render(
            <Dialog 
            routerName="posteditor"
            needWin={true}
            canScroll={true}
            needKey={true}
            needMouse={true}
            sence={{
                name: "PostEditor",
                component: PostEditor
            }} />,
            postCon
        );
        _w.postEditor.create();
    }

    if (viewerCon) {
        _w.imageViewer = ReactDOM.render(
            <Dialog 
            needMouse={true}
            routerName="imageview"
            needKey={true}
            needWin={false}
            sence={{
                name: "ImageViewer",
                component: ImageViewer
            }} />,
            viewerCon
        );
        _w.imageViewer.create();
    }

    if (avatarCon) {
        _w.avatarEditor = ReactDOM.render(
            <Dialog 
            routerName="avatareditor"
            needWin={true}
            sence={{
                name: "AvatarEditor",
                component: AvatarEditor
            }} />,
            avatarCon
        );
        _w.avatarEditor.create();
    }

    if (textViewerCon) {
        _w.textViewer= ReactDOM.render(
            <Dialog 
            routerName="textview"
            needWin={true}
            needKey={true}
            needMouse={true}
            sence={{
                name: "TextViewer",
                component: TextViewer
            }} />,
            textViewerCon
        );
        _w.textViewer.create();
    }

    function popupRouter(action, params) {
        switch(action) {
            case "avatareditor":
                _w.avatarEditor && _w.avatarEditor.setComProps({
                    imageSrc: params && params.src,
                    imageId: params && params.id
                });
                _w.avatarEditor && _w.avatarEditor.show();
                break;
            case "imageview":
                _w.imageViewer && _w.imageViewer.setComProps({
                    imageSrc: params && params.src
                });
                _w.imageViewer && _w.imageViewer.show();
                break;
            case "signin":
                _w.signinPop = popup.registrationPop({ 
                    cur : 'signin'
                });
                _w.signinPop.show();
                break;
            case "signup":
                _w.signupPop = popup.registrationPop({ 
                    cur : 'signup'
                });
                _w.signupPop.show();
                break;
            case "posteditor":
                if (params) {
                    _w.postEditor && _w.postEditor.setComProps({
                        pid   : 'textReleasePop',
                        type : params && params.type,
                        tag  : params && params.tag
                    });
                    _w.postEditor.show();
                }
                break;
            case "textview":
                _w.textViewer && _w.textViewer.setComProps({
                    did: params && params.did,
                    el: _w.curDreamItem
                });
                _w.textViewer && _w.textViewer.show();
                break;
        }
    }
        
    History.Adapter.bind(_w, 'statechange', function() {
        const state = History.getState(),
            { action, params } =  state.data;

        if (action) {
            popupRouter(action, params);
        }
        else{
            _w.textViewer && _w.textViewer.close();
            _w.avatarEditor && _w.avatarEditor.close();
            _w.imageViewer && _w.imageViewer.close();
            _w.postEditor && _w.postEditor.close();
            _w.signinPop && _w.signinPop.close(),_w.signinPop = null;
            _w.signupPop && _w.signupPop.close(),_w.signupPop = null;
        }

        if (_w.nextState) {
            const { action } = _w.nextState;

            switch(action) {
                case "signin":
                    common.showSigninPop();
                    break;
            }

            _w.nextState = null;
        }
    });

    const params  = utils.getUrlParams(),
        paramsStr = '?' + _w.location.search.substr(1),
        _popup = params.popup;

    if (_popup && popups.indexOf(_popup) !== -1) {
        const state = History.getState();
        let { action } = state.data;

        if (!action) {
            History.pushState(null, '', '/');
            History.pushState({ 
                action: _popup,
                params: params
            }, _popup, paramsStr);
        }
        else{
            popupRouter(action, params);
        }
    }
}));
