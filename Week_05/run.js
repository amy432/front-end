import {Evaluator} from "evaluator.js"
import {Parser} from "SyntaxParser.js"

document.getElementById("run").addEventListener('click',event => {
    let obj = document.getElementById("source");
    let r = new Evaluator().evaluator(parse(obj.value));
    console.log(r);
});