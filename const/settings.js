var settings = {
    COPY_RIGHT: "© 2017 娑婆诃",
    APP_NAME: "太阳日常",
    CASE_NUMBER: "粤ICP备16089330号-1",
    DOMAIN: 'www.ty-xb.com',
    SLOGAN: "记录点滴，感受彼此",
    UNKNOW_ERR: '异常错误',
    PARAMS_PASSED_ERR_TIPS: "参数传递错误!",
    USER_EXISTS_TIPS: "对不起，该用户已经存在，请重新尝试",
    PAGE_NOT_FOND_TIPS: "该页面不存在",
    USER_NOT_EXIST_TIPS: "该用户不存在",
    DREAM_NOT_EXIST_TIPS: "抱歉，你查看的内容不存在",
    TAG_EXIST_ERR: "该圈子已经存在，不能重复创建了",
    TAG_MORE_ERR: "抱歉，目前一个用户只能创建1个圈子，可以留给他人些机会，圈子名称是唯一的，也请谨慎创建",
    COMMENT_REQUIRE_ERR: "回复不能为空",
    TAG_VALIDATION: "必须是由2~24个小写字母、数字、中文或下划线组成",
    USERNAME_VALIDATION: "必须是由2~24个小写字母、数字、中文或下划线组成",
    PASSWORD_VALIDATION: "必须是6~16个字符的字母或数字组成",
    BUILDING_WORD: "该功能正在建设中，敬请谅解太阳圈子小站长一个人战斗，会累死~抱歉",
    DREAM_PASS_ERROR: '您的发布的内容由于不符合本圈子或本站的发文规则，因此被该圈子驳回，敬请谅解。',
    SUBSCRIBE: '关注 +',
    CANCEL_SUBSCRIBE: '取消关注 -',
    COMMENT_TEXT: {
        EXPANSION_COMMENT: '回复'
    },

    OBJEXT_TYPE: {
        DREAM      : 0, // 想法
        COMMENT    : 1  // 留言
    },

    OBJECT: {
        DREAM: {
            CNNAME: '日常'
        },
        TAG: {
            CNNAME: '圈子'
        }
    },

    SORT_ROLE: {
        HOT       : 1,  // 好评
        NEW       : 2   // 最新
    },

    REGISTRATION: {
        WORDING: "欢迎使用太阳日常~"
    },

    PERMS: {
        DREAM_REMOVE: '58a6ab9a1abc2e1c60f8c9ae'
    }
};

// 模块定义
if (typeof(module) === 'object' && module.exports === exports) {
    module.exports = settings;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        'use strict';
        return settings;
    });
} else {
    exports.settings = settings;
}
