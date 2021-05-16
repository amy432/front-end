# JS 语法通识

## 产生式

- 符号(Symbol)
  - 定义的语法结构名称
- 终结符（Terminal Symbo）与非终结符（Non-Terminal Symbol）
  - 终结符：不是由其他符号定义的符号，也就是说，它不会出现在产生式的左边
  - 非终结符：由其他符号经过“与”、“或”等逻辑组成的符号
- 语言定义
  - 语言可以由一个非终结符和它的产生式来定义
- 语法树
  - 把一段具体的语言的文本，根据产生式已树形结构阿里表示出来

#### 产生式的写法

- BNF：巴科斯-诺尔范式

  - 非终结符用解括号包裹
  - ::= 表示定义
  - 竖线表示或

  <中文>::=<句子> | <中文><句子> <句子>::=<主语><谓语><宾语> | <主语><谓语> <主语>::=<代词>|<名词>|<名词性短语> <代词>::="你"|"我"|"他"

- EBNF

  - 不强制加尖括号
  - 大括号表示可以重复多次
  - 方括号表示可以省略

  中文::= {句子} 句子::= 主语 谓语 [宾语] 主语::= 代词 | 名词 | 名词性短语 代词::="你"|"我"|"他"

##### 产生式的其他写法

- JavaScript 标准

**Syntax** BlockStatement[Yield, Await, Return] : Block[?Yield, ?Await, ?Return]

```
Block[Yield, Await, Return] :
     {StatementList[?Yield, ?Await, ?Return] opt}

StatementList[Yield, Await, Return] :
     StatementListItem[?Yield, ?Await, ?Return]
     StatementList[?Yield, ?Await, ?Return]   StatementListItem[?Yield, ?Await, ?Return]

StatementListItem[?Yield, ?Await, ?Return] :
     Statement[?Yield, ?Await, ?Return]
     Declaration[?Yield, ?Await]
```

## 词法和语法

- 词法：正则文法（3型）
  - 空白
  - 换行
  - 注释
  - Token
- 语法：上下文无关文法（2型）
  - 语法树