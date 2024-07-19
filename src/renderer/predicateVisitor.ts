/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { DataFrame } from 'data-forge';
import * as dataForge from 'data-forge';
import {
  AndConditionContext,
  AndExpContext,
  ArgsListContext,
  AttrContext,
  BinaryExpContext,
  InExpContext,
  NotConditionContext,
  NotExpContext,
  OrConditionContext,
  OrExpContext,
  RegressionStatExpContext,
  SamplingExpContext,
  SingleConditionContext,
  SingleVarStatExpContext,
  predicateParser,
} from '../antlr4/predicateParser';
import { predicateVisitor } from '../antlr4/predicateVisitor';

import {
  Difference,
  HeadValues,
  InterquartileRange,
  MaximumValue,
  Mean,
  Median,
  MinimumValue,
  Mode,
  Quantile,
  Range,
  StandardDeviation,
  Sum,
  TopValues,
  Variance,
} from './statisticalTerms';

const opMap = new Map([
  [predicateParser.EQ, '==='],
  [predicateParser.NEQ, '!=='],
  [predicateParser.GT, '>'],
  [predicateParser.GEQ, '>='],
  [predicateParser.LT, '<'],
  [predicateParser.LEQ, '<='],
]);

type Attr = {
  concept: string;
  atom: string;
};

class PredicateVisitor extends predicateVisitor<
  boolean | number | object | string
> {
  private stack: any[] = [];

  private mappings: Map<string, string>;

  private df: dataForge.DataFrame<number, any>;

  constructor(
    mappings: Map<string, string>,
    df: dataForge.DataFrame<number, any>,
  ) {
    super();
    this.mappings = mappings;
    this.df = df;
  }

  public visitAndExp = (ctx: AndExpContext): boolean => {
    const l = this.visit(ctx.exp(0)!)! as boolean;
    const r = this.visit(ctx.exp(1)!)! as boolean;
    return l && r;
  };

  public visitOrExp = (ctx: OrExpContext): boolean => {
    const l = this.visit(ctx.exp(0)!)! as boolean;
    const r = this.visit(ctx.exp(1)!)! as boolean;
    return l || r;
  };

  public visitNotExp = (ctx: NotExpContext): boolean => {
    return !(this.visit(ctx.exp()!)! as boolean);
  };

  public visitBinaryExp = (ctx: BinaryExpContext): boolean => {
    const statRes = this.visit(ctx.statExp()!)!;
    const value = this.visit(ctx.rvalue()!)!;
    switch (ctx._op!.type) {
      case predicateParser.EQ:
        return statRes === value;
      case predicateParser.NEQ:
        return statRes !== value;
      case predicateParser.GT:
        return statRes > value;
      case predicateParser.GEQ:
        return statRes >= value;
      case predicateParser.LT:
        return statRes < value;
      case predicateParser.LEQ:
        return statRes <= value;
      default:
        throw new Error(
          `${ctx._op!.line}:${ctx._op!.column} Invalid operator: ${ctx._op!.text}`,
        );
    }
  };

  public visitInExp = (ctx: InExpContext): boolean => {
    const statRes = this.visit(ctx.statExp()!)! as object | any[];
    const value = this.visit(ctx.rvalue()!)!;

    if (Array.isArray(statRes)) {
      return statRes.includes(value);
    }
    if (typeof statRes === 'object') {
      return Object.values(statRes).includes(value);
    }
    throw new Error(
      `${ctx._op!.line}:${ctx._op!.column} Invalid type for IN operator`,
    );
  };

  public visitSingleVarStatExp = (ctx: SingleVarStatExpContext): number => {
    const funcName = ctx.ID().getText();
    const attr = this.visit(ctx.attr()!) as Attr; 
    const column = this.mappings.get(attr.atom);
    if (!column) {
      throw new Error(
        `${ctx.attr()!.start!.line}:${ctx.attr()!.start!.column} Invalid atom: ${attr.atom}`,
      );
    }

    if (ctx.INT()) {
      const num = this.visit(ctx.INT()!) as number;
      switch (funcName) {
        case 'TopValues':
          return TopValues(this.df, column, num);
        case 'HeadValues':
          return HeadValues(this.df, column, num);
        default:
          throw new Error(
            `${ctx.ID()!.symbol.line}:${ctx.ID()!.symbol.column} Invalid function: ${funcName}`,
          );
      }
    }

    if (ctx.DOUBLE()) {
      const num = this.visit(ctx.DOUBLE()!) as number;
      switch (funcName) {
        case 'Quantile':
          return Quantile(this.df, column, num);
        default:
          throw new Error(
            `${ctx.ID()!.symbol.line}:${ctx.ID()!.symbol.column} Invalid function: ${funcName}`,
          );
      }
    }

    switch (funcName) {
      case 'Mean':
        return Mean(this.df, column);
      case 'Median':
        return Median(this.df, column);
      case 'Mode':
        return Mode(this.df, column);
      case 'Range':
        return Range(this.df, column);
      case 'Difference':
        return Difference(this.df, column);
      case 'MaximumValue':
        return MaximumValue(this.df, column);
      case 'MinimumValue':
        return MinimumValue(this.df, column);
      case 'Variance':
        return Variance(this.df, column);
      case 'StandardDeviation':
        return StandardDeviation(this.df, column);
      case 'InterquarterileRange':
        return InterquartileRange(this.df, column);
      case 'Sum':
        return Sum(this.df, column);
      default:
        throw new Error(
          `${ctx.ID()!.symbol.line}:${ctx.ID()!.symbol.column} Invalid function: ${funcName}`,
        );
    }
  };

  public visitRegressionStatExp = (ctx: RegressionStatExpContext): object => {
    todo();
  };

  public visitSamplingExp = (ctx: SamplingExpContext): object => {
    todo();
  };

  public visititSingleCondition = (ctx: SingleConditionContext): string => {
    const atom = ctx.ID().getText();
    const op = opMap.get(ctx._op!.type)!;
    const value = this.visit(ctx.rvalue()!)!.toString();
    return `${atom} ${op} ${value}`;
  };

  public visitAndCondition = (ctx: AndConditionContext): string => {
    const l = this.visit(ctx.condition(0)!)!;
    const r = this.visit(ctx.condition(1)!)!;
    return `(${l} AND ${r})`;
  };

  public visitOrCondition = (ctx: OrConditionContext): string => {
    const l = this.visit(ctx.condition(0)!)!;
    const r = this.visit(ctx.condition(1)!)!;
    return `(${l} OR ${r})`;
  };

  public visitNotCondition = (ctx: NotConditionContext): string => {
    return `(NOT ${this.visit(ctx.condition()!)})`;
  };

  public visitArgsList = (ctx: ArgsListContext): Attr[] => {
    return ctx.attr().map((attr) => this.visit(attr)! as Attr);
  };

  public visitAttr = (ctx: AttrContext): Attr => {
    return {
      concept: ctx.ID(0)!.getText(),
      atom: ctx.ID(1)!.getText(),
    };
  };
}
