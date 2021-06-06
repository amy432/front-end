export class ExecutionContext {
    constructor(realm,lexicalEnvironment,variableEnvironment) {
        variableEnvironment = variableEnvironment || lexicalEnvironment;
        this.lexicalEnvironment = lexicalEnvironment;
        this.variableEnvironment = variableEnvironment;
        this.realm = realm
    }   
}

export class EnvironmentRecord {
    constructor(outer) {
        // this.thisValue,
        this.variables = new Map();
        this.outer = outer;
    }
    add(name) {
        this.variables.add(name,new JSUndefined);
    }

    get(name) {
        if(this.variables.has(name)) {
           return this.variables.get(name);
        } else if(this.outer) {
           return this.outer.get(name);
        } else {
            return JSUndefined;
        }
    }

    set(name,value = new JSUndefined) {
        if(this.variables.has(name)) {
            return this.variables.set(name,value);
         } else if(this.outer) {
            return this.outer.set(name,value);
         } else {
            return this.variables.set(name,value);
         }
    }
}

export class ObjectEnvironmentRecord {
    constructor(object,outer) {              
        this.object = object;
        this.outer = outer;
    }
    add(name) {
        this.object.set(name,new JSUndefined);
    }

    get(name) {
       return this.object.get(name);
       // TODO:
    }

    set(name,value = new JSUndefined) {
        this.object.set(name,value);
    }
}

export class CompletionRecord {
    constructor(type,value,target) {
        this.type = type || "normal";
        this.value = value || new JSUndefined();
        this.target = target || null;
    }
}

export class Reference {
    constructor(object,property) {
        this.object = object;
        this.property = property;
    }
    set(value) {
       this.object.set(this.property,value);
    }
    get() {
        return this.object.get(this.property);
    }
}

export class Realm {
    constructor() {
        this.global =new Map();
        this.Object = new Map();
        this.Object.call = function() {

        };
        this.Object_prototype = new Map();
    }
}

// 基类
export class JSValue {
   get  type() {
       if(this.cunstructor === "JSNumber") {
           return "number";
       }
       if(this.cunstructor === "JSString") {
        return "string";
       }
       if(this.cunstructor === "JSBoolean") {
           return "boolean";
       }
       if(this.cunstructor === "JSObject") {
           return "object";
       }
       if(this.cunstructor === "JSNull") {
           return "null";
       }
       if(this.cunstructor === "JSSymbol") {
           return "symbol";
       }
       return "undefined";
   }
}

export class JSNumber extends JSValue {
    constructor(value) {
        this.memory = new ArrayBuffer(8);
        if(arguments.length)
            new Float64Array(this.memory)[0] = value;
        else
            new Float64Array(this.memory)[0] = 0;
    }

    get value() {
        return new Float64Array(this.memory)[0];
    }

    toString() {

    }

    toNumber() {
       return this;
    }

    toBoolean() {
         if(new Float64Array(this.memory)[0]  === 0) {
             return new JSBoolean(false);
         } else {
            return new JSBoolean(true);
         }
          
    }
}

export class JSString extends JSValue {
    constructor(characters) {      
        // this.memory = new ArrayBuffer(characters.length * 2);
        this.characters = characters;
    }

    toString() {
       return this;
    }

    toNumber() {
        
     }
 
     toBoolean() {
          if(new Float64Array(this.memory)[0]  === 0) {
              return new JSBoolean(false);
          } else {
             return new JSBoolean(true);
          }
           
     }
}

export class JSBoolean extends JSValue {
    constructor(value) {
        this.value = value || false;
    }

    toString() {
        if(this.value)
            return new JSString(["t","r","u","e"]);
        
        return new JSString(["f","a","l","s","e"]);
     }
 
     toNumber() {
         if(this.value)
            return new JSNumber(1);
        
        return new JSNumber(0);
      }
  
      toBoolean() {
          return this;            
      }
}

export class JSObject extends JSValue {
    constructor(proto) {
        super();
        this.properties = new Map();
        this.prototype = proto || null;
    }

    set(name,value) {
        this.setProperty(name,{
            value:value,
            enumerable:true,
            configurable:true,
            writeable:true
        });
    }

    get(name) {
        return this.getProperty(name).value;
    }

    setProperty(name,attributes) {
       this.properties.set(name,attributes);
    }

    getProperty(name) {
        return this.properties.get(name);
    }

    setPrototype(proto) {
          this.prototype = proto;
    }

    getPrototype() {
       return this.prototype;
    }
}

export class JSNull extends JSValue {
    toString() {       
        return new JSString(["n","u","l","l"]);
     }
 
     toNumber() {         
        return new JSNumber(0);
      }
  
      toBoolean() {
          return new JSBoolean(false);            
      }
}

export class JSUndefined extends JSValue {
    toString() {       
        return new JSString(["u","d","f","i","n","e","d"]);
     }
 
     toNumber() {         
        return new JSNumber(NaN);
      }
  
      toBoolean() {
          return new JSBoolean(false);            
      }
}

export class JSSymbol extends JSValue {
    
}

