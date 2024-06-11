// Generated from d:/DIS_platform/src/antlr4/predicate.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { RvalueContext } from "./predicateParser.js";
import { BinaryExpContext } from "./predicateParser.js";
import { AndExpContext } from "./predicateParser.js";
import { OrExpContext } from "./predicateParser.js";
import { NotExpContext } from "./predicateParser.js";
import { InExpContext } from "./predicateParser.js";
import { SingleVarStatExpContext } from "./predicateParser.js";
import { RegressionStatExpContext } from "./predicateParser.js";
import { SamplingExpContext } from "./predicateParser.js";
import { OrConditionContext } from "./predicateParser.js";
import { AndConditionContext } from "./predicateParser.js";
import { NotConditionContext } from "./predicateParser.js";
import { SingleConditionContext } from "./predicateParser.js";
import { ArgsListContext } from "./predicateParser.js";
import { AttrContext } from "./predicateParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `predicateParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class predicateVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `predicateParser.rvalue`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRvalue?: (ctx: RvalueContext) => Result;
    /**
     * Visit a parse tree produced by the `binaryExp`
     * labeled alternative in `predicateParser.exp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBinaryExp?: (ctx: BinaryExpContext) => Result;
    /**
     * Visit a parse tree produced by the `andExp`
     * labeled alternative in `predicateParser.exp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAndExp?: (ctx: AndExpContext) => Result;
    /**
     * Visit a parse tree produced by the `orExp`
     * labeled alternative in `predicateParser.exp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitOrExp?: (ctx: OrExpContext) => Result;
    /**
     * Visit a parse tree produced by the `notExp`
     * labeled alternative in `predicateParser.exp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNotExp?: (ctx: NotExpContext) => Result;
    /**
     * Visit a parse tree produced by the `InExp`
     * labeled alternative in `predicateParser.exp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInExp?: (ctx: InExpContext) => Result;
    /**
     * Visit a parse tree produced by the `singleVarStatExp`
     * labeled alternative in `predicateParser.statExp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSingleVarStatExp?: (ctx: SingleVarStatExpContext) => Result;
    /**
     * Visit a parse tree produced by the `regressionStatExp`
     * labeled alternative in `predicateParser.statExp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRegressionStatExp?: (ctx: RegressionStatExpContext) => Result;
    /**
     * Visit a parse tree produced by `predicateParser.samplingExp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSamplingExp?: (ctx: SamplingExpContext) => Result;
    /**
     * Visit a parse tree produced by the `orCondition`
     * labeled alternative in `predicateParser.condition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitOrCondition?: (ctx: OrConditionContext) => Result;
    /**
     * Visit a parse tree produced by the `andCondition`
     * labeled alternative in `predicateParser.condition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAndCondition?: (ctx: AndConditionContext) => Result;
    /**
     * Visit a parse tree produced by the `notCondition`
     * labeled alternative in `predicateParser.condition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNotCondition?: (ctx: NotConditionContext) => Result;
    /**
     * Visit a parse tree produced by the `singleCondition`
     * labeled alternative in `predicateParser.condition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSingleCondition?: (ctx: SingleConditionContext) => Result;
    /**
     * Visit a parse tree produced by `predicateParser.argsList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArgsList?: (ctx: ArgsListContext) => Result;
    /**
     * Visit a parse tree produced by `predicateParser.attr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAttr?: (ctx: AttrContext) => Result;
}

