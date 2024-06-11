lexer grammar lexerRules;
ID: [a-zA-Z_]+;
INT: ('-'|'+')?[0-9]+;
DOUBLE: [0-9]+'.'[0-9]*;
STRING: '"' ('\\"' | '\\\\' | .)*? '"' | '\'' ('\\"' | '\\\\' | .)*? '\'';
TAU: '\\tau';
AND: '\\and' | '\\AND' | '&&';
OR: '\\or' | '\\OR' | '||';
NOT: '\\not' | '\\NOT' | '!';
EXISTS: '\\exists' | '\\EXISTS';
IN: '\\in' | '\\IN';
EQ: '\\eq' | '\\EQ' | '=';
NEQ: '\\neq' | '\\NEQ' | '!=';
GEQ: '\\geq' | '\\GEQ' | '>=';
LEQ: '\\leq' | '\\LEQ' | '<=';
GT: '>' | '\\gt' | '\\GT';
LT: '<' | '\\lt' | '\\LT';

WS: [ \t\n\r]+ -> skip;
