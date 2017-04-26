'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.face = factory();
  }
}(this, function () {
    function Face() {
        this.faceList = [
            { title: "微笑", style: '(∩＿∩)' },
            { title: "嘟嘴", style: '(・ω・)' }, 
            { title: "愤怒", style: '╰（｀□′）╯' },
            { title: "惊讶", style: '（⊙ο⊙）' },
            { title: "无奈", style: '╮(╯▽╰)╭ ' },
            { title: "可爱", style: '(*^__^*)'},
            { title: "Yeah!", style: '(●°u°●)」' },
            { title: "卡哇伊", style: '(๑• . •๑)' },
            { title: "飞吻", style: '（づ￣3￣）づ╭❤～' }
        ];
    }

    Face.prototype.create = function(opts) {
        var self = this;
        this.$ = {};
        this.$.tips = $('<div></div>')
            .addClass('face-tips')
            .hide()
            .html('<ul>' + (function(list) {
                var str = '';
                for (var i=0, l = list.length; i < l; i++) {
                    var f = list[i]
                    str += '<li><a title="' + f.title + '" href="javascript:;">' + f.style + '</a></li>';
                }

                return str;
            })(this.faceList) + '</ul>')
            .appendTo($(document.body))

        for (var k in opts) {
            switch (k) {
                case 'icon':
                case 'editor':
                    this.$[k] = $(opts[k]);
                    break;
                default:
                    break;
            }
        }

        this.$.icon.mouseenter(function() {
            var $this = $(this);
            var pos = $this.offset();
            self.$.tips.css({
                left: pos.left,
                top: pos.top + $this.height()
            }).show();
        }).mouseleave(function(e) {
            if (e.toElement !== self.$.tips[0] && !$.contains(self.$.tips[0], e.toElement)) {
                self.$.tips.hide();
            }
        });
        this.$.tips.mouseleave(function() {
            $(this).hide();
        }).on('click', 'a', function() {
            console.log(self.$.editor);
            self.$.editor.val(self.$.editor.val() + $(this).text());
            self.$.tips.hide();
        });

    }

    return function() {
        return new Face();
    };
}));

