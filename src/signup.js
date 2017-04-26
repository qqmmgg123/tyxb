(function(factory) {
    module.exports = factory(
        require('polyfill'),
        require('validate')
    );
} (function (p, v) {
    v.validate();

    // 数据统计
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?9ef942b0d6b160b80ac87ad7fdbb7d5f";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    })();
}));
