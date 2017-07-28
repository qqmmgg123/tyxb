/*
 * @fileOverview 远程请求
 * @version 0.1
 * @author minggangqiu
 */
class Req {
    // XmlHttprequest
    ajax(url, data, type="get", success, error) {

        function createXHR() {
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            }
        }

        var xhr = createXHR();

        var params = '';
        if (data) {
            for(name in data) {
                var value = encodeURIComponent(data[name]).replace('%20','+').replace('%3D','=');
                params += name + "=" + value + "&";
            }

            // 删除掉最后的"&"字符
            params = params.slice(0, -1);
        }

        function reqComplete() {
            try {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        var data = JSON.parse(xhr.responseText);
                        success && success.call(this, data);
                        xhr.removeEventListener("load", reqComplete, false);
                    }else if(xhr.status == 500) {
                        alert("服务器错误。");
                    }
                }
            }catch(err) {
                alert("服务器错误。");
            }
        }

        xhr.addEventListener("load", reqComplete, false);

        xhr.onerror = function(err) {
            error && error.call(this, err);
            xhr.onerror = null;
        }

        if (type === 'get') {
            var t = (new Date()).getTime();
            url = url + (params? "?" + params + '&_t=' + t:'?_t=' + t);
        }

        xhr.open(type, encodeURI(url), true);
        xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
        if (type === 'post') {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            xhr.send(params);
            return;
        } else if (type === 'get') {
            xhr.setRequestHeader("If-Modified-Since", "0");
        }
        xhr.send(null);
    }

    getJSON(url, data, success, error) {
        this.ajax(
            url,
            data,
            undefined,
            success,
            error
        )
    }

    post(url, data, success, error) {
        this.ajax(
            url,
            data,
            'post',
            success,
            error
        )
    }
};

var req = new Req();

export default req;

