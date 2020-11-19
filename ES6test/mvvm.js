
class Xvue {
    constructor(options) {
        this.$options = options;
        this.compile();
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
                if(node.childNodes.length > 0){
                    this.compileNodes(node);
                }
            } else if(node.nodeType === 3){
                let content = node.textContent;
                let reg = /\{\{\s*(\S*)\s*\}\}/;
                if(reg.test(content)){
                    let $1 = RegExp.$1;
                    node.textContent = node.textContent.replace(reg,this.$options.data[$1])
                }
            }
        })

    }

}
