grammar predicate;
import lexerRules;

rvalue:
    op=(INT | DOUBLE | STRING)
    ;

exp:
    NOT exp           # notExp
    | exp AND exp     # andExp
    | exp OR exp      # orExp
    | statExp op=(GT|LT|EQ|LEQ|GEQ|NEQ) rvalue  # binaryExp
    | rvalue op=IN statExp # InExp
    ;

statExp:
    func=ID '(' attr ')'                  # singleVarStatExp
    | func=ID '(' samplingExp ',' attr ')'     # regressionStatExp
    ;

samplingExp:
    func=ID '(' attr (',' argsList)? (',' condition)? ')'
    ;

condition:
    ID op=(GT|LT|EQ|LEQ|GEQ|NEQ) rvalue # singleCondition
    | NOT condition                     # notCondition
    | condition AND condition           # andCondition
    | condition OR condition            # orCondition
    ;

argsList:
    '('attr (',' attr)* ')'
    ;

attr:
    ID '.' ID
    ;

// destructuring:
