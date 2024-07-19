// Generated from d:/DIS_platform/src/antlr4/predicate.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { predicateVisitor } from "./predicateVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class predicateParser extends antlr.Parser {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly ID = 5;
    public static readonly INT = 6;
    public static readonly DOUBLE = 7;
    public static readonly STRING = 8;
    public static readonly TAU = 9;
    public static readonly AND = 10;
    public static readonly OR = 11;
    public static readonly NOT = 12;
    public static readonly EXISTS = 13;
    public static readonly IN = 14;
    public static readonly EQ = 15;
    public static readonly NEQ = 16;
    public static readonly GEQ = 17;
    public static readonly LEQ = 18;
    public static readonly GT = 19;
    public static readonly LT = 20;
    public static readonly WS = 21;
    public static readonly RULE_rvalue = 0;
    public static readonly RULE_exp = 1;
    public static readonly RULE_statExp = 2;
    public static readonly RULE_samplingExp = 3;
    public static readonly RULE_condition = 4;
    public static readonly RULE_argsList = 5;
    public static readonly RULE_attr = 6;

    public static readonly literalNames = [
        null, "'('", "','", "')'", "'.'", null, null, null, null, "'\\tau'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, "ID", "INT", "DOUBLE", "STRING", "TAU", 
        "AND", "OR", "NOT", "EXISTS", "IN", "EQ", "NEQ", "GEQ", "LEQ", "GT", 
        "LT", "WS"
    ];
    public static readonly ruleNames = [
        "rvalue", "exp", "statExp", "samplingExp", "condition", "argsList", 
        "attr",
    ];

    public get grammarFileName(): string { return "predicate.g4"; }
    public get literalNames(): (string | null)[] { return predicateParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return predicateParser.symbolicNames; }
    public get ruleNames(): string[] { return predicateParser.ruleNames; }
    public get serializedATN(): number[] { return predicateParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, predicateParser._ATN, predicateParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public rvalue(): RvalueContext {
        let localContext = new RvalueContext(this.context, this.state);
        this.enterRule(localContext, 0, predicateParser.RULE_rvalue);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 14;
            localContext._op = this.tokenStream.LT(1);
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 448) !== 0))) {
                localContext._op = this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public exp(): ExpContext;
    public exp(_p: number): ExpContext;
    public exp(_p?: number): ExpContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExpContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 2;
        this.enterRecursionRule(localContext, 2, predicateParser.RULE_exp, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 27;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case predicateParser.NOT:
                {
                localContext = new NotExpContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 17;
                this.match(predicateParser.NOT);
                this.state = 18;
                this.exp(5);
                }
                break;
            case predicateParser.ID:
                {
                localContext = new BinaryExpContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 19;
                this.statExp();
                this.state = 20;
                (localContext as BinaryExpContext)._op = this.tokenStream.LT(1);
                _la = this.tokenStream.LA(1);
                if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 2064384) !== 0))) {
                    (localContext as BinaryExpContext)._op = this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 21;
                this.rvalue();
                }
                break;
            case predicateParser.INT:
            case predicateParser.DOUBLE:
            case predicateParser.STRING:
                {
                localContext = new InExpContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 23;
                this.rvalue();
                this.state = 24;
                (localContext as InExpContext)._op = this.match(predicateParser.IN);
                this.state = 25;
                this.statExp();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 37;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this._parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 35;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                    case 1:
                        {
                        localContext = new AndExpContext(new ExpContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, predicateParser.RULE_exp);
                        this.state = 29;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 30;
                        this.match(predicateParser.AND);
                        this.state = 31;
                        this.exp(5);
                        }
                        break;
                    case 2:
                        {
                        localContext = new OrExpContext(new ExpContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, predicateParser.RULE_exp);
                        this.state = 32;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 33;
                        this.match(predicateParser.OR);
                        this.state = 34;
                        this.exp(4);
                        }
                        break;
                    }
                    }
                }
                this.state = 39;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public statExp(): StatExpContext {
        let localContext = new StatExpContext(this.context, this.state);
        this.enterRule(localContext, 4, predicateParser.RULE_statExp);
        let _la: number;
        try {
            this.state = 56;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
            case 1:
                localContext = new SingleVarStatExpContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 40;
                (localContext as SingleVarStatExpContext)._func = this.match(predicateParser.ID);
                this.state = 41;
                this.match(predicateParser.T__0);
                this.state = 42;
                this.attr();
                this.state = 45;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 2) {
                    {
                    this.state = 43;
                    this.match(predicateParser.T__1);
                    this.state = 44;
                    (localContext as SingleVarStatExpContext)._num = this.tokenStream.LT(1);
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 6 || _la === 7)) {
                        (localContext as SingleVarStatExpContext)._num = this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                }

                this.state = 47;
                this.match(predicateParser.T__2);
                }
                break;
            case 2:
                localContext = new RegressionStatExpContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 49;
                (localContext as RegressionStatExpContext)._func = this.match(predicateParser.ID);
                this.state = 50;
                this.match(predicateParser.T__0);
                this.state = 51;
                this.samplingExp();
                this.state = 52;
                this.match(predicateParser.T__1);
                this.state = 53;
                this.attr();
                this.state = 54;
                this.match(predicateParser.T__2);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public samplingExp(): SamplingExpContext {
        let localContext = new SamplingExpContext(this.context, this.state);
        this.enterRule(localContext, 6, predicateParser.RULE_samplingExp);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 58;
            localContext._func = this.match(predicateParser.ID);
            this.state = 59;
            this.match(predicateParser.T__0);
            this.state = 60;
            this.attr();
            this.state = 63;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 5, this.context) ) {
            case 1:
                {
                this.state = 61;
                this.match(predicateParser.T__1);
                this.state = 62;
                this.argsList();
                }
                break;
            }
            this.state = 67;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 2) {
                {
                this.state = 65;
                this.match(predicateParser.T__1);
                this.state = 66;
                this.condition(0);
                }
            }

            this.state = 69;
            this.match(predicateParser.T__2);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public condition(): ConditionContext;
    public condition(_p: number): ConditionContext;
    public condition(_p?: number): ConditionContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ConditionContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 8;
        this.enterRecursionRule(localContext, 8, predicateParser.RULE_condition, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 77;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case predicateParser.ID:
                {
                localContext = new SingleConditionContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 72;
                this.match(predicateParser.ID);
                this.state = 73;
                (localContext as SingleConditionContext)._op = this.tokenStream.LT(1);
                _la = this.tokenStream.LA(1);
                if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 2064384) !== 0))) {
                    (localContext as SingleConditionContext)._op = this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                this.state = 74;
                this.rvalue();
                }
                break;
            case predicateParser.NOT:
                {
                localContext = new NotConditionContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 75;
                this.match(predicateParser.NOT);
                this.state = 76;
                this.condition(3);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 87;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 9, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this._parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 85;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 8, this.context) ) {
                    case 1:
                        {
                        localContext = new AndConditionContext(new ConditionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, predicateParser.RULE_condition);
                        this.state = 79;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 80;
                        this.match(predicateParser.AND);
                        this.state = 81;
                        this.condition(3);
                        }
                        break;
                    case 2:
                        {
                        localContext = new OrConditionContext(new ConditionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, predicateParser.RULE_condition);
                        this.state = 82;
                        if (!(this.precpred(this.context, 1))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 1)");
                        }
                        this.state = 83;
                        this.match(predicateParser.OR);
                        this.state = 84;
                        this.condition(2);
                        }
                        break;
                    }
                    }
                }
                this.state = 89;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 9, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public argsList(): ArgsListContext {
        let localContext = new ArgsListContext(this.context, this.state);
        this.enterRule(localContext, 10, predicateParser.RULE_argsList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 90;
            this.match(predicateParser.T__0);
            this.state = 91;
            this.attr();
            this.state = 96;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 2) {
                {
                {
                this.state = 92;
                this.match(predicateParser.T__1);
                this.state = 93;
                this.attr();
                }
                }
                this.state = 98;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 99;
            this.match(predicateParser.T__2);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public attr(): AttrContext {
        let localContext = new AttrContext(this.context, this.state);
        this.enterRule(localContext, 12, predicateParser.RULE_attr);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 101;
            this.match(predicateParser.ID);
            this.state = 102;
            this.match(predicateParser.T__3);
            this.state = 103;
            this.match(predicateParser.ID);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                localContext.exception = re;
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.RuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 1:
            return this.exp_sempred(localContext as ExpContext, predIndex);
        case 4:
            return this.condition_sempred(localContext as ConditionContext, predIndex);
        }
        return true;
    }
    private exp_sempred(localContext: ExpContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 4);
        case 1:
            return this.precpred(this.context, 3);
        }
        return true;
    }
    private condition_sempred(localContext: ConditionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 2:
            return this.precpred(this.context, 2);
        case 3:
            return this.precpred(this.context, 1);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,21,106,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,28,8,1,
        1,1,1,1,1,1,1,1,1,1,1,1,5,1,36,8,1,10,1,12,1,39,9,1,1,2,1,2,1,2,
        1,2,1,2,3,2,46,8,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,57,8,
        2,1,3,1,3,1,3,1,3,1,3,3,3,64,8,3,1,3,1,3,3,3,68,8,3,1,3,1,3,1,4,
        1,4,1,4,1,4,1,4,1,4,3,4,78,8,4,1,4,1,4,1,4,1,4,1,4,1,4,5,4,86,8,
        4,10,4,12,4,89,9,4,1,5,1,5,1,5,1,5,5,5,95,8,5,10,5,12,5,98,9,5,1,
        5,1,5,1,6,1,6,1,6,1,6,1,6,0,2,2,8,7,0,2,4,6,8,10,12,0,3,1,0,6,8,
        1,0,15,20,1,0,6,7,110,0,14,1,0,0,0,2,27,1,0,0,0,4,56,1,0,0,0,6,58,
        1,0,0,0,8,77,1,0,0,0,10,90,1,0,0,0,12,101,1,0,0,0,14,15,7,0,0,0,
        15,1,1,0,0,0,16,17,6,1,-1,0,17,18,5,12,0,0,18,28,3,2,1,5,19,20,3,
        4,2,0,20,21,7,1,0,0,21,22,3,0,0,0,22,28,1,0,0,0,23,24,3,0,0,0,24,
        25,5,14,0,0,25,26,3,4,2,0,26,28,1,0,0,0,27,16,1,0,0,0,27,19,1,0,
        0,0,27,23,1,0,0,0,28,37,1,0,0,0,29,30,10,4,0,0,30,31,5,10,0,0,31,
        36,3,2,1,5,32,33,10,3,0,0,33,34,5,11,0,0,34,36,3,2,1,4,35,29,1,0,
        0,0,35,32,1,0,0,0,36,39,1,0,0,0,37,35,1,0,0,0,37,38,1,0,0,0,38,3,
        1,0,0,0,39,37,1,0,0,0,40,41,5,5,0,0,41,42,5,1,0,0,42,45,3,12,6,0,
        43,44,5,2,0,0,44,46,7,2,0,0,45,43,1,0,0,0,45,46,1,0,0,0,46,47,1,
        0,0,0,47,48,5,3,0,0,48,57,1,0,0,0,49,50,5,5,0,0,50,51,5,1,0,0,51,
        52,3,6,3,0,52,53,5,2,0,0,53,54,3,12,6,0,54,55,5,3,0,0,55,57,1,0,
        0,0,56,40,1,0,0,0,56,49,1,0,0,0,57,5,1,0,0,0,58,59,5,5,0,0,59,60,
        5,1,0,0,60,63,3,12,6,0,61,62,5,2,0,0,62,64,3,10,5,0,63,61,1,0,0,
        0,63,64,1,0,0,0,64,67,1,0,0,0,65,66,5,2,0,0,66,68,3,8,4,0,67,65,
        1,0,0,0,67,68,1,0,0,0,68,69,1,0,0,0,69,70,5,3,0,0,70,7,1,0,0,0,71,
        72,6,4,-1,0,72,73,5,5,0,0,73,74,7,1,0,0,74,78,3,0,0,0,75,76,5,12,
        0,0,76,78,3,8,4,3,77,71,1,0,0,0,77,75,1,0,0,0,78,87,1,0,0,0,79,80,
        10,2,0,0,80,81,5,10,0,0,81,86,3,8,4,3,82,83,10,1,0,0,83,84,5,11,
        0,0,84,86,3,8,4,2,85,79,1,0,0,0,85,82,1,0,0,0,86,89,1,0,0,0,87,85,
        1,0,0,0,87,88,1,0,0,0,88,9,1,0,0,0,89,87,1,0,0,0,90,91,5,1,0,0,91,
        96,3,12,6,0,92,93,5,2,0,0,93,95,3,12,6,0,94,92,1,0,0,0,95,98,1,0,
        0,0,96,94,1,0,0,0,96,97,1,0,0,0,97,99,1,0,0,0,98,96,1,0,0,0,99,100,
        5,3,0,0,100,11,1,0,0,0,101,102,5,5,0,0,102,103,5,4,0,0,103,104,5,
        5,0,0,104,13,1,0,0,0,11,27,35,37,45,56,63,67,77,85,87,96
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!predicateParser.__ATN) {
            predicateParser.__ATN = new antlr.ATNDeserializer().deserialize(predicateParser._serializedATN);
        }

        return predicateParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(predicateParser.literalNames, predicateParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return predicateParser.vocabulary;
    }

    private static readonly decisionsToDFA = predicateParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class RvalueContext extends antlr.ParserRuleContext {
    public _op?: Token | null;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.INT, 0);
    }
    public DOUBLE(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.DOUBLE, 0);
    }
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.STRING, 0);
    }
    public override get ruleIndex(): number {
        return predicateParser.RULE_rvalue;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitRvalue) {
            return visitor.visitRvalue(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return predicateParser.RULE_exp;
    }
    public override copyFrom(ctx: ExpContext): void {
        super.copyFrom(ctx);
    }
}
export class BinaryExpContext extends ExpContext {
    public _op?: Token | null;
    public constructor(ctx: ExpContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public statExp(): StatExpContext {
        return this.getRuleContext(0, StatExpContext)!;
    }
    public rvalue(): RvalueContext {
        return this.getRuleContext(0, RvalueContext)!;
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.GT, 0);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.LT, 0);
    }
    public EQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.EQ, 0);
    }
    public LEQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.LEQ, 0);
    }
    public GEQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.GEQ, 0);
    }
    public NEQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.NEQ, 0);
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitBinaryExp) {
            return visitor.visitBinaryExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class AndExpContext extends ExpContext {
    public constructor(ctx: ExpContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public exp(): ExpContext[];
    public exp(i: number): ExpContext | null;
    public exp(i?: number): ExpContext[] | ExpContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpContext);
        }

        return this.getRuleContext(i, ExpContext);
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(predicateParser.AND, 0)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitAndExp) {
            return visitor.visitAndExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class OrExpContext extends ExpContext {
    public constructor(ctx: ExpContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public exp(): ExpContext[];
    public exp(i: number): ExpContext | null;
    public exp(i?: number): ExpContext[] | ExpContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpContext);
        }

        return this.getRuleContext(i, ExpContext);
    }
    public OR(): antlr.TerminalNode {
        return this.getToken(predicateParser.OR, 0)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitOrExp) {
            return visitor.visitOrExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class NotExpContext extends ExpContext {
    public constructor(ctx: ExpContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NOT(): antlr.TerminalNode {
        return this.getToken(predicateParser.NOT, 0)!;
    }
    public exp(): ExpContext {
        return this.getRuleContext(0, ExpContext)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitNotExp) {
            return visitor.visitNotExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class InExpContext extends ExpContext {
    public _op?: Token | null;
    public constructor(ctx: ExpContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public rvalue(): RvalueContext {
        return this.getRuleContext(0, RvalueContext)!;
    }
    public statExp(): StatExpContext {
        return this.getRuleContext(0, StatExpContext)!;
    }
    public IN(): antlr.TerminalNode {
        return this.getToken(predicateParser.IN, 0)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitInExp) {
            return visitor.visitInExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StatExpContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return predicateParser.RULE_statExp;
    }
    public override copyFrom(ctx: StatExpContext): void {
        super.copyFrom(ctx);
    }
}
export class RegressionStatExpContext extends StatExpContext {
    public _func?: Token | null;
    public constructor(ctx: StatExpContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public samplingExp(): SamplingExpContext {
        return this.getRuleContext(0, SamplingExpContext)!;
    }
    public attr(): AttrContext {
        return this.getRuleContext(0, AttrContext)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(predicateParser.ID, 0)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitRegressionStatExp) {
            return visitor.visitRegressionStatExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class SingleVarStatExpContext extends StatExpContext {
    public _func?: Token | null;
    public _num?: Token | null;
    public constructor(ctx: StatExpContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public attr(): AttrContext {
        return this.getRuleContext(0, AttrContext)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(predicateParser.ID, 0)!;
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.INT, 0);
    }
    public DOUBLE(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.DOUBLE, 0);
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitSingleVarStatExp) {
            return visitor.visitSingleVarStatExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SamplingExpContext extends antlr.ParserRuleContext {
    public _func?: Token | null;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public attr(): AttrContext {
        return this.getRuleContext(0, AttrContext)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(predicateParser.ID, 0)!;
    }
    public argsList(): ArgsListContext | null {
        return this.getRuleContext(0, ArgsListContext);
    }
    public condition(): ConditionContext | null {
        return this.getRuleContext(0, ConditionContext);
    }
    public override get ruleIndex(): number {
        return predicateParser.RULE_samplingExp;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitSamplingExp) {
            return visitor.visitSamplingExp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ConditionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return predicateParser.RULE_condition;
    }
    public override copyFrom(ctx: ConditionContext): void {
        super.copyFrom(ctx);
    }
}
export class OrConditionContext extends ConditionContext {
    public constructor(ctx: ConditionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public condition(): ConditionContext[];
    public condition(i: number): ConditionContext | null;
    public condition(i?: number): ConditionContext[] | ConditionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ConditionContext);
        }

        return this.getRuleContext(i, ConditionContext);
    }
    public OR(): antlr.TerminalNode {
        return this.getToken(predicateParser.OR, 0)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitOrCondition) {
            return visitor.visitOrCondition(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class AndConditionContext extends ConditionContext {
    public constructor(ctx: ConditionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public condition(): ConditionContext[];
    public condition(i: number): ConditionContext | null;
    public condition(i?: number): ConditionContext[] | ConditionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ConditionContext);
        }

        return this.getRuleContext(i, ConditionContext);
    }
    public AND(): antlr.TerminalNode {
        return this.getToken(predicateParser.AND, 0)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitAndCondition) {
            return visitor.visitAndCondition(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class NotConditionContext extends ConditionContext {
    public constructor(ctx: ConditionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NOT(): antlr.TerminalNode {
        return this.getToken(predicateParser.NOT, 0)!;
    }
    public condition(): ConditionContext {
        return this.getRuleContext(0, ConditionContext)!;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitNotCondition) {
            return visitor.visitNotCondition(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class SingleConditionContext extends ConditionContext {
    public _op?: Token | null;
    public constructor(ctx: ConditionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(predicateParser.ID, 0)!;
    }
    public rvalue(): RvalueContext {
        return this.getRuleContext(0, RvalueContext)!;
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.GT, 0);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.LT, 0);
    }
    public EQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.EQ, 0);
    }
    public LEQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.LEQ, 0);
    }
    public GEQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.GEQ, 0);
    }
    public NEQ(): antlr.TerminalNode | null {
        return this.getToken(predicateParser.NEQ, 0);
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitSingleCondition) {
            return visitor.visitSingleCondition(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArgsListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public attr(): AttrContext[];
    public attr(i: number): AttrContext | null;
    public attr(i?: number): AttrContext[] | AttrContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AttrContext);
        }

        return this.getRuleContext(i, AttrContext);
    }
    public override get ruleIndex(): number {
        return predicateParser.RULE_argsList;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitArgsList) {
            return visitor.visitArgsList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AttrContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ID(): antlr.TerminalNode[];
    public ID(i: number): antlr.TerminalNode | null;
    public ID(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(predicateParser.ID);
    	} else {
    		return this.getToken(predicateParser.ID, i);
    	}
    }
    public override get ruleIndex(): number {
        return predicateParser.RULE_attr;
    }
    public override accept<Result>(visitor: predicateVisitor<Result>): Result | null {
        if (visitor.visitAttr) {
            return visitor.visitAttr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
