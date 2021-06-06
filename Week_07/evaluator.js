import {
   ExecutionContext,
   Reference,
   Realm,
   JSObject,
   JSNumber,
   JSBoolean,
   JSString,
   JSNull,
   JSUndefined,
   JSSymbol,
   CompletionRecord,
   EnvironmentRecord,
   ObjectEnvironmentRecord
} from "./runtime.js";


export class Evaluator {
    constructor() {
        this.realm = new Realm();
        this.globalObject = new JSObject;
        this.globalObject.set("log",new JSObject);
        this.globalObject.get("log").call = args=> {
           console.log('args',args);
        };

        this.esc = [new ExecutionContext(this.realm,
                   new ObjectEnvironmentRecord(this.globalObject),
                   new ObjectEnvironmentRecord(this.globalObject))];        
    }

    evaluateModule(node) {
        let globaleEC = this.ecs[0];
        let newEC = new ExecutionContext(
            this.realm,
            new EnvironmentRecord(globaleEC.lexicalEnvironment),
            new EnvironmentRecord(globaleEC.lexicalEnvironment)
        );
        this.ecs.push(newEC);
        let result = this.evaluate(node);
        this.ecs.pop();
        return result;
    }

    evaluate(node){
        if(this[node.type]) {
            return this[node.type](node);
        }
     }

     Program(node) {
        return this.evaluate(node.children[0]);
     }

     IfStatement(node) {        
            let condition = this.evaluate(node.children[2]);
            if(condition instanceof Reference)
                condition = condition.get();
            if(condition.toBoolean().value) {
                return this.evaluate(node.children[4]);
            }             
     }

     WhileStatement(node) {
         while(true)
         {
            let condition = this.evaluate(node.children[2]);
            if(condition instanceof Reference)
                condition = condition.get();
            if(condition) {                
                let record =  this.evaluate(node.children[4]);
                if(record.type === "continue")
                   continue;
                if(record.type === "break")
                   return new CompletionRecord("normal");
            } else {
                break;
            }
        }
    }

    BreakStatement(node) {
        return new CompletionRecord("break");
    }

    ContinueStatement(node) {
        return new CompletionRecord("continue");
    }

     StatementList(node){
        if(node.children.length === 1) {
          return this.evaluate(node.children[0]);
        } else {
          let record = this.evaluate(node.children[0]);
          if(record.type === "normal") 
                return this.evaluate(node.children[1]);
          else
               return record;
        }
     }

     Statement(node){
        return this.evaluate(node.children[0]);
     }

     VariableDeclaration(node) {
         let runningEC = this.esc[this.esc.length - 1];
         runningEC.variableEnvironment.set(node.children[1].name,new JSUndefined);
         return new CompletionRecord("normal",new JSUndefined);
     }

     ExpressionStatement(node){
        let result = this.evaluate(node.children[0]);
        if(result instanceof Reference)
            result = result.get();

        return new CompletionRecord("normal",result);
     }

     Expression(node){
      return this.evaluate(node.children[0]);
     }

     AdditiveExpression(node){
         if(ode.children.length == 1)
            return this.evaluate(node.children[0]);
         else {
             let left = this.evaluate(node.children[0]);
             let right = this.evaluate(node.children[2]);
             
             if(left instanceof Reference) 
               left = left.get();

             if(right instanceof Reference)
               right = right.get();

             if(node.children[1].type === "+") {
                return left + right;
             }

             if(node.children[1].type === "-") {
                return new JSNumber(left.value - right.value);
             }
         }
     }

     MultiplicativeExpression(node){
      if(ode.children.length == 1)
         return this.evaluate(node.children[0]);
      else {
          // TODo
      }
     }

     PrimaryExpression(node) {
      if(ode.children.length == 1)
         return this.evaluate(node.children[0]);
     }

     Literal(node){
        return this.evaluate(node.children[0]);
     }

     NumericLiteral(node){
         let str = node.value;
         let l = str.length;
         let value = 0;
         let n=10;
  
         if(str.match(/^0b/)) {
             n = 2;
             l -=2;
         }else if(str.match(/^0o/)) {
             n = 8;
             l -= 2;
         } else if(str.match(/^0x/)) {
             n = 16;
             l -=2;
         }
  
         while(l--) {
             let c = str.charCodeAt(str.length - l - 1);
             if(c >= 'a'.charCodeAt(0)) {
                 c = c - 'a'.charCodeAt(0) + 10;
             } else if(c >= 'A'.charCodeAt(0))  {
                 c = c - 'A'.charCodeAt(0) + 10;
              } else if(c >= '0'.charCodeAt(0))  {
                  c = c - '0'.charCodeAt(0);
              }
  
             value = value * n + c;
         }
  
        //  console.log('value',value);
  
         return new JSNumber(node.value);     
     }

     StringLiteral(node){
          console.log('StringLiteral value:',node.value);
          let i=1;
          let result = [];
  
          for (let i = 1; i < node.value.length;i++){
              if(node.value[i] === '\\') {
                  ++i;
                  let c = node.value[i];
                  let map = {
                      "\"":"\"",
                      "\'":"\'",
                      "\\":"\\",
                      "0":String.fromCharCode(0x0000),
                      "b":String.fromCharCode(0x0008),
                      "f":String.fromCharCode(0x000C),
                      "n":String.fromCharCode(0x000A),
                      "r":String.fromCharCode(0x000D),
                      "t":String.fromCharCode(0x0009),
                      "v":String.fromCharCode(0x000B)
                  }
  
                  if(c in map) {
                      result.push(map[c]);
                  } else {
                      result.push(c);
                  }
              } else {
                  result.push(node.value[i]);
              }
          }
          return new JSString(result);
     }

     ObjectLiteral(node) {
        if(node.children.length === 2) {
            return {};
        }
  
        if(node.children.length === 3) {
            let object = new Map();
            this.PropertyList(node.children[1]);
            // object.prototype = 
            return object;
        }
     }

     PropertyList(node,object) {
          if(node.children.length === 1) {
              Property(node,object);
          } else {
              PropertyList(node.children[0],object);
              Property(node.children[2],object);
          }
     }

     Property(node,object) {
         let name;
         if(node.children[0],type === "Identifier") {
             name = node.children[0].name;
         } else if(node.children[0],type === "StringLiteral") {
             name = this.evaluate(node.children[0]);
         }
         object.set(name,{
            value:this.evaluate(node.children[2]),
            writable:true,
            enumerable:true,
            configable:true
         });
     }

     BooleanLiteral(node) {
         if(node.value === "false")
            return new JSBoolean(false)
        else
            return new JSBoolean(true);
     }
    
    null() {
        return new JSNull();
    }    

     AssignmentExpression(node){
         if(node.children.length === 1) {
             return this.evaluate(node.children[0]);
         }
  
         let left = this.evaluate(node.children[0]);
         let right = this.evaluate(node.children[2]);
  
         left.set(right);
     }

     LogicalORExpression(node){
        if(node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        let result = this.evaluate(node.children[0]);;
        if(result) {
            return result;
        } else {
            return this.evaluate(node.children[2]);
        }
     }

     LogicalANDExpression(node){
        if(node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        let result = this.evaluate(node.children[0]);;
        if(!result) {
            return result;
        } else {
            return this.evaluate(node.children[2]);
        }
     }

     LeftHandSideExpression(node) {
        return this.evaluate(node.children[0]);
     }

     NewExpression(node) {
        if(node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }

        if(node.children.length === 2) {
            let object = this.realm.Object.construct();
            let cls = this.evaluate(node.children[1]);
            let result = cls.call(object);
            if(typeof result === "object") {
               return result;
            } else {
                return object;
            }
        }      
     }

     CallExpression(node) {
        if(node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }

        if(node.children.length === 2) {
            let func = this.evaluate(node.children[0]);
            let args = this.evaluate(node.children[1]);
            if(func instanceof Reference) 
               func = func.get();
            return func.call(args);
        }
     }

     MemberExpression(node) {
        if(node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        if(node.children.length === 3) {
            let obj = this.evaluate(node.children[0]);
            let prop = obj.get(node.children[2].name);
            if("value" in prop)
                return prop.value;
            if("get" in prop) 
                return prop.get.call(obj);
        }
     }

     Identifer(node) {
         let runningEC = this.ecs[this.ecs.length - 1];
         return new Reference(
             runningEC.lexicalEnvironment,
             node.name
         );
     }

     Arguments(node) {
         if(node.children.length === 2) 
             return [];
         else 
             return this.evaluate(node.children[1]);
     }

     ArgumentList(node) {
         if(node.children.length === 1) {
             let result = this.evaluate(node.children[0]);
             if(result instanceof Reference)
                 result = result.get();
             return [result];
         } else {
            let result = this.evaluate(node.children[1]);
            if(result instanceof Reference)
                result = result.get();
            return this.evaluate(this.children[0]).concat(result);
         }
     }

     Block(node) {
         if(node.children.length === 2) {
             // 空
             return;
         }

         let runingEC = this.esc[this.esc.length - 1];
         let newEC = new ExecutionContext(
               runingEC,
               this.realm,
               new EnvironmentRecord(runingECl.lexicalEnvironment),
               runingEC.variableEnvironment
               );
        this.esc.push(newEC);
         let result = this.evaluate(node.children[1]);
        this.esc.pop(newEC);
         return result;
     }

     FunctionDeclaration(node) {
         let name = node.children[1].name;
         let code = node.children[node.children.length - 2];
         let func = new JSObject;
         func.call = args => {              
              let newEC = new ExecutionContext(
                  this.realm,
                  new EnvironmentRecord(func.environment),
                  new EnvironmentRecord(func.environment)
              );
              this.ecs.push(newEC);              
              this.evaluate(code);
              this.ecs.pop();
         };
         let runningEC = this.esc[this.esc.length - 1];
         runningEC.lexicalEnvironment.add(name);
         runningEC.lexicalEnvironment.set(name,func);
         return new CompletionRecord("normal");
     }
}
