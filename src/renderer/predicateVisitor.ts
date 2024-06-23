/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { todo } from 'node:test';
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

  public visitSingleVarStatExp = (ctx: SingleVarStatExpContext): boolean => {
    todo();
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

export default PredicateVisitor;
