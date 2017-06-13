import Dialog from 'Dialog';
import ImageViewer from 'ImageViewer';

(function(factory) {
    module.exports = factory(
        require('utils'),
        require('common'),
        require('popup')
    );
} (function(utils, common, popup) {
    const _d = document,
          _w = window,
        path = _w.location.pathname,
        paths = path.split('/'),
        popups = ['imageview', 'signin', 'signup', 'share'];

    function popupRouter(action, params) {
        switch(action) {
            case "imageview":
                const viewerCon = _d.querySelector('#imageViewerCon');
                if (viewerCon) {
                    _w.imageViewer = ReactDOM.render(
                        <Dialog 
                            needMouse={true} 
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
            case "share":
                if (params) {
                    _w.textPop = popup.textNewPop({
                        id   : 'textReleasePop',
                        type : params && params.type,
                        tag  : params && params.tag
                    });
                    _w.textPop.show();
                }
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
            _w.imageViewer && _w.imageViewer.close(),_w.imageViewer = null;
            _w.textPop && _w.textPop.close(),_w.textPop = null;
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

    if (paths && paths.length >= 3) {
        const len = paths.length,
              firstpath = paths[len - 2],
              secondpath = paths[len - 1];

        if (firstpath === 'popup' && popups.indexOf(secondpath) !== -1) {
            const state = History.getState();
            let { action, params } = state.data;

            if (!params) {
                params = utils.getUrlParams();
            }

            if (!action) {
                History.pushState(null, '', '/');
                History.pushState({ action: secondpath}, secondpath, path);
            }
            else{
                popupRouter(action, params);
            }
        }
    }
}));
