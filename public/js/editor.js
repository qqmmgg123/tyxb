define(function () {
    // 富文本编辑器
    var RichEditor = function(conf){
        this.ua = navigator.userAgent;
        this.ctype = "richeditor";
        this.con = document.getElementById(conf.containerid);
        this.isIE = /MSIE ([^;]+)/.test(this.ua);
    }
    
    RichEditor.prototype = {
        getElByClassName: function(node, name){
            var els = [];
            if (document.querySelectorAll) {
                els = document.querySelectorAll('.' + name);
            } else if (document.getElementsByClassName){
                els = node.getElementsByClassName(name);
            }else{
                var tags = node.getElementsByTagName('*');
                for(var i=0;i<tags.length;i++){
                    if(tags[i].nodeType === 1){
                        if(tags[i].className === name) els.push(tags[i]);
                    }
                }
            }
            if(els.length === 1){
                return els[0];
            }else{
                return els;
            }
        },
        getDocHeight: function(doc) {
            doc = doc || document;
            var body = doc.body, html = doc.documentElement;
            var height = Math.max( body.scrollHeight, body.offsetHeight, 
                html.clientHeight, html.scrollHeight, html.offsetHeight );
            return height;
        },
        setIframeHeight: function(id, height) {
            var ifrm = document.getElementById(id);
            var doc = ifrm.contentDocument? ifrm.contentDocument: 
                ifrm.contentWindow.document;
            ifrm.style.height = "10px";
            if(height === 'auto'){var autoh = Math.max(this.getDocHeight( doc ),150);ifrm.style.height = autoh + 4 + "px";}
            else ifrm.style.height = height + 4 + "px";
        },
        chekCommand: function(command){
            return this.doc.queryCommandState(command);
        },
        render: function(){
            var self = this;
            if(typeof(this.con.contentEditable) != 'undefined') {
                this.innerHTML = this.con.innerHTML = '<div id="richeditor" contentEditable="true" spellcheck="false"></div>';
                this.doc = document;
                document.execCommand('styleWithCSS', false, true);
            } else {
                this.innerHTML = this.con.innerHTML = '<iframe style="z-index:-1;" id="richeditor" frameborder="0" contentEditable="true" width="100%" height="100%" scrolling="no" name="richeditor"></iframe>';
            var ifrm = document.getElementById("richeditor");
            ifrm.onload = function(){
                self.setIframeHeight(this.id, 150)
            }
            this.win = ifrm.contentWindow;
            this.doc = this.win.document;
    
            this.doc.designMode = "on";
            var newDoc = this.doc.open('text/html','replace');
            var tex = "<html><head><style>body{word-break:break-all;word-wrap:word-break;font:12px/1.8 '微软雅黑', '宋体', Arial, Helvetica, sans-serif;}</style></head><body>";
            if(self.isIE) tex += "<p></p>";
            else tex += "<p><br></p>";
            tex += "</body></html>";
            newDoc.write(tex);
            newDoc.close();
            }
            document.getElementById('justifyleft').style.backgroundColor = "red";
            document.getElementById('justifyleft').style.color = "white";
            document.getElementById('justifyleft').active = true;
            //this.win.focus();
        },
        controller: function(){
            var self = this;
            (function(eventList){
                var elList = ['bold','italic','underLine'];
                var queryState = function(){
                    for(var e in elList){
                        var el = document.getElementById(elList[e]);
                        el.style.backgroundColor = self.chekCommand(elList[e])? "red":"white";
                        el.style.color = self.chekCommand(elList[e])? "white":"#333";
                    }
                }
                for(var i in eventList){
                    if(!self.isIE){
                        self.doc.addEventListener(eventList[i],queryState,false)
                    }else{
                        self.doc.attachEvent('on' + eventList[i],queryState)
                    }
                }
            })(['mouseup','keyup']);
    
            var command = self.getElByClassName(document.getElementById('docBorwser'), 'command');
            command.onclick = function(e){
                //self.win.focus();
                e = e || window.event;
                var src = e.target || e.srcElement,el=src.parentNode,id = el.id;
                switch(id){
                    case 'bold':
                    case 'italic':
                    case 'underLine':
                    case 'insertOrderedList':
                    case 'insertUnorderedList':
                        el.style.backgroundColor = self.chekCommand(el.id)? "white":"red";
                    case 'justifyleft':
                    case 'justifycenter':
                    case 'justifyright':
                        switch(id){
                            case 'justifyleft':
                            case 'justifycenter':
                            case 'justifyright':
                                var alignList = ['justifyleft','justifycenter','justifyright'];
                                if(!el.active){
                                    for(var i in alignList){
                                        document.getElementById(alignList[i]).style.backgroundColor = "white";
                                        document.getElementById(alignList[i]).style.color = "#333";
                                        document.getElementById(alignList[i]).active = false;
                                    }
                                    el.style.backgroundColor = "red"; 
                                    el.active = true;
                                }
                                break;
                        }
                        if(self.isIE) self.doc.selection.createRange().execCommand(id);
                        else self.doc.execCommand(id, false, null);
                        break;
                    case 'insertImg':
                        if(self.isIE){
                            document.getElementById(id).setAttribute('insertimg',Math.random());
                        }else{
                            var event = document.createEvent("Event");
                            event.initEvent("insertimg", false, false);
                            document.getElementById(id).dispatchEvent(event);
                        }
                        break;
                }
            }
        },
        getContent: function(){
            return this.doc.body.innerHTML;
        },
        insertImg: function(data){
            var self = this,url=data.url;
            this.win.focus();
            if(self.isIE) self.doc.selection.createRange().execCommand('insertimage',false,url);
            else self.doc.execCommand('insertimage', false, url);
            self.photoUp.blurClick()
        }
    }

    return RichEditor;
});
