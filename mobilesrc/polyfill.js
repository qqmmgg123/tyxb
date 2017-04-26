(function (arr) {
    arr.forEach(function (item) {
        item.replaceWith = item.replaceWith || function () {
            var argArr = Array.prototype.slice.call(arguments);
            var docFrag = document.createDocumentFragment();
            
            argArr.forEach(function (argItem) {
                var isNode = Boolean(typeof(argItem) === 'object' && argItem !== null && argItem.nodeType > 0);
                docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
            });
            
            this.parentNode.replaceChild(docFrag, this);
        };
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

(function (arr) {
    arr.forEach(function (item) {
        item.forEach = item.forEach || Array.prototype.forEach;
    });
})([NodeList.prototype, HTMLCollection.prototype]);
