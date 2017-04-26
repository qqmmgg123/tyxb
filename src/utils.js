define([], function() {

    var utilities = {
        extend: function() {

            // Variables
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;

            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            var merge = function (obj) {
                for ( var prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                            extended[prop] = extend( true, extended[prop], obj[prop] );
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            // Loop through each object and conduct a merge
            for ( ; i < length; i++ ) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;

        },
        isValidEmail: function(emailAddress) {
            var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            return pattern.test(emailAddress);
        },
        isUrl: function(str) {
            var pattern = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
            if(!pattern.test(str)) {
                return false;
            } else {
                return true;
            }
        },
        isUserName: function(name) {
            var pattern = /^([a-z\d_\u4e00-\u9fa5]){6,12}$/i;
            return pattern.test(name);
        },
        isNickName: function(name) {
            var pattern = /^[a-z\d_\u4e00-\u9fa5]{2,12}$/i;
            return pattern.test(name);
        },
        isPassword: function(pwd) {
            var pattern = /^\w{6,16}$/i;
            return pattern.test(pwd);
        },
        isTag: function(name) {
            var pattern = /^[\w|\u4e00-\u9fa5]{1,24}$/i;
            return pattern.test(name);
        },
        getData: function(el, key) {
            var v;
            if (el.dataset) {
                v = el.dataset[key];
            }else{
                v = el.getAttribute('data-' + key);
            }

            // Undefined
            if (v == undefined) {
                return undefined;
            }
            
            // Boolean
            if (v === 'true' || v === 'false') {
                return v === 'true';
            }

            return v;
        },
        setData: function(el, data) {
            for (var k in data) {
                if (el.dataset) {
                    el.dataset[k] = data[k];
                }else{
                    el.setAttribute('data-' + k, data[k]);
                }
            }
        },
        addClass: function(element, className) {
            var classList = element.classList;
            if (classList) {
                return classList.add(className);
            }
            if (this.hasClass(element, className)) {
                return;
            }
            element.className += " " + className;
        },
        removeClass: function(element, className) {
            var classList = element.classList;
            if (classList) {
                return classList.remove(className);
            }

            element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ");
        },
        hasClass: function(element, className) {
            var classList = element.classList;
            if (classList) {
                return classList.contains(className);
            }

            var elementClassName = element.className;
            return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
        },
        closest: function(el, selector) {
            var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

            while (el) {
                if (matchesSelector.call(el, selector)) {
                    break;
                }
                el = el.parentElement;
            }
            return el;
        },
        checkPlaceholder: function() {
            var inp = document.createElement('input'),
            ret =  ('placeholder' in inp);
            inp = null;
            return ret;
        },
        // 增加输入框提示（主要是为了兼容ie）
        placeholder: function(container) {
            if(!this.checkPlaceholder()){
                var inputs = container.querySelectorAll('input, textarea');
                for(var i=0, count = inputs.length;i<count;i++){
                    if(inputs[i].getAttribute('placeholder')){
                        inputs[i].style.cssText = "color:#939393;"
                        inputs[i].value = inputs[i].getAttribute("placeholder");
                        inputs[i].onclick = function(){
                            if(this.value == this.getAttribute("placeholder")){
                                this.value = '';
                                this.style.cssText = "color:#000;font-style:normal;"
                            }
                        }
                        inputs[i].onblur = function(){
                            if(this.value == ''){
                                this.value = this.getAttribute("placeholder");
                                this.style.cssText = "color:#939393;";
                            }
                        }
                    }
                }
            }
        }
    }

    return utilities;
});
