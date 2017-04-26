// 公共使用小工具
class Tools {;

    isFunction( fn ) { 
        return !!fn && !fn.nodeName && fn.constructor != String && 
            fn.constructor != RegExp && fn.constructor != Array && 
            /function/i.test( fn + "" ); 
    } 

    // 简易模板
    template(tpl, data) {
        return tpl.replace(/\{\{\s*([\w\.]+)\s*\}\}/g, function(){
            var keys = arguments[1].split('.');
            var newData = data;
            for (var k = 0,l=keys.length;k < l;++k)
                newData = newData[keys[k]]
            return newData;
        })
    }
}

var tools = new Tools();

export default tools;
