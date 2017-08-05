const MOOD = {
    label: '心情',
    rel: 'tab-mood-post', 
    name: 'mood', 
    active: false
}

const HEALTH = {
    label: '身体状况',
    rel: 'tab-health-post', 
    name: 'health', 
    active: false
}

export const NAME_MAP = {
    "title": "content",
    "link" : "link",
    "image": "image",
    "text" : "text",
    "mood" : "mood",
    "health" : "health"
}

export default class PostConst {
    static get BTNS() {
        return {
            "image": [MOOD, HEALTH],
            "news": [{ 
                label: '摘要', 
                rel: 'tab-text-post', 
                name: 'text', 
                active: false
            }, { 
                label: '配图',
                rel: 'tab-image-post', 
                name: 'image', 
                active: false 
            }, MOOD, HEALTH], 
            "text": [{ 
                label: '标题', 
                rel: 'tab-title-post', 
                name: 'title', 
                active: false 
            }, { 
                label: '配图',
                rel: 'tab-image-post', 
                name: 'image', 
                active: false 
            }, MOOD, HEALTH]
        }
    }

    static get FIELDS() {
        return {
            "text": [{
                name: "text",
                type: "text",
                com: "textField",
                val: '',
                focus: true
            }],
            "image": [{
                name: "image",
                type: "image",
                com: "imageField",
                val: '',
                data: {
                    url: ''
                },
                focus: false
            }, {
                name: "content",
                type: "title",
                com: "titleField",
                val: '',
                focus: true
            }],
            "news": [{
                name: "link",
                type: "link",
                com: "linkField",
                val: '',
                focus: true
            }, {
                name: "content",
                type: "title",
                com: "titleField",
                val: '',
                focus: false
            }]
        }
    }
}

