(function(factory) {
    module.exports = factory(
        require('polyfill'),
        require('common')
    );
} (function (p, common) {
    // 认证邮件发送
    var emailBtn = document.querySelector('#email-btn');
    emailBtn && emailBtn.addEventListener('click', function() {
        var form = document.querySelector('#email-form');
        var p = document.createElement('p');
        p.innerHTML = "正在发送邮箱认证帐号邮件...请稍等";
        form && form.replaceWith(p);
        return true;
    });

    common.statistics();
}));
