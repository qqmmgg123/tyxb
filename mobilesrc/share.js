/**
 * Created by wpzheng on 2015/3/2.
 */
// 分享
function shareaside(o){
    //参数说明：self.tit说明文字，self.pic小图片，self.url分享要链接到的地址
    var self = this;
    self.tit = o.tit;
    self.pic = o.pic;
    self.titsummary = o.intro;
    self.url = o.url;
}
shareaside.prototype={
    update: function(opts) {
        var self = this;
        for (var o in opts) {
            self[o] = opts[o];
        }
    },
    //参数说明：title标题，summary摘要，pic小图片，url分享要链接到的地址
    postToQzone:function (){
        var _url = encodeURIComponent(this.url);//当前页的链接地址使用document.location
        var _t = encodeURI(this.tit);//当前页面title，使用document.title
        var _pic = encodeURI(this.pic);//（例如：var _pic='图片url1|图片url2|图片url3....）
        var _summary=encodeURIComponent('');
        var x = window.screen.width;
        var y = window.screen.height;
        var _u = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+_url+'&title='+_t+'&pics='+_pic+'&summary='+_summary;
        window.open( _u,'\u5206\u4eab\u5230\u0051\u0051\u7a7a\u95f4\u548c\u670b\u53cb\u7f51',"height=480,width=608,top= "+(y-480)/2 + ", left = " + (x-608)/2 + ",toolbar=no,menubar=no,resizable=yes,location=yes,status=no");
    },
    shareToSina:function(){
        var url = "http://v.t.sina.com.cn/share/share.php",
            _url = this.url,
            _title = this.tit,
            _appkey = '',
            _ralateUid = '',
            c = '', pic = this.pic;
        var x = window.screen.width;
        var y = window.screen.height;
        c = url + "?url=" + encodeURIComponent(_url) + "&appkey=" + _appkey + "&title=" + _title + "&pic=" + pic + "&ralateUid=" + _ralateUid + "&language=";
        window.open(c, "shareQQ", "height=480,width=608,top= "+(y-480)/2 + ", left = " + (x-608)/2 + ",toolbar=no,menubar=no,resizable=yes,location=yes,status=no");
    }
}

define(function() {
    return shareaside;
});

