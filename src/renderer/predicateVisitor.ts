import {
  AndExpContext,
  BinaryExpContext,
  NotExpContext,
  OrExpContext,
  predicateParser,
} from '../antlr4/predicateParser';
import { predicateVisitor } from '../antlr4/predicateVisitor';

class PredicateVisitor extends predicateVisitor<boolean | number | object> {
  private stack: any[] = [];

  public visitAndExp = (ctx: AndExpContext): boolean => {
    const l = this.visit(ctx.exp(0)!)!;
    const r = this.visit(ctx.exp(1)!)!;
    return l && r;
  };

  public visitOrExp = (ctx: OrExpContext): boolean => {
    const l = this.visit(ctx.exp(0)!)!;
    const r = this.visit(ctx.exp(1)!)!;
    return l || r;
  };

  public visitNotExp = (ctx: NotExpContext): boolean => {
    return !this.visit(ctx.exp()!)!;
  };

  public visitBinaryExp = (ctx: BinaryExpContext): boolean => {
    const statRes = this.visit(ctx.statExp()!)!;
    const value = this.visit(ctx.rvalue()!)!;
    // eslint-disable-next-line no-underscore-dangle
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
        throw new Error('Unknown operator');
    }
  };
}

export default PredicateVisitor;
