(function(factory) {
    module.exports = factory(
        require('../const/settings'),
        require('polyfill'),
        require('effect').default,
        require('utils'),
        require('common')
    )
} (function (s, p, e, utils, common) {
    // 个人信息form校验
    var form   = document.querySelector('#profile-form'),
        submit = form.querySelector('button.btn'),
        info   = form.querySelector('.info-text');

    info && setTimeout(function() {
        e.fadeOut(info);
    }, 2500);

    submit && submit.addEventListener('click', function(ev) {
        var validate = true;
        form.querySelectorAll('input, textarea').forEach(function(inp) {
            var val = inp.value.trim(),
                label = utils.getData(inp, 'label'),
                row   = utils.closest(inp, '.form-group'),
                tips  = row.querySelector(".validate-error");

            // 判断是否为空
            if (inp.name === 'nickname') {
                if (val.length === 0) {
                    tips.innerHTML = label + "未填写";
                    tips.style.display = 'block';
                    validate = false;
                    return;
                }else{
                    tips.innerHTML = '';
                    tips.style.display = 'none';
                }
            }

            var isValid = true,
                errorText = "";
            // 判断是否有效
            switch(inp.name) {
                case 'nickname':
                    if (!utils.isNickName(val)) {
                        errorText = label + s.NICK_NAME_VALIDATION;
                        validate = false;
                        isValid = false;
                    }
                    break;
                case 'bio':
                    if (val.length > 140) {
                        errorText = label + "的字符数不能超过140个";
                        validate = false;
                        isValid = false;
                    }
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
        });
        
        if (validate) {
            var state = this.nextElementSibling;
            state && (state.innerHTML = "个人信息保存中，请稍等...");
            state && (state.style.display = "block");
        }else{
            ev.preventDefault();
        }
    });

    common.statistics();
}));
