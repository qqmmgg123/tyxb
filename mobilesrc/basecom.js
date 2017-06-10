class BaseCom extends React.Component {
    constructor(props) {
        super(props);
    }

    delegate(el, selectors, handles) {
        el.addEventListener('click', (ev) => {
            var el = ev.target,
                matchesSelector = el.matches 
                || el.webkitMatchesSelector 
                || el.mozMatchesSelector 
                || el.msMatchesSelector;

            while (el && el !== ev.currentTarget) {
                for (var i = 0, l = selectors.length; i < l; i++) {
                    var selector = selectors[i],
                        handle   = handles[i];

                    if (matchesSelector.call(el, selector)) {
                        return handle.call(this, ev, el);
                    }
                }
                el = el.parentElement;
            }
        });
    }
};

export default BaseCom;

