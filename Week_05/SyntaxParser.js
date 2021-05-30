import {scan} from './LexParser.js';

let syntax = {
    Program:["Statement","EOF"],
    StatementList:[
        ["Statement"],
        ["StatementList","Statement"]
    ],
    Statement: [
        ["ExpressionStatement"],
        ["IfStatement"],
        ["VariableDeclaration"],
        ["FunctionDeclaration"]
    ],
    IfStatement:[
        ["if","(","Expression",")","Statement"]        
    ],
    VariableDeclaration:[
        ["var","Identifier",";"],
        ["let","Identifier",";"]
    ],
    FunctionDeclaration:[
        ["function","Identifier","(",")","{","StatementList","}"]
    ],
    ExpressionStatement:[
       ["Expression",";"]
    ],
    Expression:[
        ["AssignmentExpression"]
    ],
    AssignmentExpression:[
        ["LeftHandSideExpression","=","LogicalORExpression"],
        ["LogicalORExpression"]
    ],
    LogicalORExpression:[
        ["LogicalANDExpression"],
        ["LogicalORExpression","||","AdditiveExpression"]
    ],
    LogicalANDExpression:[
        ["AdditiveExpression"],
        ["LogicalANDExpression","&&","AdditiveExpression"]
    ],
    AdditiveExpression:[
        ["MultiplicativeExpression"],
        ["AdditiveExpression","+","MultiplicativeExpression"],
        ["AdditiveExpression","-","MultiplicativeExpression"]
    ],
    MultiplicativeExpression:[
        ["LeftHandSideExpression"],
        ["MultiplicativeExpression","*","LeftHandSideExpression"],
        ["MultiplicativeExpression","/","LeftHandSideExpression"]
    ],    
    LeftHandSideExpression:[
        ["CallExpression"],
        ["NewExpression"]
    ],
    CallExpression:[
        ["MemberExpression","Arguments"],
        ["CallExpression","Arguments"],
    ],
    NewExpression:[
        ["MemberExpression"],
        ["new","NewExpression"]
    ],
    MemberExpression:[
        ["PrimaryExpression"],
        ["PrimaryExpression",".","Identifer"],
        ["PrimaryExpression","[","Expression","]"]
    ],
    PrimaryExpression:[
        ["(","Expression",")"],
        ["Literal"],
        ["Identifier"]
    ],
    Literal:[
        ["NumericLiteral"],
        ["StringLiteral"],
        ["BooleanLiteral"],
        ["NullLiteral"],
        ["RegularExpressionLiteral"],
        ["ObjectLiteral"],
        ["ArrayLiteral"]
    ],
    ObjectLiteral:[
        ["{","}"],
        ["{","PropertyList","}"]
    ],
    PropertyList:[
        ["Property"],
        ["PropertyList",",","Property"]
    ],
    Property:[
        ["StringLiteral",":","AdditiveExpression"],
        ["Identifier",":","AdditiveExpression"]
    ]
}

let hash = {

}

function closure(state) {
   hash[JSON.stringify(state)] = state;
   let queue = [];
   for(let symbol in state) {
       if(symbol.match(/^\$/)) {
           continue;
       }
       queue.push(symbol);
   }

   while(queue.length) {
       let symbol = queue.shift();
       // console.log("symbol",symbol);

       if(syntax[symbol]) {
           for(let rule of syntax[symbol]){
               if(!state[rule[0]])
                  queue.push(rule[0]); 
                
                let current = state;
                for(let part of rule) {
                    if(!current[part])
                       current[part] = {}
                    current = current[part];
                }
                current.$reductType = symbol;     
                current.$reduceLength = rule.length;
          }
       }
   }
   for(let symbol in state) {
       if(symbol.match(/^\$/)) {
           continue;
       }
       if(hash[JSON.stringify(state[symbol])])
           state[symbol] = hash[JSON.stringify(state[symbol])]
       else
           closure(state[symbol]);
   }
}

let end = {
    $isEnd :true
}

let start = {
    "Program": end
}

closure(start);


function parse(source) {    
    let stack = [start];
    let symbolStack = [];
    
    function reduce() {
        let state = stack[stack.length - 1];

        if(state.$reduceType) {
            let children = [];
            for(let i=0 ; i<state.$reduceLength;i++) {
                stack.pop();
                children.push(symbolStack.pop());
            }
           // state = state.$reduceLength;
            // create a non-terminal symbol and shift it

            return {
                type:state.$reduceType,
                children:children.reverse()
            };
        } else {
           // debugger;
            throw new Error("unexpected token");
        }
    }

    function shift(symbol){
        let state = stack[stack.length - 1];

        if(symbol.type in state) {
            // console.log('state', state);

            stack.push(state[symbol.type]);   
            symbolStack.push(symbol);
        } else {
            /* reduce to non-terminal symbols */
            shift(reduce());
            shift(symbol);
        }
    }

    for (let symbol /*terminal symbol*/ of scan(source)) {
        shift(symbol);
        // console.log('symbol', symbol);
    }

    return reduce();
}

