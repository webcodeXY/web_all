
class Xvue extends EventTarget{
    constructor(options) {
        super();
        this.$options = options;
        this.compile();
        this.observe(this.$options.data);
    }

    observe(data){
        let keys = Object.keys(data);
        keys.forEach(key=>{
            this.defineReact(data,key,data[key]);
        })
    }

    defineReact(data,key,value){
        let _this = this;

        Object.defineProperty(data,key,{
            configurable:true,
            enumerable:true,
            get() {
                console.log("getValue")
                return value;
            },
            set(newValue) {
                console.log("setValue...",newValue);
                let event = new CustomEvent(key,{
                    detail:newValue
                });
                _this.dispatchEvent(event)
                value = newValue;
            }
        })
    }

    compile(){
        let el = document.querySelector(this.$options.el);
        this.compileNodes(el);
    }
    compileNodes(el){
        let childNodes = el.childNodes;
        console.log(childNodes)
        childNodes.forEach(node=>{
            if(node.nodeType === 1){
                let attr = node.attributes;
                [...attr].forEach(attr=>{
                    console.log(attr);
                    let attrName = attr.name;
                    let attrValue = attr.value;
                    if(attrName.indexOf("v-") === 0){
                        attrName = attrName.substr(2);
                        node.value = this.$options.data[attrValue];
                        node.addEventListener("input",evt => {
                            this.$options.data[attrValue] = evt.target.value;
                        })
                    }
                })

                if(node.childNodes.length > 0){
                    this.compileNodes(node);
                }
            } else if(node.nodeType === 3){
                let content = node.textContent;
                let reg = /\{\{\s*(\S*)\s*\}\}/;
                if(reg.test(content)){
                    let $1 = RegExp.$1;
                    node.textContent = node.textContent.replace(reg,this.$options.data[$1]);
                    this.addEventListener($1,evt => {
                        console.log(evt.detail);
                        console.log(this.$options.data[$1]);
                        let oldValue = this.$options.data[$1];
                        let reg = new RegExp(oldValue);
                        node.textContent = node.textContent.replace(reg,evt.detail);
                        //node.textContent = node.textContent.replace(reg,this.$options.data[$1]);
                    });
                }
            }
        })

    }

}
