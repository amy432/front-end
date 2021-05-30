InputElement ::= WhiteSpace | LineTerminator | Comment | Token

WhiteSpace ::= " " | " "

LineTerminator ::= "\n" | "\r"

Comment ::= SingleLineComment | MultilineComment
SingleLineComment ::= "/" "/" <any>*
MultilineComment ::= "/" "*" ([^*] | "*" [^/])* "*" "/"

Token ::= Literal | Keywords | Identifier | Punctuator
Literal ::= NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral
Keywords ::= "if" | "else" | "for" | "function" | ......
Punctuator ::= "+" | "-" | "*" | "/" | "{" | "}" | ......

Program ::= Statement+
Statement ::= ExpressionStatement | IfStatement 
     | ForStatement | WhileStatement
     | VariableDeclaration | FunctionDeclaration | ClassDeclaration
     | BreakStatement | ContinueStatement | ReturnStatement | ThrowStatement
     | TryStatement | Block

Block ::= "{" Statement "}"
TryStatement ::= "try" "{" Statement+ "} "catch" "(" Expression ")"   "{" Statement+ "}

ExpressionStatement ::= Expression ";"

Expression ::= AdditiveExpression

AdditiveExpression ::= MultiplicativeExpression 
     | AdditiveExpression ("+" | "-") MultiplicativeExpression

MultiplicativeExpression ::= UnaryExpression
     | MultiplicativeExpression ("*" | "/") UnaryExpression

UnaryExpression ::= PrimaryExpression
     | ("+" | "-" | "typeof") PrimaryExpression

PrimaryExpression ::= "(" Expression ")" 
     | Literal
     | Identifier

IfStatement ::= "if" "(" Expression ")"  Statement