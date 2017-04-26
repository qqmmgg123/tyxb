/*
 * @fileOverview 弹出窗口
 * @version 0.1
 * @author minggangqiu
 */
import req from 'req';
import React from 'react';
import ReactDOM from 'react-dom';
var utils         = require('utils');

class AutoComplete {
    constructor(opts) {
        this.opts = opts;
        this.init();
    }

    init() {
        var opts = this.opts || {};

        this.index = -1;
        this.visible = false;

        this.defaultOpts = {
            con: null,
            inp: '.input',
            url: '',
            width: 'auto',
            query: '',
            style: 'normal',
            map: {
                query: 'query',
                list: 'list',
                key: 'key',
                value: 'value'
            },
            fillVal: true,
            onQueryStart: null,
            onQueryEnd: null,
            onSelected: null,
            onEnter: null
        }

        this.settings = {};
        this.setOpts(opts);
    }

    setOpts(opts) {
        for (var o in this.defaultOpts) {
            this.settings[o] = typeof opts[o] !== 'undefined'? opts[o]:this.defaultOpts[o];
        }
        this.create();
    }

    create() {
        var conf = this.settings;
        if (!conf.inp || !conf.con) 
            return new Error('No element specified.')

        for (var o in conf) {
            switch (o.toLowerCase()) {
                case 'con':
                    this.con = conf.con;
                    this.con.style.position = 'relative';
                    var list = this.con.querySelector('.select-list');
                    if (list) {
                        this.selectList = list;
                    }else{
                        this.selectList = document.createElement('div');
                        this.con.appendChild(this.selectList);
                        this.selectList.className = 'select-list';
                    }
                    break;
                case 'inp':
                    this.inp = this.con.querySelector(conf.inp);
                    break;
                case 'query':
                    if (typeof conf[o] === 'string' && conf[o].length > 0)
                        this.inp.value = conf[o].trim();
                    break;
                case 'width':
                    var value = conf[o];
                    if (value) {
                        value += 'px';
                    }else if (value === 'auto'){
                        return;
                    }else{
                        value = this.inp.offsetWidth;
                    }

                    this.selectList.style[o] = value;
                    break;
                default:
                    this[o] = conf[o];
                    break;
            }
        }
        this.bintEvents();
    }

    reload() {
        let style = {
            link: (
            <ul>
                {this.data.list.map((item) => 
                    <li><a href="javascript:;" data-value={item.value}>{item.key} <i className="enter-in">→</i></a></li>
                )}
                </ul>
            ),
            normal: (
            <ul>
                {this.data.list.map((item) => 
                    <li><a href="javascript:;" data-value={item.value}>{item.key}</a></li>
                )}
                </ul>
            )
        }

        ReactDOM.render(
            style[this.style],
            this.selectList
        )
    }

    bintEvents() {
        var self = this;
        
        this.inp.addEventListener("mousedown", function(ev) {
            ev.stopPropagation();
        });

        this.selectList.addEventListener("mousedown", function(ev) {
            ev.stopPropagation();
        });

        document.body.addEventListener("mousedown", function() {
            self.hide();
        });

        this.inp.addEventListener("input", this.queryData.bind(this));

        this.selectList.addEventListener("click", function(ev) {
            var cur = ev.target;
            if (cur.nodeName.toLowerCase() === 'a') {
                var item = {
                    key   : cur.textContent,
                    value : utils.getData(cur, 'value')
                }
                self.onSelected && self.onSelected.call(self, item);
                self.fillVal && (self.inp.value = cur.textContent);
                self.hide();
            }
        });

        this.inp.addEventListener("keydown", this.arrowCtl.bind(this));
    }

    queryData(ev) {
        var self = this;
        var inp = ev.target,
            query = inp.value.trim();

        var data = {};
        data[this.map.query] = query;

        if (typeof query != 'string') return;

        var queryStart = function(key) {
            self.onQueryStart && self.onQueryStart.call(self);
        }

        var queryEnd = function(key) {
            self.onQueryEnd && self.onQueryEnd.call(self, key);
        }

        if (query.length > 0) {
            queryStart(query);
            req.getJSON(
                this.url,
                data,
                function(data) {
                    self.data = {};
                    var keys = self.map.list.split('.');
                    keys.forEach(function(key) {
                        data = data[key];
                    });
                    var list = data,
                        curKey = '';
                    if (list && list.length > 0) {
                        self.data.list = list.map(function(item) {
                            var newItem = {};
                            newItem.key = item[self.map.key];
                            newItem.value = item[self.map.value];
                            var key = query.trim();
                            if (newItem.key === key) {
                                curKey = key;
                            }
                            return newItem;
                        });

                        self.reload();

                        self.show();
                    } else {
                        self.hide();
                    }
                    queryEnd(curKey);
                },
                function() {
                    self.hide();
                    queryEnd();
                }
            );
        } else {
            self.hide();
            queryEnd();
        }
    }

    arrowCtl(e) {
        e.stopPropagation();
        var keyCode = e.keyCode, 
            self    = this;

        if (keyCode === 40 ||
            keyCode === 38 || 
            keyCode === 13) {
                var list = self.selectList.querySelectorAll('a');
                e.preventDefault();

                switch(keyCode){
                    case 40:
                        this.index += 1;
                        if(this.index > list.length - 1)
                            this.index = 0;
                        if(list){
                            for(var i = 0; i < list.length; i++) {
                                utils.removeClass(list[i], 'over')
                            }
                            utils.addClass(list[this.index],'over');
                        }
                        break;
                    case 38:
                        this.index -= 1;
                        if(this.index < 0)
                            this.index = list.length - 1;
                        if(list){
                            for(var i = 0; i < list.length; i++) {
                                utils.removeClass(list[i],'over')
                            }
                            utils.addClass(list[this.index],'over');
                        }
                        break;
                    case 13:
                        var cur = list[this.index];
                        if (!cur) {
                            self.onEnter && self.onEnter.call(self);
                            return;
                        }

                        var item = {
                            key   : cur.textContent,
                            value : utils.getData(cur, 'value')
                        }
                        self.onSelected && self.onSelected.call(self, item);
                        self.fillVal && (self.inp.value = cur.textContent);
                        self.hide();
                        break;
                    case 8:
                        break;
                }
        }
    }

    show() {
        if (!this.visible) {
            this.selectList.style.display = "block";
            this.visible = true;
        }
    }

    hide() {
        if (this.visible) {
            this.selectList.style.display = "none";
            this.visible = false;
        }
    }
};

function autocomplete(opts) {
    return new AutoComplete(opts);
}

export default autocomplete;
