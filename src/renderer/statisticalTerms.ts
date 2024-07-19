import { DataFrame } from 'data-forge';
import * as dataForge from 'data-forge';
import regression, { DataPoint } from 'regression';

export function Mean(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).average();
}

export function Median(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).median();
}

// function RowsMean(df: DataFrame<number, any>): number {
//   return todo();
// }

export function Mode(df: DataFrame<number, any>, column: string): any {
  return df.getSeries(column).mode();
}

export function Range(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).range();
}

export function Difference(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).range();
}

export function MaximumValue(
  df: DataFrame<number, any>,
  column: string,
): number {
  return df.getSeries(column).max();
}

export function MinimumValue(
  df: DataFrame<number, any>,
  column: string,
): number {
  return df.getSeries(column).min();
}

export function TopValues(
  df: DataFrame<number, any>,
  column: string,
  n: number,
): any {
  return df
    .getSeries(column)
    .orderBy((a, b) => a - b)
    .head(n);
}

export function HeadValues(
  df: DataFrame<number, any>,
  column: string,
  n: number,
): any {
  return df.getSeries(column).head(n);
}

export function Variance(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).variance();
}

export function StandardDeviation(
  df: DataFrame<number, any>,
  column: string,
): number {
  return df.getSeries(column).std();
}

export function Quantile(
  df: DataFrame<number, any>,
  column: string,
  q: number,
): number {
  const sortedSeries = df.getSeries(column).orderBy((a, b) => a - b);
  const n = sortedSeries.count();
  const pos = Math.floor((n - 1) * q);
  return sortedSeries.at(pos);
}

export function InterquartileRange(
  df: DataFrame<number, any>,
  column: string,
): number {
  return Quantile(df, column, 0.75) - Quantile(df, column, 0.25);
}

export function Sum(df: DataFrame<number, any>, column: string): number {
  return df.getSeries(column).sum();
}

export function LinearRegression(
  df: DataFrame<number, any>,
  column1: string,
  column2: string,
): any {
  const arr1 = df.getSeries(column1).toArray();
  const arr2 = df.getSeries(column2).toArray();
  const arr = arr1.map((_, i) => [arr1[i], arr2[i]] as DataPoint);
  return regression.linear(arr);
}

// function LogisticalRegression(
//   df: DataFrame<number, any>,
//   column1: string,
//   column2: string,
// ): any {
//   return df.stat.logisticRegression(column1, column2);
// }
