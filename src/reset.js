(function(factory) {
    module.exports = factory(
        require('../const/settings'),
        require('polyfill'),
        require('effect').default,
        require('utils'),
        require('common')
    );
} (function (s, p, e, utils, common) {
    // 密码重置form校验
    var form   = document.querySelector('#reset-form'),
        submit = form.querySelector('button.btn');

    submit && submit.addEventListener('click', function(ev) {
        var validate = true;
        form.querySelectorAll('input').forEach(function(inp) {
            var val = inp.value.trim(),
                label = utils.getData(inp, 'label'),
                row   = utils.closest(inp, '.form-group'),
                tips  = row.querySelector(".validate-error");

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
            switch(this.name) {
                case 'password':
                    if (!utils.isPassword(val)) {
                        errorText = label + s.PASSWORD_VALIDATION;
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
        });
        
        if (validate) {
            var state = this.nextElementSibling;
            state && (state.innerHTML = "密码重置中，请稍等...");
            state && (state.style.display = "block");
        }else{
            ev.preventDefault();
        }
    });

    common.statistics();
}));

