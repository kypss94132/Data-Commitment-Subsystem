import { DataFrame } from 'data-forge';
import * as dataForge from 'data-forge';
import { todo } from 'node:test';

function Mean(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).average();
}

function Median(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).median();
}

function RowsMean(df: DataFrame<number, any>): number {
  return todo();
}

function Mode(df: DataFrame<number, any>, column: string): any {
  return df.getSeries(column).mode();
}

function Range(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).range();
}

function Difference(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).range();
}

function MaximumValue(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).max();
}

function MinimumValue(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).min();
}

function TopValues(df: DataFrame<number, any>, column: string, n: number): any {
  return df
    .getSeries(column)
    .orderBy((a, b) => a - b)
    .head(n);
}

function HeadValues(
  df: DataFrame<number, any>,
  column: string,
  n: number,
): any {
  return df.getSeries(column).head(n);
}

function Variance(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).variance();
}

function StandardDeviation(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).std();
}

function Quantile(
  df: DataFrame<number, any>,
  column: string,
  q: number,
): number {
  const sortedSeries = df.getSeries(column).orderBy((a, b) => a - b);
  const n = sortedSeries.count();
  const pos = Math.floor((n - 1) * q);
  return sortedSeries.at(pos);
}

function InterquartileRange(
  df: DataFrame<number, any>,
  column: string,
): number {
  return Quantile(df, column, 0.75) - Quantile(df, column, 0.25);
}
