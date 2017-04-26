// 效果处理
class Effect {
    
    fadeOut(el, cb) {
        var self = this;
        el.style.opacity = 1;

        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = 'none';
                cb && cb.call(self, el);
            } else {
                if (requestAnimFrame) requestAnimFrame(fade);
            }
        })();
    }

}

var effect = new Effect();

export default effect;
