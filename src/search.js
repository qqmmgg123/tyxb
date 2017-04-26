// 搜索页
(function() {
    var utils    = require('utils'),
        req      = require('req').default,
        common   = require('common'),
        popup    = require('popup');
    
    // 订阅版面
    var tagList = document.querySelector('#tag-list');
    tagList && tagList.addEventListener('click', function(ev) {
        var cur  = ev.target,
            tid  = utils.getData(cur, 'tid'),
            hasSubscribe = utils.getData(cur, 'hassubscribe');

        while(cur.getAttribute &&
            ['tag-subscribe'].indexOf(cur.getAttribute('rel'))
                === -1 && cur.parentNode &&
                cur.parentNode !== ev.currentTarget) {
                    cur = cur.parentNode;
                }

        if (cur.getAttribute && cur.getAttribute('rel')) {
            var rel = cur.getAttribute('rel');

            if (rel === 'tag-subscribe') {
                if (!hasSubscribe) {
                    req.post(
                        "/tag/subscribe",
                        {
                            tid: tid
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    cur.innerHTML = "取消订阅 -";
                                    utils.setData(cur, { 
                                        'hassubscribe': true
                                    });
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {
                        }
                    );
                }else{
                    req.post(
                        "/tag/csubscribe",
                        {
                            tid: tid
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    cur.innerHTML = "订阅 +";
                                    utils.setData(cur, { 
                                        'hassubscribe': false
                                    });
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {
                        }
                    );
                }
            }
        }
    });

    // 支持
    var dreamList = document.querySelector('#dream-list');
    dreamList && dreamList.addEventListener('click', function(ev) {
        var cur  = ev.target;

        while(cur.getAttribute &&
            ['dream-good', 'dream-bad', 'dream-favourite', 'dream-delete'].indexOf(cur.getAttribute('rel'))
                === -1 && cur.parentNode &&
                cur.parentNode !== ev.currentTarget) {
                    cur = cur.parentNode;
                }

        if (cur.getAttribute && cur.getAttribute('rel')) {
            var rel = cur.getAttribute('rel'),
                did = utils.getData(cur, 'did');

            if (rel === 'dream-good') {
                var voteBox = utils.closest(cur, '.vote-ctrl-box'), voteNum, voteBad,
                    hasGood = utils.getData(cur, 'hasgood');
            
                voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
                voteBox && (voteBad  = voteBox.querySelector('[rel="dream-bad"]'));
                if (!hasGood) {
                    req.post(
                        "/dream/goodit",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.addClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasgood': true });
                                        voteNum.innerHTML = (isNaN(num)? 0:num);
                                        voteBad && utils.removeClass(voteBad.querySelector('i'), "s-ac");
                                        voteBad && utils.setData(voteBad, { 'hasbad': false });
                                    }
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {
                        }
                    );
                }else{
                    req.post(
                        "/dream/cgood",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.removeClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasgood': false });
                                        voteNum.innerHTML = (isNaN(num)? 0:num);
                                    }
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {
                        }
                    );
                }
            }
            // 反对
            else if (rel === 'dream-bad') {
                var voteBox = utils.closest(cur, '.vote-ctrl-box'), voteNum, voteGood,
                    hasBad = utils.getData(cur, 'hasbad');

                voteBox && (voteNum = voteBox.querySelector('[rel="vote-num"]'));
                voteBox && (voteGood  = voteBox.querySelector('[rel="dream-good"]'));

                if (!hasBad) {
                    req.post(
                        "/dream/badit",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.addClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasbad': true });
                                        voteNum.innerHTML = (isNaN(num)? 0:num);;
                                        voteGood && utils.removeClass(voteGood.querySelector('i'), "s-ac");
                                        voteGood && utils.setData(voteGood, { 'hasgood': false });
                                    }
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {
                        }
                    );
                }else{
                    req.post(
                        "/dream/cbad",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    if (data.data) {
                                        var num = parseInt(data.data.num);
                                        utils.removeClass(cur.querySelector('i'), "s-ac");
                                        utils.setData(cur, { 'hasbad': false });
                                        voteNum.innerHTML = (isNaN(num)? 0:num);
                                    }
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {
                        }
                    );
                }
            }
            // 收藏/取消收藏
            else if (rel === 'dream-favourite') {
                var hasFav = utils.getData(cur, 'hasfav');

                if (!hasFav) {
                    req.post(
                        "/dream/following",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    cur.innerHTML = "已收藏";
                                    utils.setData(cur, { 'hasfav': true });
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {

                        }
                    );
                }else{
                    req.post(
                        "/dream/cfollowing",
                        {
                            did: did
                        },
                        function(data) {
                            switch(data.result) {
                                case 0:
                                    cur.innerHTML = "收藏";
                                    utils.setData(cur, { 'hasfav': false });
                                    break;
                                case 1:
                                    alert(data.info);
                                    break;
                                case 2:
                                    common.showSigninPop();
                                    break;
                                default:
                                    break;
                            }
                        },
                        function() {
                        }
                    );
                }
            }
            // 删除想法
            else if (rel === 'dream-delete') {
                var curDreamItem = utils.closest(cur, '.list-item');
                req.post(
                    "/dream/delete",
                    {
                        did: did
                    },
                    function(data) {
                        switch (data.result) {
                            case 0:
                                effect.fadeOut(curDreamItem, function(el) {
                                    el.parentNode.removeChild(el);
                                });
                                break;
                            case 1:
                                alert(data.info);
                                break;
                            case 2:
                                common.showSigninPop();
                                break;
                            default:
                                break;
                        };
                    },
                    function() {
                    }
                );
            }
        }
    });
}())
