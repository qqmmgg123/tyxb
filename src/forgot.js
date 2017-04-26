(function(factory) {
    module.exports = factory(
        require('polyfill'),
        require('utils'),
        require('common')
    )
} (function (p, util, common) {
    // 密码重置form校验
    var pwdResetBtn = document.querySelector('#pwdreset-btn');
    pwdResetBtn && pwdResetBtn.addEventListener('click', function(ev) {
        var formData = {};
        var validate = true;
        var form = document.querySelector('#forgot-form');
        form.querySelectorAll('input').forEach(function(inp) {
            var val = inp.value.trim();
            var label = '邮箱';
            var tips = form.querySelector('.validate-error');

            // 判断是否为空
            if (val.length === 0) {
                tips.innerHTML = label + "未填写";
                tips.style.display = 'block';
                validate = false;
                return;
            }else{
                tips.innerHTML = '';
                tips.style.display = 'none';
            }

            var isValid = true,
                errorText = "";
            // 判断是否有效
            switch(inp.name) {
                case 'email':
                    if (!util.isValidEmail(val)) {
                        errorText = label + "的格式书写错误";
                        validate = false;
                        isValid = false;
                    }
                    break;
                default:
                    break;
            }
            if (!isValid) {
                tips.style.display = 'block';
                tips.innerHTML = errorText;
                validate = false;
                return;
            }else{
                tips.innerHTML = '';
                tips.style.display = 'none';
            }
            formData[inp.name] = val;
        });
        
        if (validate) {
            form.replaceWith("<p>正在发送密码重置邮件...请稍等</p>");
        }else{
            ev.preventDefault();
        }
    });

    common.statistics();
}));
