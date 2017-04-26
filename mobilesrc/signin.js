(function(factory) {
    module.exports = factory(
        require('polyfill'),
        require('req').default,
        require('validate')
    );
} (function (p, req, v) {
    v.validate({
        form: '#signinForm',
        fields: [
            { name: 'username', require: true, label: '用户名' },
            { name: 'password',  require: true, label: '密码' }
        ],
        onCheckInput: function() {
            var self = this;
            req.post(
                '/signin/check',
                { 
                    username: self.formData.username,
                    password: self.formData.password
                },
                function(data) {
                    if (data.result === 0) {
                        self.form.style.display = 'none';
                        self.form.nextElementSibling.style.display = 'block';
                        self.form.submit();
                    } else {
                        var infoBox = self.form.querySelector('#signinInfo');
                        infoBox && (infoBox.innerHTML = data.info);
                        infoBox && (infoBox.style.display = "block");
                    }
                }
            );
        },
    });

    // 数据统计
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?9ef942b0d6b160b80ac87ad7fdbb7d5f";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    })();
}));
